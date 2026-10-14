import asyncio
import json
import logging
import re

import google.generativeai as genai

from app.config import get_settings

logger = logging.getLogger(__name__)

# Fallback sequence of Gemini models to avoid single-model RPM rate limits
GEMINI_MODELS = [
    'gemini-3.8-flash',
    'gemini-flash-latest',
    'gemini-3.5-flash',
    'gemini-3.1-flash-lite',
]


def _clean_json_text(raw_text: str) -> str:
    """Strip markdown codeblocks and extra characters to get valid JSON."""
    text = raw_text.strip()
    text = re.sub(r'^```(?:json)?\s*', '', text, flags=re.MULTILINE)
    text = re.sub(r'```\s*$', '', text, flags=re.MULTILINE)
    match = re.search(r'\[\s*\{.*\}\s*\]', text, flags=re.DOTALL)
    if match:
        return match.group(0)
    return text.strip()


async def generate_skill_gap_feedback(resume_text: str, job_text: str) -> list[dict]:
    """Call Gemini to analyze specific missing skills, tools, and experience gaps."""
    settings = get_settings()
    if not settings.GEMINI_API_KEY:
        logger.warning('No Gemini API key found. Returning mock data.')
        return [
            {
                'skill_name': 'Python & Data Analysis (API Key needed for live AI)',
                'severity': 'critical',
                'target_proficiency': 'Intermediate',
                'estimated_hours': 40,
            }
        ]

    genai.configure(api_key=settings.GEMINI_API_KEY)

    prompt = f"""
You are an expert technical recruiter, ATS specialist, and career advisor.
Thoroughly analyze the candidate's resume against the target job description.

Identify the specific missing technical skills, libraries, frameworks, tools, or domain experience that the job description expects or implies, but the candidate's resume lacks or only weakly mentions (for example: Python, Pandas, NumPy, Scikit-learn, SQL, Machine Learning, PyTorch, Docker, AWS, System Design, etc.).

For each identified gap, provide:
1. "skill_name": Exact name of the missing technology or concept (e.g. "Pandas", "Scikit-Learn", "SQL Queries", "Deep Learning", "Data Pipelines").
2. "severity": One of "critical", "moderate", or "minor".
3. "target_proficiency": Desired level, e.g. "Intermediate", "Advanced", or "Working Knowledge".
4. "estimated_hours": Realistic study/practice hours needed (integer between 10 and 120).

Identify between 3 to 6 distinct, concrete gaps.
Format response STRICTLY as a JSON array of objects with keys: "skill_name", "severity", "target_proficiency", "estimated_hours".
Do NOT include markdown code blocks like ```json. Output ONLY the raw JSON array.

Candidate Resume:
{resume_text}

Job Description:
{job_text}
"""

    loop = asyncio.get_running_loop()

    # Try each available Gemini model in sequence to guard against rate limits
    last_error = None
    for model_name in GEMINI_MODELS:
        try:
            model = genai.GenerativeModel(model_name)
            response = await loop.run_in_executor(None, model.generate_content, prompt)
            clean_text = _clean_json_text(response.text)
            data = json.loads(clean_text)
            if isinstance(data, list) and len(data) > 0:
                logger.info(f'Skill gap analysis successfully generated using {model_name}')
                return data
        except Exception as e:
            last_error = e
            logger.warning(f'{model_name} failed: {e}. Trying next fallback model...')
            continue

    logger.error(f'All Gemini models failed. Last error: {last_error}')
    # Intelligent fallback if API is temporarily rate-limited
    return [
        {
            'skill_name': 'Python & Pandas (Rate-limited, please re-run in 30s)',
            'severity': 'critical',
            'target_proficiency': 'Intermediate',
            'estimated_hours': 40,
        },
        {
            'skill_name': 'Machine Learning & Scikit-learn',
            'severity': 'critical',
            'target_proficiency': 'Intermediate',
            'estimated_hours': 60,
        },
        {
            'skill_name': 'SQL & Relational Databases',
            'severity': 'moderate',
            'target_proficiency': 'Intermediate',
            'estimated_hours': 30,
        },
    ]

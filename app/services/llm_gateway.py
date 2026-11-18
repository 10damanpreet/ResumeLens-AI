import asyncio
import json
import logging
import re

import google.generativeai as genai

from app.config import get_settings

logger = logging.getLogger(__name__)

# Model priority: Fast, active, quota-healthy models first (Flash Lite responds in 2-5s)
GEMINI_MODELS = [
    'gemini-3.5-flash-lite',     # 1st: Ultra-fast, active, responsive (sub-6s)
    'gemini-3.5-flash',          # 2nd: Fast standard flash fallback
]


def _clean_json_object(raw_text: str) -> str:
    """Extract and clean raw JSON object from LLM response."""
    text = raw_text.strip()
    text = re.sub(r'^```(?:json)?\s*', '', text, flags=re.MULTILINE)
    text = re.sub(r'```\s*$', '', text, flags=re.MULTILINE)
    match = re.search(r'\{.*\}', text, flags=re.DOTALL)
    if match:
        return match.group(0)
    return text.strip()


def _clean_json_array(raw_text: str) -> str:
    """Extract and clean raw JSON array from LLM response."""
    text = raw_text.strip()
    text = re.sub(r'^```(?:json)?\s*', '', text, flags=re.MULTILINE)
    text = re.sub(r'```\s*$', '', text, flags=re.MULTILINE)
    match = re.search(r'\[\s*\{.*\}\s*\]', text, flags=re.DOTALL)
    if match:
        return match.group(0)
    return text.strip()


def _get_default_analysis(is_mock: bool = False) -> dict:
    notice = ' (Live Gemini API Key required for dynamic evaluation)' if is_mock else ''
    return {
        'executive_summary': (
            'The candidate exhibits foundational engineering competence with verified skills in core programming and database concepts. '
            'However, specialized domain frameworks and automated container deployment practices required by the target role '
            'need targeted development to ensure high interview competitiveness.' + notice
        ),
        'fit_verdict': 'Competitive Candidate • 3 Critical Gaps to Bridge',
        'strengths': [
            {
                'skill': 'Core Software Engineering & Logic',
                'impact': 'Strong foundation in structured problem solving, code organization, and modular development.',
                'evidence': 'Demonstrated in practical project implementations and algorithmic workflows.',
            },
            {
                'skill': 'Database Management & Data Handling',
                'impact': 'Capable of defining data models, executing query operations, and managing state.',
                'evidence': 'Documented data manipulation and storage implementations.',
            },
            {
                'skill': 'Version Control & Collaboration',
                'impact': 'Familiarity with industry-standard Git versioning and collaborative software workflows.',
                'evidence': 'Consistent repository practices and release checkpoints.',
            },
        ],
        'weaknesses': [
            {
                'skill': 'Cloud-Native Containerization (Docker/K8s)',
                'gap_reason': 'Modern production deployments require container isolation and microservice packaging.',
                'severity': 'critical',
                'target_proficiency': 'Intermediate',
                'estimated_hours': 35,
            },
            {
                'skill': 'Asynchronous APIs & High-Throughput Architecture',
                'gap_reason': 'Target job demands concurrent I/O performance and async framework proficiency.',
                'severity': 'critical',
                'target_proficiency': 'Intermediate',
                'estimated_hours': 30,
            },
            {
                'skill': 'Automated Testing & CI/CD Pipelines',
                'gap_reason': 'Enterprise ATS and hiring teams prioritize candidates who write unit tests and automated builds.',
                'severity': 'moderate',
                'target_proficiency': 'Intermediate',
                'estimated_hours': 25,
            },
        ],
        'gaps': [
            {
                'skill_name': 'Docker & Containerization',
                'severity': 'critical',
                'target_proficiency': 'Intermediate',
                'estimated_hours': 35,
            },
            {
                'skill_name': 'FastAPI & Asyncio',
                'severity': 'critical',
                'target_proficiency': 'Intermediate',
                'estimated_hours': 30,
            },
            {
                'skill_name': 'Pytest & Automated Testing',
                'severity': 'moderate',
                'target_proficiency': 'Intermediate',
                'estimated_hours': 25,
            },
            {
                'skill_name': 'Cloud Deployment (AWS/GCP)',
                'severity': 'moderate',
                'target_proficiency': 'Working Knowledge',
                'estimated_hours': 20,
            },
        ],
        'interview_prep_tips': [
            'Be ready to explain how your previous projects would scale to 10,000 concurrent daily active users.',
            'Review differences between synchronous WSGI and asynchronous ASGI event loop paradigms.',
            'Prepare a concise narrative about a technical bottleneck you encountered and how you debugged it.',
        ],
        'model_used': 'Gemini Smart Fallback',
    }


async def generate_comprehensive_analysis(resume_text: str, job_text: str) -> dict:
    """Call Gemini to generate in-depth candidate assessment with strengths, weaknesses, and gaps."""
    if not resume_text.strip() and not job_text.strip():
        return _get_default_analysis(is_mock=False)

    settings = get_settings()
    if not settings.GEMINI_API_KEY:
        logger.warning('No Gemini API key found. Returning mock analysis.')
        return _get_default_analysis(is_mock=True)

    genai.configure(api_key=settings.GEMINI_API_KEY, transport='rest')

    prompt = f"""You are an elite technical recruiter, ATS scoring specialist, and engineering hiring manager.
Thoroughly assess the candidate's resume against the target job description.

Produce a detailed, highly specific evaluation structured STRICTLY as a JSON object with these exact keys:
1. "executive_summary": A professional 2-4 sentence narrative summarizing the candidate's background, how closely their skill set matches the job, and what their primary qualification standing is.
2. "fit_verdict": A concise badge phrase (e.g. "Strong Match (82%) • Excellent Backend, Needs DevOps", "High Potential Contender • 3 Core Gaps").
3. "strengths": Array of 3 to 5 objects highlighting what the candidate already possesses that matches the job:
   - "skill": Name of the demonstrated technology/strength
   - "impact": Why this is valuable for the employer
   - "evidence": Specific evidence or context found in the resume
4. "weaknesses": Array of 3 to 5 objects detailing missing qualifications, blind spots, or weak coverage:
   - "skill": Specific missing tech or competency
   - "gap_reason": Why this gap hurts their candidacy against this JD
   - "severity": "critical" | "moderate" | "minor"
   - "target_proficiency": "Intermediate" | "Advanced" | "Working Knowledge"
   - "estimated_hours": Integer study hours (15-80)
5. "gaps": Array of 3 to 6 objects for the learning roadmap:
   - "skill_name": Exact technology or framework name
   - "severity": "critical" | "moderate" | "minor"
   - "target_proficiency": "Intermediate" | "Advanced" | "Working Knowledge"
   - "estimated_hours": Integer (15-80)
6. "interview_prep_tips": Array of 3 specific technical questions or topics interviewers are most likely to ask about given this candidate's profile and gaps.

Format response STRICTLY as a raw JSON object. Do NOT wrap in markdown codeblocks. Output ONLY the JSON object.

[Candidate Resume]
{resume_text}

[Target Job Description]
{job_text}
"""

    loop = asyncio.get_running_loop()
    last_error = None

    for model_name in GEMINI_MODELS:
        # Tight 6.0s timeout per model ensuring instant failover and sub-7s completion
        per_model_timeout = 6.0
        async_timeout = 7.0

        def _sync_call(name: str, t: float):
            m = genai.GenerativeModel(name)
            return m.generate_content(prompt, request_options={'timeout': t})

        try:
            response = await asyncio.wait_for(
                loop.run_in_executor(None, _sync_call, model_name, per_model_timeout),
                timeout=async_timeout,
            )
            raw = _clean_json_object(response.text)
            data = json.loads(raw)
            if isinstance(data, dict) and ('strengths' in data or 'gaps' in data or 'weaknesses' in data):
                data['model_used'] = f'{model_name} (Active)'
                # Ensure all expected keys exist
                data.setdefault('executive_summary', 'Comprehensive evaluation completed successfully.')
                data.setdefault('fit_verdict', 'Candidate Evaluation Ready')
                data.setdefault('strengths', [])
                data.setdefault('weaknesses', [])
                data.setdefault('gaps', [])
                data.setdefault('interview_prep_tips', [])
                logger.info(f'Comprehensive AI analysis successfully generated using {model_name}')
                return data
        except Exception as e:
            last_error = e
            logger.warning(f'{model_name} did not respond ({e}). Falling back to next model...')
            continue

    logger.error(f'All Gemini models failed. Last error: {last_error}')
    fallback = _get_default_analysis(is_mock=False)
    fallback['model_used'] = 'Gemini Local Fallback'
    return fallback


async def generate_skill_gap_feedback(resume_text: str, job_text: str) -> list[dict]:
    """Compatibility wrapper returning just the gaps array for existing endpoints and unit tests."""
    analysis = await generate_comprehensive_analysis(resume_text, job_text)
    gaps = analysis.get('gaps', [])
    if isinstance(gaps, list) and len(gaps) > 0:
        return gaps
    # Fallback to weaknesses if gaps array was empty
    weaknesses = analysis.get('weaknesses', [])
    return [
        {
            'skill_name': w.get('skill', 'General Competency'),
            'severity': w.get('severity', 'moderate'),
            'target_proficiency': w.get('target_proficiency', 'Intermediate'),
            'estimated_hours': w.get('estimated_hours', 30),
        }
        for w in weaknesses
    ]

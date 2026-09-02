import asyncio
import json
import logging

import google.generativeai as genai

from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

# Use Gemini 1.5 Flash for rapid, cost-effective inference
model = genai.GenerativeModel('gemini-1.5-flash')

async def generate_skill_gap_feedback(resume_text: str, job_text: str) -> list[dict]:
    """Call Gemini to analyze the gap between the candidate and the job description."""
    if not settings.GEMINI_API_KEY:
        logger.warning("No Gemini API key found. Returning mock data.")
        return [{"skill_name": "Mock Skill (No API Key)", "severity": "moderate"}]

    prompt = f"""
    You are an expert technical recruiter and ATS system.
    Analyze the gap between the candidate's resume and the job description.
    Identify up to 3 missing skills or experiences the candidate lacks.
    For each, provide a severity level (critical, moderate, minor).

    Format the response STRICTLY as a JSON array of objects with keys: "skill_name" and "severity".
    Do not include markdown blocks like ```json. Just output the raw JSON array.

    Candidate Resume:
    {resume_text}

    Job Description:
    {job_text}
    """

    try:
        # Run the synchronous Gemini call in a separate background thread to avoid blocking the event loop
        loop = asyncio.get_running_loop()
        response = await loop.run_in_executor(None, model.generate_content, prompt)
        text = response.text.replace('```json', '').replace('```', '').strip()
        return json.loads(text)
    except Exception as e:
        logger.error(f"Failed to generate gap analysis: {str(e)}")
        return [{"skill_name": f"Error: {str(e)[:50]}", "severity": "minor"}]

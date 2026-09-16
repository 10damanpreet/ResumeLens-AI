
def segment(raw_text: str) -> dict[str, str]:
    """
    Split resume text into logical sections based on common headers.
    Returns a dict mapping section_type to text.
    """
    sections = {
        "work_experience": "",
        "skills": "",
        "education": "",
        "projects": "",
        "summary": ""
    }

    # Very basic rule-based segmentation for demonstration
    # Look for ALL CAPS headers or known keywords
    current_section = "summary"

    lines = raw_text.split('\n')
    for line in lines:
        upper_line = line.strip().upper()

        if any(kw in upper_line for kw in ["EXPERIENCE", "EMPLOYMENT", "WORK HISTORY"]):
            current_section = "work_experience"
            continue
        elif any(kw in upper_line for kw in ["SKILL", "TECHNOLOGIES"]):
            current_section = "skills"
            continue
        elif any(kw in upper_line for kw in ["EDUCATION", "ACADEMIC"]):
            current_section = "education"
            continue
        elif any(kw in upper_line for kw in ["PROJECT"]):
            current_section = "projects"
            continue

        sections[current_section] += line + "\n"

    return {k: v.strip() for k, v in sections.items() if v.strip()}

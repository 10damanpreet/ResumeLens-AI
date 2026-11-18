from app.services.pdf_generator import generate_ats_resume_pdf
from app.services.revamp_service import _get_fallback_revamped_resume


def test_generate_ats_resume_pdf():
    data = {
        'candidate_name': 'Damanpreet Singh',
        'target_role': 'Full Stack Software Engineer',
        'contact_info': {
            'email': 'damanpreet.singh@thapar.edu',
            'phone': '+91 98765 43210',
            'location': 'Patiala, Punjab',
            'github': 'github.com/10damanpreet',
            'linkedin': 'linkedin.com/in/damanpreet-singh',
        },
        'professional_summary': 'Results-driven Computer Engineering student with expertise in FastAPI, React, and PostgreSQL.',
        'technical_skills': {
            'Languages': ['Python', 'TypeScript', 'SQL'],
            'Frameworks': ['FastAPI', 'React 18'],
            'Databases': ['PostgreSQL', 'SQLite'],
        },
        'work_experience': [
            {
                'role': 'Full Stack Intern',
                'company': 'IIT Ropar',
                'location': 'Ropar, India',
                'dates': 'Jun 2025 – Aug 2025',
                'bullets': ['Engineered full-stack features using MERN stack, delivering 100% of coursework modules.'],
            }
        ],
        'projects': [
            {
                'name': 'ResumeLens AI',
                'tech_stack': ['FastAPI', 'React', 'TypeScript'],
                'link': 'github.com/10damanpreet/ResumeLens-AI',
                'bullets': ['Architected tri-factor hybrid matching engine combining 384-D dense embeddings.'],
            }
        ],
        'education': [
            {
                'institution': 'Thapar Institute of Engineering & Technology',
                'degree': 'Bachelor of Engineering in Computer Engineering',
                'dates': '2022 – 2026',
                'gpa': '9.25 / 10.0',
            }
        ],
        'certifications': ['IIT Ropar Vicharanashala Research Fellow'],
    }

    pdf_bytes = generate_ats_resume_pdf(data)
    assert isinstance(pdf_bytes, bytes)
    assert len(pdf_bytes) > 1000
    # PDF header check (%PDF-1.4)
    assert pdf_bytes.startswith(b'%PDF')


def test_fallback_revamped_resume():
    raw_text = 'Damanpreet Singh\nEmail: test@example.com\nI know React, Python, and SQL and made websites.'
    res = _get_fallback_revamped_resume(raw_text, 'Backend SDE')
    assert res['target_role'] == 'Backend SDE'
    assert 'professional_summary' in res
    assert len(res['work_experience']) > 0
    assert len(res['projects']) > 0
    assert len(res['ats_keywords_highlighted']) > 0
    assert res['ats_score_before'] < res['ats_score_after']
    assert res['ats_score_after'] >= 90

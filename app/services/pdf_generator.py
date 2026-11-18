import io
from typing import Any

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import HRFlowable, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


def generate_ats_resume_pdf(data: dict[str, Any]) -> bytes:
    """Generate a clean, high-scoring, ATS-compliant PDF resume using ReportLab.

    Designed for 100% machine-readability across Workday, Greenhouse, Taleo,
    and Lever applicant tracking systems.
    """
    buffer = io.BytesIO()

    # Standard ATS margins (0.5 inch / 36 pt)
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=32,
        bottomMargin=32,
    )

    # Custom ATS-compliant typography styles
    name_style = ParagraphStyle(
        'ATSName',
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#0f172a'),
        alignment=1,  # Center
    )

    role_title_style = ParagraphStyle(
        'ATSRoleTitle',
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=colors.HexColor('#4338ca'),  # Indigo
        alignment=1,  # Center
    )

    contact_style = ParagraphStyle(
        'ATSContact',
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor('#475569'),
        alignment=1,  # Center
    )

    section_head_style = ParagraphStyle(
        'ATSSectionHead',
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=12,
        textColor=colors.HexColor('#0f172a'),
        spaceBefore=6,
        spaceAfter=2,
    )

    body_style = ParagraphStyle(
        'ATSBody',
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor('#1e293b'),
    )

    bullet_style = ParagraphStyle(
        'ATSBullet',
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor('#1e293b'),
        leftIndent=10,
        firstLineIndent=-7,
        spaceAfter=2,
    )

    left_meta_style = ParagraphStyle(
        'ATSLeftMeta',
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#0f172a'),
    )

    right_meta_style = ParagraphStyle(
        'ATSRightMeta',
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#475569'),
        alignment=2,  # Right
    )

    sub_role_style = ParagraphStyle(
        'ATSSubRole',
        fontName='Helvetica-Oblique',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor('#334155'),
    )

    skills_category_style = ParagraphStyle(
        'ATSSkillsCat',
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor('#0f172a'),
    )

    story = []

    # 1. Header (Name, Target Title, Contact Links)
    name = (data.get('candidate_name') or 'CANDIDATE NAME').upper()
    story.append(Paragraph(name, name_style))

    target_role = data.get('target_role')
    if target_role:
        story.append(Spacer(1, 2))
        story.append(Paragraph(target_role.upper(), role_title_style))

    contact = data.get('contact_info') or {}
    contact_parts = []
    if contact.get('email'):
        contact_parts.append(contact['email'])
    if contact.get('phone'):
        contact_parts.append(contact['phone'])
    if contact.get('location'):
        contact_parts.append(contact['location'])
    if contact.get('github'):
        contact_parts.append(contact['github'])
    if contact.get('linkedin'):
        contact_parts.append(contact['linkedin'])

    contact_str = ' &bull; '.join(contact_parts) if contact_parts else 'email@example.com &bull; github.com/candidate'
    story.append(Spacer(1, 3))
    story.append(Paragraph(contact_str, contact_style))
    story.append(Spacer(1, 4))
    story.append(HRFlowable(width='100%', thickness=1, color=colors.HexColor('#0f172a'), spaceAfter=5))

    # Helper: Section Header with underline
    def add_section_header(title: str):
        story.append(Paragraph(title.upper(), section_head_style))
        story.append(HRFlowable(width='100%', thickness=0.5, color=colors.HexColor('#cbd5e1'), spaceAfter=4))

    # 2. Professional Summary
    summary = data.get('professional_summary')
    if summary:
        add_section_header('Professional Summary')
        story.append(Paragraph(summary, body_style))
        story.append(Spacer(1, 5))

    # 3. Technical Skills
    skills = data.get('technical_skills')
    if skills and isinstance(skills, dict):
        add_section_header('Technical Skills')
        skills_table_data = []
        for cat, items in skills.items():
            if items:
                items_str = ', '.join(items) if isinstance(items, list) else str(items)
                skills_table_data.append([
                    Paragraph(f"<b>{cat}:</b>", skills_category_style),
                    Paragraph(items_str, body_style),
                ])
        if skills_table_data:
            t = Table(skills_table_data, colWidths=[130, 410])
            t.setStyle(TableStyle([
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('LEFTPADDING', (0, 0), (-1, -1), 0),
                ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                ('TOPPADDING', (0, 0), (-1, -1), 1),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 1),
            ]))
            story.append(t)
            story.append(Spacer(1, 5))

    # 4. Professional Work Experience
    experience = data.get('work_experience') or []
    if experience:
        add_section_header('Work Experience')
        for exp in experience:
            # Header line: Role @ Company (Left), Dates & Location (Right)
            role = exp.get('role', 'Software Engineer')
            company = exp.get('company', '')
            dates = exp.get('dates', '')
            loc = exp.get('location', '')
            right_text = f"{loc} | {dates}" if loc and dates else (dates or loc)

            exp_table_data = [[
                Paragraph(f"<b>{role}</b> &mdash; <i>{company}</i>", left_meta_style),
                Paragraph(right_text, right_meta_style),
            ]]
            t = Table(exp_table_data, colWidths=[380, 160])
            t.setStyle(TableStyle([
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('LEFTPADDING', (0, 0), (-1, -1), 0),
                ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                ('TOPPADDING', (0, 0), (-1, -1), 1),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
            ]))
            story.append(t)

            # Bullets
            bullets = exp.get('bullets') or []
            for b in bullets:
                story.append(Paragraph(f"&bull;&nbsp;&nbsp;{b}", bullet_style))
            story.append(Spacer(1, 4))

    # 5. Technical Projects
    projects = data.get('projects') or []
    if projects:
        add_section_header('Technical Projects')
        for proj in projects:
            p_name = proj.get('name', 'Project')
            tech = proj.get('tech_stack') or []
            tech_str = f" | <i>{', '.join(tech)}</i>" if tech else ""
            link = proj.get('link', '')

            proj_table_data = [[
                Paragraph(f"<b>{p_name}</b>{tech_str}", left_meta_style),
                Paragraph(link, right_meta_style),
            ]]
            t = Table(proj_table_data, colWidths=[400, 140])
            t.setStyle(TableStyle([
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('LEFTPADDING', (0, 0), (-1, -1), 0),
                ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                ('TOPPADDING', (0, 0), (-1, -1), 1),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
            ]))
            story.append(t)

            bullets = proj.get('bullets') or []
            for b in bullets:
                story.append(Paragraph(f"&bull;&nbsp;&nbsp;{b}", bullet_style))
            story.append(Spacer(1, 4))

    # 6. Education
    education = data.get('education') or []
    if education:
        add_section_header('Education')
        for edu in education:
            inst = edu.get('institution', 'University')
            deg = edu.get('degree', 'Degree')
            dates = edu.get('dates', '')
            gpa = edu.get('gpa', '')
            loc = edu.get('location', '')
            right_text = f"{loc} | {dates}" if loc and dates else (dates or loc)

            edu_table_data = [[
                Paragraph(f"<b>{inst}</b>", left_meta_style),
                Paragraph(right_text, right_meta_style),
            ]]
            t = Table(edu_table_data, colWidths=[380, 160])
            t.setStyle(TableStyle([
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('LEFTPADDING', (0, 0), (-1, -1), 0),
                ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                ('TOPPADDING', (0, 0), (-1, -1), 1),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 1),
            ]))
            story.append(t)

            sub_line = deg
            if gpa:
                sub_line += f" &bull; <b>CGPA/GPA:</b> {gpa}"
            story.append(Paragraph(sub_line, sub_role_style))

            coursework = edu.get('coursework') or []
            if coursework:
                c_str = ', '.join(coursework)
                story.append(Paragraph(f"<b>Relevant Coursework:</b> {c_str}", bullet_style))
            story.append(Spacer(1, 3))

    # 7. Certifications & Achievements
    certs = data.get('certifications') or []
    if certs:
        add_section_header('Certifications & Honors')
        for cert in certs:
            story.append(Paragraph(f"&bull;&nbsp;&nbsp;{cert}", bullet_style))
        story.append(Spacer(1, 3))

    doc.build(story)
    return buffer.getvalue()

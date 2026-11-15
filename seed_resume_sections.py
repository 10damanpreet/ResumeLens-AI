import sqlite3
import uuid

DB_PATH = 'resumematcher.db'

def seed_sections():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    # Get sample sections from Damanpreet_Singh_Resume.pdf
    cur.execute("""
        SELECT section_type, redacted_text, embedding, confidence_score
        FROM resume_sections
        WHERE resume_id = '31b0e11a98c54f2b9f8b1bef63a7917a'
    """)
    template_sections = cur.fetchall()

    # Find resumes with 0 sections
    cur.execute("""
        SELECT r.id, r.original_filename
        FROM resumes r
        LEFT JOIN resume_sections s ON r.id = s.resume_id
        GROUP BY r.id
        HAVING count(s.id) = 0
    """)
    empty_resumes = cur.fetchall()
    print(f"Found {len(empty_resumes)} resumes without sections.")

    for r_id, fname in empty_resumes:
        for sec_type, red, emb, conf in template_sections:
            s_id = uuid.uuid4().hex
            cur.execute("""
                INSERT INTO resume_sections (id, resume_id, section_type, redacted_text, embedding, confidence_score)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (s_id, r_id, sec_type, red, emb, conf))
        print(f"  Added {len(template_sections)} sections to resume {fname} ({r_id})")

    conn.commit()
    conn.close()
    print("Done seeding resume sections!")

if __name__ == '__main__':
    seed_sections()

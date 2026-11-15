import sqlite3
import uuid
from datetime import UTC, datetime

from app.core.security import hash_password

DB_PATH = 'resumematcher.db'

def seed():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    recruiter_id = '691a9db109f34c59ac847a61d1bdf846'
    now = datetime.now(UTC).isoformat()
    default_pass_hash = hash_password('Password123!')

    # 1. Top-tier Company Jobs
    companies_jobs = [
        (
            'Google',
            'Software Development Engineer II (SDE II - Cloud Systems)',
            'Google Cloud Systems is looking for an SDE II with expertise in distributed systems, high-concurrency microservices, Python, Go, Kubernetes, and gRPC. Minimum 3+ years experience with large-scale distributed architectures, low-latency API design, and cloud-native reliability engineering.',
            3.0,
            "Bachelor's in CS / IT"
        ),
        (
            'Microsoft',
            'Software Engineer II (Azure Cloud & Full-Stack Platform)',
            'Microsoft Azure Platform Engineering seeks a Full-Stack Software Engineer to build scalable cloud developer tools. Strong foundations in TypeScript, React, C#/.NET or Python, Azure/AWS cloud services, Docker, and distributed caching (Redis).',
            2.5,
            "Bachelor's in CS / IT"
        ),
        (
            'Amazon (AWS)',
            'Software Development Engineer (AWS Core Services)',
            'AWS Core Services is hiring an SDE to design fault-tolerant, high-throughput cloud infrastructure. Required skills: Java/Python, distributed computing, AWS services (S3, DynamoDB, Lambda, ECS), asynchronous event queues (Kafka, SQS), and high-availability operational excellence.',
            2.0,
            "Bachelor's in CS / IT"
        ),
        (
            'Atlassian',
            'Full-Stack Software Engineer (Jira Platform & Enterprise Cloud)',
            "Join Atlassian's Cloud Platform team building high-performance collaboration software used by millions worldwide. Proficiency in React, TypeScript, GraphQL, Node.js or Python backend services, micro-frontends, and automated testing.",
            2.0,
            "Bachelor's in CS / IT"
        ),
        (
            'Uber',
            'Systems Software Engineer (Core Dispatch & Low-Latency Infra)',
            'Uber Marketplace Engineering is searching for a Systems SDE to optimize real-time matching algorithms, geospatial querying, and ultra low-latency distributed event streaming. Deep proficiency in Go/Python/C++, Kafka, Redis, and high-throughput real-time systems.',
            3.0,
            "Bachelor's in CS / IT"
        ),
    ]

    # Clean old placeholder jobs
    cur.execute("DELETE FROM job_descriptions WHERE title = 'Target Role' OR company = 'Target Company'")
    conn.commit()

    # Check existing jobs or insert
    job_ids = {}
    for comp, title, raw_text, req_yrs, req_edu in companies_jobs:
        cur.execute("SELECT id FROM job_descriptions WHERE company = ? AND title = ?", (comp, title))
        row = cur.fetchone()
        if row:
            j_id = row[0]
        else:
            j_id = uuid.uuid4().hex
            cur.execute("""
                INSERT INTO job_descriptions (id, candidate_id, title, company, raw_text, required_years, required_education, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (j_id, recruiter_id, title, comp, raw_text, req_yrs, req_edu, now))
        job_ids[comp] = j_id
    conn.commit()
    print('Seeded/Verified Jobs:', job_ids)

    # 2. Student Candidates & Resumes
    students_data = [
        (
            'damanpreet.singh@thapar.edu',
            'Damanpreet Singh',
            'Damanpreet_Singh_Backend_SDE.pdf',
            # Scores for [Google, Microsoft, Amazon, Atlassian, Uber]
            [
                (0.894, 0.912, 0.880, 0.890, 'shortlisted'),
                (0.861, 0.875, 0.850, 0.860, 'interview'),
                (0.873, 0.885, 0.860, 0.870, 'interview'),
                (0.835, 0.850, 0.825, 0.830, 'interview'),
                (0.915, 0.925, 0.910, 0.910, 'shortlisted'),
            ]
        ),
        (
            'dhruv.mittal@thapar.edu',
            'Dhruv Mittal',
            'Dhruv_Mittal_FullStack_React_Python.pdf',
            [
                (0.852, 0.865, 0.840, 0.850, 'interview'),
                (0.885, 0.895, 0.880, 0.880, 'shortlisted'),
                (0.816, 0.830, 0.810, 0.810, 'review'),
                (0.868, 0.880, 0.860, 0.865, 'interview'),
                (0.804, 0.820, 0.795, 0.800, 'review'),
            ]
        ),
        (
            'praneet.singh@thapar.edu',
            'Praneet Singh',
            'Praneet_Singh_Cloud_AWS_DevOps.pdf',
            [
                (0.821, 0.835, 0.810, 0.820, 'interview'),
                (0.792, 0.805, 0.780, 0.790, 'review'),
                (0.891, 0.905, 0.880, 0.890, 'shortlisted'),
                (0.743, 0.760, 0.730, 0.740, 'review'),
                (0.867, 0.880, 0.860, 0.865, 'interview'),
            ]
        ),
        (
            'shreyas.singh@thapar.edu',
            'Shreyas Singh',
            'Shreyas_Singh_Data_Systems_ML.pdf',
            [
                (0.785, 0.800, 0.770, 0.780, 'review'),
                (0.721, 0.735, 0.710, 0.720, 'review'),
                (0.764, 0.780, 0.750, 0.760, 'review'),
                (0.705, 0.720, 0.695, 0.700, 'review'),
                (0.841, 0.855, 0.830, 0.840, 'interview'),
            ]
        ),
        (
            'aarav.sharma@thapar.edu',
            'Aarav Sharma',
            'Aarav_Sharma_Python_Microservices.pdf',
            [
                (0.740, 0.755, 0.730, 0.740, 'review'),
                (0.758, 0.770, 0.750, 0.760, 'review'),
                (0.840, 0.855, 0.830, 0.840, 'interview'),
                (0.779, 0.795, 0.765, 0.780, 'review'),
                (0.762, 0.775, 0.755, 0.760, 'review'),
            ]
        ),
        (
            'ananya.verma@thapar.edu',
            'Ananya Verma',
            'Ananya_Verma_Frontend_React_Lead.pdf',
            [
                (0.712, 0.725, 0.700, 0.710, 'review'),
                (0.834, 0.845, 0.820, 0.840, 'interview'),
                (0.698, 0.715, 0.680, 0.700, 'review'),
                (0.902, 0.915, 0.890, 0.900, 'shortlisted'),
                (0.685, 0.700, 0.675, 0.680, 'review'),
            ]
        ),
        (
            'rohan.gupta@thapar.edu',
            'Rohan Gupta',
            'Rohan_Gupta_Junior_Backend_Dev.pdf',
            [
                (0.580, 0.595, 0.570, 0.580, 'rejected'),
                (0.554, 0.570, 0.540, 0.550, 'rejected'),
                (0.542, 0.560, 0.530, 0.540, 'rejected'),
                (0.528, 0.545, 0.515, 0.525, 'rejected'),
                (0.561, 0.580, 0.550, 0.555, 'rejected'),
            ]
        ),
    ]

    company_order = ['Google', 'Microsoft', 'Amazon (AWS)', 'Atlassian', 'Uber']

    for email, _full_name, filename, scores_list in students_data:
        # Check candidate
        cur.execute("SELECT id FROM candidates WHERE email = ?", (email,))
        row = cur.fetchone()
        if row:
            c_id = row[0]
        else:
            c_id = uuid.uuid4().hex
            cur.execute("""
                INSERT INTO candidates (id, email, password_hash, role, created_at)
                VALUES (?, ?, ?, 'user', ?)
            """, (c_id, email, default_pass_hash, now))

        # Check resume
        cur.execute("SELECT id FROM resumes WHERE candidate_id = ? AND original_filename = ?", (c_id, filename))
        r_row = cur.fetchone()
        if r_row:
            res_id = r_row[0]
        else:
            res_id = uuid.uuid4().hex
            cur.execute("""
                INSERT INTO resumes (id, candidate_id, original_filename, file_format, storage_path, parse_status, uploaded_at)
                VALUES (?, ?, ?, 'pdf', ?, 'completed', ?)
            """, (res_id, c_id, filename, f'uploads/{filename}', now))

        # Create/Update Match Evaluations for all 5 company jobs
        for idx, comp in enumerate(company_order):
            j_id = job_ids[comp]
            final_sc, dense_sc, ovl_sc, exp_sc, stat = scores_list[idx]

            cur.execute("SELECT id FROM match_evaluations WHERE resume_id = ? AND job_id = ?", (res_id, j_id))
            eval_row = cur.fetchone()
            if eval_row:
                cur.execute("""
                    UPDATE match_evaluations
                    SET final_match_score = ?, dense_score = ?, skill_overlap_score = ?, experience_score = ?, status = ?
                    WHERE id = ?
                """, (final_sc, dense_sc, ovl_sc, exp_sc, stat, eval_row[0]))
            else:
                eval_id = uuid.uuid4().hex
                cur.execute("""
                    INSERT INTO match_evaluations (id, resume_id, job_id, final_match_score, dense_score, skill_overlap_score, experience_score, weights_version, evaluated_at, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?, 'hybrid-v2', ?, ?)
                """, (eval_id, res_id, j_id, final_sc, dense_sc, ovl_sc, exp_sc, now, stat))

    conn.commit()
    conn.close()
    print("Database seeding completed successfully!")

if __name__ == '__main__':
    seed()

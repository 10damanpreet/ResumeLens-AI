# ResumeLens AI - Phase 1 (Mid-Term Demo)

**Note to Evaluators / Teachers:** 
This is the **Phase 1 Infrastructure Demo** version of the project. It demonstrates the core application layer (Frontend, Backend, Database, Authentication, and File Handling). 

To ensure stability during the presentation, the heavy AI/ML pipeline (Sentence-BERT embeddings, Cosine Similarity, Celery workers, and Google Gemini API calls) have been temporarily mocked to return realistic sample data instantly. The full ML integration is part of Phase 2.

## What is Working in this Demo:
- ✅ **React Frontend:** Fully responsive dashboard UI, navigation, and charts (Recharts).
- ✅ **Backend APIs:** FastAPI endpoints handling routing and business logic.
- ✅ **Authentication:** JWT (JSON Web Tokens) with bcrypt password hashing. User registration and login work perfectly.
- ✅ **Database & File Storage:** Uploading a PDF saves the file locally and persists the user, resume, and job records into PostgreSQL.
- ✅ **Data Binding:** The frontend successfully reads the mock scores and renders them dynamically.

## What is Mocked (Phase 2 AI Features):
- 🚧 **NLP Parsing & SBERT Embeddings:** Bypassed Celery worker; resumes are instantly marked as "parsed".
- 🚧 **Cosine Similarity Matcher:** Instantly returns a dummy 80% match evaluation.
- 🚧 **Google Gemini Skill Gap LLM:** Instantly returns 2 sample recommendations ("Docker" and "AWS").

## How to Run This Demo Locally:
You do not need to run Celery or Redis for this Phase 1 demo.

```bash
# Start the database and API
docker-compose up --build -d db api frontend
```

1. Open `http://localhost:3000` in your browser.
2. Register a new user account.
3. Login and upload a sample resume.
4. Paste a sample job description.
5. Click **"Analyze Match"** to see the Phase 1 mock results.

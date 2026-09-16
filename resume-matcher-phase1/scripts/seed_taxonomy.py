import asyncio
import os
import sys

# Add project root to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.database import async_session_factory
from app.models.skill import SkillsTaxonomy

INITIAL_SKILLS = [
    "Python", "React", "Docker", "Kubernetes", "FastAPI",
    "PostgreSQL", "Machine Learning", "AWS", "Git", "TypeScript"
]

async def seed():
    async with async_session_factory() as session:
        for skill_name in INITIAL_SKILLS:
            skill = SkillsTaxonomy(
                canonical_name=skill_name,
                source="custom",
                category="IT"
            )
            session.add(skill)
        await session.commit()
        print(f"Seeded {len(INITIAL_SKILLS)} skills.")

if __name__ == "__main__":
    asyncio.run(seed())

try:
    import spacy
    nlp = spacy.load("en_core_web_sm")
except (ImportError, OSError):
    nlp = None

def extract_skills(text: str) -> list[str]:
    """Extract potential skill mentions from raw text."""
    if not nlp:
        # Fallback naive extraction
        return list(set(word for word in text.split() if word.istitle()))

    doc = nlp(text)
    skills = []
    # Simplified approach: extract proper nouns and specific terms
    for chunk in doc.noun_chunks:
        if chunk.root.pos_ == "PROPN" or chunk.root.pos_ == "NOUN":
            # Very basic filtering
            clean_term = chunk.text.strip(".,;:()")
            if 2 < len(clean_term) < 30:
                skills.append(clean_term)

    return list(set(skills))

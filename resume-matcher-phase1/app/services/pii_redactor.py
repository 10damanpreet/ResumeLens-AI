import re

try:
    import spacy
    nlp = spacy.load("en_core_web_sm")
except (ImportError, OSError):
    # Fallback if model not downloaded or spacy not installed
    nlp = None

def redact(raw_text: str) -> str:
    """Returns text with all PII replaced by typed tokens."""
    redacted = raw_text

    # 1. Regex Redactions
    # Email
    email_pattern = r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+'
    redacted = re.sub(email_pattern, '[EMAIL]', redacted)

    # Phone (simple pattern)
    phone_pattern = r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
    redacted = re.sub(phone_pattern, '[PHONE]', redacted)

    # 2. spaCy NER Redactions
    if nlp:
        doc = nlp(redacted)
        for ent in doc.ents:
            if ent.label_ == "PERSON":
                redacted = redacted.replace(ent.text, "[PERSON]")
            elif ent.label_ in ["GPE", "LOC"]:
                redacted = redacted.replace(ent.text, "[LOCATION]")

    return redacted

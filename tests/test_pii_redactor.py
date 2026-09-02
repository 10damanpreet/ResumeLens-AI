from app.services.pii_redactor import redact


def test_redact():
    text = "Contact me at test@example.com or 123-456-7890."
    res = redact(text)
    assert "[EMAIL]" in res
    assert "[PHONE]" in res
    assert "test@example.com" not in res

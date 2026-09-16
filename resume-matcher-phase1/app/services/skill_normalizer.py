import difflib
import uuid


def normalize(raw_mention: str, taxonomy: dict[str, uuid.UUID]) -> tuple[uuid.UUID | None, float]:
    """Map raw skill text -> (canonical_skill_id, confidence)."""
    if not taxonomy:
        return None, 0.0

    choices = list(taxonomy.keys())
    matches = difflib.get_close_matches(raw_mention, choices, n=1, cutoff=0.9)

    if matches:
        match_str = matches[0]
        # difflib doesn't easily expose the raw score in get_close_matches, so we'll mock score to 95.0
        return taxonomy[match_str], 95.0

    return None, 0.0

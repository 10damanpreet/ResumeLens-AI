import pytest

from app.services.llm_gateway import generate_skill_gap_feedback


@pytest.mark.asyncio
async def test_generate_skill_gap_feedback_empty():
    # Because this makes a real API call if the key is present,
    # we just verify it doesn't crash on empty strings.
    res = await generate_skill_gap_feedback("", "")
    assert isinstance(res, list)
    if len(res) > 0:
        assert isinstance(res[0], dict)
        assert "skill_name" in res[0]
        assert "severity" in res[0]

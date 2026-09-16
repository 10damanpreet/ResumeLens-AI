from app.services.embedding import generate_embedding


def test_generate_embedding_empty():
    vec = generate_embedding("")
    assert len(vec) == 384
    assert vec == [0.0] * 384

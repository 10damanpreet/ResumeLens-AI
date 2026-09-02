import logging

from sentence_transformers import SentenceTransformer

logger = logging.getLogger(__name__)

# Initialize model at module level to load only once.
# Using a lightweight, fast model for 384-dimensional embeddings.
try:
    model = SentenceTransformer('all-MiniLM-L6-v2')
except Exception as e:
    logger.warning(f"Could not load SentenceTransformer: {e}")
    model = None

def generate_embedding(text: str) -> list[float]:
    """Generate a 384-dimensional vector embedding for a given text."""
    if not text.strip():
        return [0.0] * 384

    if model is None:
        return [0.0] * 384

    embedding = model.encode(text)
    return embedding.tolist()

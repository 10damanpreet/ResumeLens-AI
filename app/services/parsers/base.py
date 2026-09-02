from abc import ABC, abstractmethod


class BaseParser(ABC):
    @abstractmethod
    def extract_text(self, file_content: bytes) -> str:
        """Extract text from raw file bytes."""
        pass

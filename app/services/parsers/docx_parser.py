import io

import docx

from app.services.parsers.base import BaseParser


class DocxParser(BaseParser):
    def extract_text(self, file_content: bytes) -> str:
        doc = docx.Document(io.BytesIO(file_content))
        return "\n".join(paragraph.text for paragraph in doc.paragraphs)

import io

import pdfplumber

from app.services.parsers.base import BaseParser


class PDFParser(BaseParser):
    def extract_text(self, file_content: bytes) -> str:
        text_pages = []
        with pdfplumber.open(io.BytesIO(file_content)) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    text_pages.append(text)
        return "\n".join(text_pages)

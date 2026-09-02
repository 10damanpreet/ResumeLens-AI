import pytesseract
from pdf2image import convert_from_bytes

from app.services.parsers.base import BaseParser


class OCRParser(BaseParser):
    def extract_text(self, file_content: bytes) -> str:
        images = convert_from_bytes(file_content)
        text_pages = []
        for img in images:
            text = pytesseract.image_to_string(img)
            text_pages.append(text)
        return "\n".join(text_pages)

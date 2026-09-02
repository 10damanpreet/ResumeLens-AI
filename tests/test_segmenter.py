from app.services.segmenter import segment


def test_segment():
    text = "SUMMARY\nSoftware Engineer\nSKILLS\nPython"
    res = segment(text)
    assert "Python" in res["skills"]
    assert "Software Engineer" in res["summary"]

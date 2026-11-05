"""Set search-friendly metadata on the rendered CV PDF (Edge only writes the title).

Usage: py cv-print/set_pdf_meta.py personal-website-main/documents/Soinik_Ghosh_CV.pdf
"""
import sys
from pypdf import PdfReader, PdfWriter

path = sys.argv[1]
writer = PdfWriter(clone_from=PdfReader(path))
writer.add_metadata({
    '/Title': 'Soinik Ghosh, Curriculum Vitae',
    '/Author': 'Soinik Ghosh',
    '/Subject': 'CV of Soinik Ghosh, PhD researcher in biomedical engineering at IIT (BHU) Varanasi: '
                'AI for clinical neurophysiology and medical imaging',
    '/Keywords': 'Soinik Ghosh, CV, clinical AI, EEG, medical imaging, biomedical engineering, IIT (BHU), Hridae',
})
with open(path, 'wb') as f:
    writer.write(f)
print(PdfReader(path).metadata)

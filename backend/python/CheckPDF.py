import sys
import os
import PyPDF2
import Levenshtein

def extract_text_from_pdf(pdf_path):
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ''
        for page in reader.pages:
            text += page.extract_text() or ''
        return text.strip().lower()

def is_duplicate(text1, text2, threshold=0.95):
    return Levenshtein.ratio(text1, text2) >= threshold

def check_for_duplicates(target_pdf_path, folder_path):
    target_text = extract_text_from_pdf(target_pdf_path)

    for filename in os.listdir(folder_path):
        if filename.endswith('.pdf') and filename.lower() != os.path.basename(target_pdf_path).lower():
            full_path = os.path.join(folder_path, filename)
            compare_text = extract_text_from_pdf(full_path)
            
            if is_duplicate(target_text, compare_text):
                return True  # Early exit on first match

    return False

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: CheckPDF.py <file_path> <date>")
        sys.exit(1)

    file_path = sys.argv[1]
    date = sys.argv[2]

    folder = os.path.abspath(os.path.join(os.path.dirname(__file__), "../Files"))

    is_dup = check_for_duplicates(file_path, folder)
    print("True" if is_dup else "False")

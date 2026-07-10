import os
import hashlib
from pdf2image import convert_from_path

# Configuration
PDF_DIR = "F:\\Devotional_Books\\"  # Root folder to scan for PDFs
THUMB_DIR = "./public/thumbnails"

def get_shard_path(filename):
    """Creates a 2-level sub-directory structure for scalability."""
    hash_val = hashlib.md5(filename.encode()).hexdigest()
    return os.path.join(hash_val[0:2], hash_val[2:4])

print(f"Starting generation in {THUMB_DIR}...")

for root, dirs, files in os.walk(PDF_DIR):
    for file in files:
        if file.lower().endswith(".pdf"):
            # 1. Define Paths
            pdf_path = os.path.join(root, file)
            shard = get_shard_path(file)
            target_dir = os.path.join(THUMB_DIR, shard)
            
            if not os.path.exists(target_dir):
                os.makedirs(target_dir)
            
            thumb_name = f"thumb_{file.replace('.pdf', '')}.1.png"
            thumb_path = os.path.join(target_dir, thumb_name)

            # 2. Generate if missing
            if not os.path.exists(thumb_path):
                try:
                    print(f"Generating: {file}")
                    images = convert_from_path(pdf_path, first_page=1, last_page=1, fmt="png", size=(200, 280))
                    images[0].save(thumb_path, "PNG")
                except Exception as e:
                    print(f"Error processing {file}: {e}")

print("Generation Complete.")
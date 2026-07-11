import sqlite3
import os
from datetime import datetime

# Database and Folder configuration
DB_NAME = "drizzle.db"
LIBRARY_DIR = "F:\\Devotional_Books\\"  # Update this to your actual PDF folder path


def setup_and_populate():
    # 1. Ensure table exists
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS files (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            file_name TEXT NOT NULL,
            file_path TEXT NOT NULL UNIQUE,
            file_hash TEXT NOT NULL,
            file_size INTEGER NOT NULL,
            title TEXT,
            author TEXT,
            language TEXT,
            category TEXT,
            category_id INTEGER,
            created_at INTEGER
        )
    """)

    # 2. Populate from directory
    for root, dirs, files in os.walk(LIBRARY_DIR):
        for file in files:
            if file.endswith(".pdf"):
                path = os.path.join(root, file)
                try:
                    cursor.execute(
                        """
                        INSERT OR IGNORE INTO files (file_name, file_path, file_hash, file_size)
                        VALUES (?, ?, ?, ?)
                    """,
                        (file, path, "hash_placeholder", os.path.getsize(path)),
                    )
                except sqlite3.Error as e:
                    print(f"Skipping {file}: {e}")

    cursor.execute(
        "UPDATE system_metadata SET last_scanned = ? WHERE id = 1",
        (datetime.now().isoformat(),),
    )
    conn.commit()
    conn.close()
    print("Database populated successfully.")
    update_timestamp(DB_NAME)
    print("Timestamp updated successfully.")


def update_timestamp(DB_NAME):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    # 1. Ensure the table exists
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS system_metadata (
            id INTEGER PRIMARY KEY,
            last_scanned TEXT
        )
    """)

    # 2. Ensure the row exists
    cursor.execute("INSERT OR IGNORE INTO system_metadata (id) VALUES (1)")

    # 3. Now perform the update
    cursor.execute(
        "UPDATE system_metadata SET last_scanned = ? WHERE id = 1",
        (datetime.now().isoformat(),),
    )

    conn.commit()
    conn.close()


if __name__ == "__main__":
    setup_and_populate()

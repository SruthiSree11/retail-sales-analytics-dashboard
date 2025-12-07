import os
import sqlite3
from functools import lru_cache

BASE_DIR = os.path.join(os.path.dirname(__file__), "..", "..")
DB_PATH = os.path.join(BASE_DIR, "database", "sales.db")

def get_connection():
    return sqlite3.connect(DB_PATH)

@lru_cache(maxsize=1)
def get_filter_metadata():
    """
    Load distinct values from SQLite.
    Cached forever since filters do not change.
    """
    conn = get_connection()
    cursor = conn.cursor()

    metadata = {}

    fields = {
        "customer_region": "Customer Region",
        "gender": "Gender",
        "product_category": "Product Category",
        "payment_method": "Payment Method"
    }

    for key, column in fields.items():
        cursor.execute(f"SELECT DISTINCT [{column}] FROM sales WHERE [{column}] IS NOT NULL")
        values = [row[0] for row in cursor.fetchall()]
        metadata[key] = sorted(values)

    # Tags (split comma-separated values)
    cursor.execute("SELECT Tags FROM sales WHERE Tags IS NOT NULL")
    tag_values = cursor.fetchall()
    tag_set = set()

    for (t,) in tag_values:
        parts = [p.strip() for p in str(t).split(",") if p.strip()]
        tag_set.update(parts)

    metadata["tags"] = sorted(tag_set)

    conn.close()
    return metadata

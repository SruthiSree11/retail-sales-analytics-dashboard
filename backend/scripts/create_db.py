import os
import pandas as pd
import sqlite3

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
CSV_PATH = os.path.join(BASE_DIR, "data", "sales.csv")
DB_PATH = os.path.join(BASE_DIR, "database", "sales.db")

print("Reading CSV (this may take time, 232 MB)...")
df = pd.read_csv(CSV_PATH)

print("Creating SQLite database...")
conn = sqlite3.connect(DB_PATH)

df.to_sql("sales", conn, if_exists="replace", index=False)

conn.close()
print("Database created successfully at:", DB_PATH)

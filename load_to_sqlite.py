import sqlite3
import pandas as pd
import os

# Load CSV file (using raw string for Windows path)
csv_path = r"C:\Users\Aditya\agri-copilot\data\farmer_advisor_dataset.csv"

# Read CSV into DataFrame
df = pd.read_csv(csv_path)

# Show the column names (verify your dataset structure)
print("Columns found in CSV:", df.columns.tolist())

# Create 'db' directory if it doesn't exist
os.makedirs('db', exist_ok=True)

# Path to SQLite DB (auto-creates the file if not exists)
db_path = 'db/farming_data.sqlite'

# Connect to SQLite database
conn = sqlite3.connect(db_path)

# Save the DataFrame to a table called 'crop_data'
df.to_sql('crop_data', conn, if_exists='replace', index=False)

# Commit and close connection
conn.commit()
conn.close()

print(f"✅ Loaded {len(df)} rows into 'crop_data' table in SQLite.")

import sqlite3
import os
import sys

db_path = os.path.join(os.path.dirname(__file__), "..", "mamarise.db")

def view_database():
    if not os.path.exists(db_path):
        print(f"❌ Database file not found at {db_path}")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Get all tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [t[0] for t in cursor.fetchall() if t[0] != "sqlite_sequence"]

    print("\n" + "=" * 60)
    print("📊 MAMARISE SQLITE DATABASE INSPECTOR (mamarise.db)")
    print("=" * 60)

    for table in tables:
        print(f"\n📁 TABLE: [{table}]")
        cursor.execute(f"PRAGMA table_info({table});")
        columns = [col[1] for col in cursor.fetchall()]
        print(f"Columns: {', '.join(columns)}")
        
        cursor.execute(f"SELECT * FROM {table} ORDER BY id DESC LIMIT 5;")
        rows = cursor.fetchall()
        if not rows:
            print("  (Empty table - no records yet)")
        else:
            for row in rows:
                print(f"  👉 {row}")

    print("\n" + "=" * 60 + "\n")
    conn.close()

if __name__ == "__main__":
    view_database()

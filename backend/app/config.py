import os
from pathlib import Path
from dotenv import load_dotenv

# Search and load .env from current directory, parent directory (project root), and backend/
base_dir = Path(__file__).resolve().parent.parent.parent
env_paths = [
    base_dir / ".env",
    base_dir / "backend" / ".env",
    Path(".env"),
    Path("backend/.env"),
]
for env_path in env_paths:
    if env_path.exists():
        load_dotenv(dotenv_path=env_path, override=False)

class Settings:
    PROJECT_NAME: str = "MamaRise API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Gemini API Key loaded securely from environment (.env)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    
    # SQLite Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./mamarise.db"
    )
    
    # CORS Origins
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*",
    ]

settings = Settings()


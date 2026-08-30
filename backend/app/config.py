import os
from pydantic_core import Url

class Settings:
    PROJECT_NAME: str = "MamaRise API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Gemini API Key provided by user
    GEMINI_API_KEY: str = os.getenv(
        "GEMINI_API_KEY", 
        "AIzaSyBZoGs3w_Ta-9-orlLabzEk1CWXsM5lzeY"
    )
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

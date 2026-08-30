from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import engine, Base
from .routers import voice, nutrition, triage, tasks, auth

# Initialize SQLite database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="MamaRise Backend: Gemini AI Empathetic Voice & Nutrition Engine with Deterministic Safety Rule Triage",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(voice.router, prefix=settings.API_V1_STR)
app.include_router(nutrition.router, prefix=settings.API_V1_STR)
app.include_router(triage.router, prefix=settings.API_V1_STR)
app.include_router(tasks.router, prefix=settings.API_V1_STR)
app.include_router(auth.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "app": "MamaRise Backend API",
        "version": settings.VERSION,
        "status": "healthy",
        "gemini_enabled": bool(settings.GEMINI_API_KEY),
        "docs": "/docs"
    }

@app.get("/health")
def healthcheck():
    return {"status": "ok", "service": "mamarise-backend"}

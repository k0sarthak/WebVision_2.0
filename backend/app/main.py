"""
DMRC ONE - Unified Delhi Metro Digital Experience API
FastAPI Backend Application
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.api.endpoints.stations import router as stations_router
from app.api.endpoints.routes import router as routes_router
from app.api.endpoints.lines import router as lines_router
from app.api.endpoints.assistant import router as assistant_router
from app.api.endpoints.announcements import announcements_router, tourist_router

load_dotenv()

app = FastAPI(
    title="DMRC ONE API",
    description="Unified Delhi Metro Rail Corporation API supporting Dijkstra Route Planning, MetroMate AI Tool Calling, Live Status, Station Directory, and Tourist Guides.",
    version="1.0.0"
)

# CORS Configuration
allowed_origins = os.getenv("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(stations_router, prefix="/api")
app.include_router(routes_router, prefix="/api")
app.include_router(lines_router, prefix="/api")
app.include_router(assistant_router, prefix="/api")
app.include_router(announcements_router, prefix="/api")
app.include_router(tourist_router, prefix="/api")

@app.get("/")
def root():
    return {
        "service": "DMRC ONE API",
        "tagline": "One Network. One Experience. Smarter Journeys.",
        "status": "Operational",
        "docs_url": "/docs",
        "version": "1.0.0"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "DMRC ONE Backend",
        "routing_engine": "Dijkstra Algorithm Ready",
        "ai_assistant": "MetroMate AI Ready"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)


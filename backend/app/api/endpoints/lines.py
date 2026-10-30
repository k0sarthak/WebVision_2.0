"""
Metro Lines Endpoints
"""

from fastapi import APIRouter
from app.data.delhi_metro_data import METRO_LINES, ANNOUNCEMENTS

router = APIRouter(prefix="/lines", tags=["Metro Lines"])

@router.get("")
def get_lines():
    return {
        "count": len(METRO_LINES),
        "lines": METRO_LINES
    }

@router.get("/status")
def get_lines_status():
    """Live status dashboard with prominent DEMO DATA transparency indicator."""
    return {
        "timestamp": "2026-10-30T12:00:00+05:30",
        "is_demo_data": True,
        "disclaimer": "Operational telemetry is demo data for hackathon evaluation.",
        "overall_status": "Normal Service across all 10 corridors",
        "lines": METRO_LINES,
        "announcements": ANNOUNCEMENTS
    }


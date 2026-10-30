"""
Announcements & Tourist Spots Endpoints
"""

from fastapi import APIRouter
from app.data.delhi_metro_data import ANNOUNCEMENTS, TOURIST_SPOTS

announcements_router = APIRouter(prefix="/announcements", tags=["Announcements"])

@announcements_router.get("")
def list_announcements():
    return {
        "count": len(ANNOUNCEMENTS),
        "announcements": ANNOUNCEMENTS,
        "is_demo_data": True
    }

tourist_router = APIRouter(prefix="/tourist-spots", tags=["Tourist Guide"])

@tourist_router.get("")
def list_tourist_spots():
    return {
        "count": len(TOURIST_SPOTS),
        "spots": TOURIST_SPOTS
    }


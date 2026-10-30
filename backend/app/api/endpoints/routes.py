"""
Routes Endpoints
"""

from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.schemas.schemas import RouteRequest
from app.algorithms.dijkstra import metro_graph

router = APIRouter(prefix="/routes", tags=["Routes"])

@router.post("/calculate")
def calculate_route(req: RouteRequest):
    res = metro_graph.calculate_route(
        source_query=req.source,
        destination_query=req.destination,
        preference=req.preference or "fastest"
    )
    if "error" in res:
        raise HTTPException(status_code=400, detail=res["error"])
    return res

@router.get("/suggestions")
def get_route_suggestions():
    """Returns popular and frequently traveled commuter routes."""
    return {
        "popular_routes": [
            {"source": "Kashmere Gate", "destination": "Rajiv Chowk", "line": "Yellow Line", "typical_duration": "10 mins"},
            {"source": "New Delhi", "destination": "Airport (Terminal 3)", "line": "Airport Express Line", "typical_duration": "19 mins"},
            {"source": "Rajiv Chowk", "destination": "Central Secretariat", "line": "Yellow Line", "typical_duration": "4 mins"},
            {"source": "Janakpuri West", "destination": "Botanical Garden", "line": "Magenta Line", "typical_duration": "43 mins"},
            {"source": "Noida Electronic City", "destination": "Rajiv Chowk", "line": "Blue Line", "typical_duration": "38 mins"}
        ]
    }


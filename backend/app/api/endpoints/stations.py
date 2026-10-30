"""
Stations Endpoints
"""

from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.data.delhi_metro_data import STATIONS
from app.ai.tools import tool_get_station_details, tool_find_station
from app.algorithms.dijkstra import metro_graph

router = APIRouter(prefix="/stations", tags=["Stations"])

@router.get("")
def list_stations(
    line: Optional[str] = Query(None, description="Filter by line ID, e.g. yellow, blue"),
    interchange_only: bool = Query(False, description="Filter only interchange stations"),
    accessible_only: bool = Query(False, description="Filter only wheelchair accessible stations"),
    has_parking: bool = Query(False, description="Filter only stations with parking")
):
    results = STATIONS
    if line:
        results = [s for s in results if line.lower() in [l.lower() for l in s.get("lines", [])]]
    if interchange_only:
        results = [s for s in results if s.get("is_interchange")]
    if accessible_only:
        results = [s for s in results if s.get("has_lift")]
    if has_parking:
        results = [s for s in results if s.get("has_parking")]
    return {
        "count": len(results),
        "stations": results
    }

@router.get("/search")
def search_stations(q: str = Query(..., min_length=1, description="Search query")):
    return tool_find_station(q)

@router.get("/{station_id}")
def get_station(station_id: str):
    res = tool_get_station_details(station_id)
    if "error" in res:
        raise HTTPException(status_code=404, detail=res["error"])
    return res

@router.get("/{station_id}/facilities")
def get_station_facilities(station_id: str):
    res = tool_get_station_details(station_id)
    if "error" in res:
        raise HTTPException(status_code=404, detail=res["error"])
    return {
        "station_id": res["id"],
        "station_name": res["name"],
        "facilities": res["facilities"],
        "gates": res["gates"]
    }


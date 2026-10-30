"""
DMRC ONE - AI Assistant Tools
Structured backend tools called by MetroMate AI to retrieve verified transit data.
The AI does not hallucinate routes, fares, facilities, or statuses.
"""

from typing import Dict, Any, List
from app.algorithms.dijkstra import metro_graph
from app.data.delhi_metro_data import STATIONS, METRO_LINES, TOURIST_SPOTS, ANNOUNCEMENTS
from app.services.fare_service import calculate_fare

def tool_find_station(query: str) -> Dict[str, Any]:
    """Search for stations by name, code, landmark or line."""
    q = query.strip().lower()
    matches = []
    for s in STATIONS:
        if (q in s["name"].lower() or 
            q in s["code"].lower() or 
            q in s.get("name_hi", "").lower() or
            any(q in lm.lower() for lm in s.get("landmarks", [])) or
            any(q in l.lower() for l in s.get("lines", []))):
            matches.append({
                "id": s["id"],
                "name": s["name"],
                "name_hi": s.get("name_hi"),
                "code": s["code"],
                "lines": s["lines"],
                "is_interchange": s["is_interchange"],
                "has_lift": s.get("has_lift", False),
                "accessibility_verified": s.get("accessibility_verified", False),
                "landmarks": s.get("landmarks", [])
            })
    return {
        "query": query,
        "count": len(matches),
        "results": matches[:6]
    }

def tool_calculate_route(source: str, destination: str, preference: str = "fastest") -> Dict[str, Any]:
    """Calculates route using Dijkstra's algorithm."""
    return metro_graph.calculate_route(source, destination, preference=preference)

def tool_get_station_details(station_name_or_id: str) -> Dict[str, Any]:
    """Returns in-depth station details including facilities, gates, and timings."""
    st_id = metro_graph.find_station_id(station_name_or_id)
    if not st_id:
        return {"error": f"Station '{station_name_or_id}' not found."}
    
    station = metro_graph.stations_by_id[st_id]
    lines_info = [metro_graph.lines_by_id[l] for l in station.get("lines", []) if l in metro_graph.lines_by_id]
    
    return {
        "id": station["id"],
        "name": station["name"],
        "name_hi": station.get("name_hi"),
        "code": station["code"],
        "lines": station.get("lines", []),
        "lines_info": lines_info,
        "layout": station.get("layout", "Elevated"),
        "is_interchange": station["is_interchange"],
        "facilities": {
            "lift_available": station.get("has_lift", False),
            "escalator_available": station.get("has_escalator", False),
            "parking_available": station.get("has_parking", False),
            "washroom_available": station.get("has_washroom", False),
            "tactile_paving": station.get("has_tactile", False),
            "verification_status": "Verified by Station Audit" if station.get("accessibility_verified") else "Demo Verification"
        },
        "gates": station.get("gates", []),
        "first_train": station.get("first_train", "05:30 AM"),
        "last_train": station.get("last_train", "11:30 PM"),
        "landmarks": station.get("landmarks", [])
    }

def tool_get_metro_line_status(line_name_or_id: str = "") -> Dict[str, Any]:
    """Returns service status and advisories for a line or all lines."""
    q = line_name_or_id.strip().lower()
    if not q or q in ["all", "network", "metro"]:
        return {
            "network_status": "Operational",
            "lines": METRO_LINES,
            "recent_announcements": ANNOUNCEMENTS[:3],
            "is_demo_data": True,
            "disclaimer": "Live tracking telemetry is simulated demo data for hackathon evaluation."
        }
    
    for l in METRO_LINES:
        if q in l["id"].lower() or q in l["line_name"].lower() or q in l["line_code"].lower():
            # Find relevant announcements
            relevant_ads = [a for a in ANNOUNCEMENTS if a.get("line") in [l["line_name"], "All Lines"]]
            return {
                "line": l,
                "advisories": relevant_ads,
                "is_demo_data": True,
                "disclaimer": "Live status reflects demo telemetry."
            }
            
    return {"error": f"Metro line '{line_name_or_id}' not found. Available lines: Yellow, Blue, Red, Violet, Pink, Magenta, Airport, Green, Grey."}

def tool_get_estimated_fare(source: str, destination: str) -> Dict[str, Any]:
    """Calculates fare between two stations based on distance."""
    route_res = metro_graph.calculate_route(source, destination)
    if "error" in route_res:
        return route_res
    return {
        "source": route_res["source"]["name"],
        "destination": route_res["destination"]["name"],
        "distance_km": route_res["total_distance_km"],
        "fare": route_res["fare"]
    }

def tool_get_nearby_landmarks(landmark_query: str) -> Dict[str, Any]:
    """Finds nearest metro stations to landmarks and tourist attractions in Delhi."""
    q = landmark_query.strip().lower()
    matches = []
    for spot in TOURIST_SPOTS:
        if (q in spot["name"].lower() or 
            q in spot.get("name_hi", "").lower() or 
            q in spot["category"].lower() or 
            q in spot["description"].lower() or
            q in spot["nearest_station_name"].lower()):
            matches.append(spot)
            
    if not matches and q:
        # Search stations' landmark lists as well
        for s in STATIONS:
            for lm in s.get("landmarks", []):
                if q in lm.lower():
                    matches.append({
                        "name": lm,
                        "nearest_station_id": s["id"],
                        "nearest_station_name": s["name"],
                        "line": ", ".join(s["lines"]).title(),
                        "category": "City Landmark",
                        "description": f"Located near {s['name']} metro station.",
                        "best_gate": "Ask station concourse signage"
                    })
                    break

    return {
        "query": landmark_query,
        "count": len(matches),
        "landmarks": matches[:5]
    }

# Tool schema descriptions for LLM function calling
TOOL_DEFINITIONS = [
    {
        "name": "find_station",
        "description": "Find Delhi Metro stations matching a name, code, landmark or line.",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Station name, area name or landmark"}
            },
            "required": ["query"]
        }
    },
    {
        "name": "calculate_route",
        "description": "Calculate shortest transit route using Dijkstra algorithm between source and destination stations.",
        "parameters": {
            "type": "object",
            "properties": {
                "source": {"type": "string", "description": "Starting metro station name"},
                "destination": {"type": "string", "description": "Arrival metro station name"},
                "preference": {
                    "type": "string", 
                    "enum": ["fastest", "min_interchanges", "accessible"], 
                    "description": "Route priority preference"
                }
            },
            "required": ["source", "destination"]
        }
    },
    {
        "name": "get_station_details",
        "description": "Retrieve comprehensive station facilities, lifts, escalators, parking, gates, and train timings.",
        "parameters": {
            "type": "object",
            "properties": {
                "station_name_or_id": {"type": "string", "description": "Name or ID of the metro station"}
            },
            "required": ["station_name_or_id"]
        }
    },
    {
        "name": "get_metro_line_status",
        "description": "Get current operating status and alerts for a specific Delhi Metro line or the whole network.",
        "parameters": {
            "type": "object",
            "properties": {
                "line_name_or_id": {"type": "string", "description": "Line name (e.g., 'Yellow', 'Blue', 'Magenta') or 'all'"}
            }
        }
    },
    {
        "name": "get_estimated_fare",
        "description": "Calculate exact ticket fare, Smart Card rate, and Sunday discount between two stations.",
        "parameters": {
            "type": "object",
            "properties": {
                "source": {"type": "string", "description": "Boarding station"},
                "destination": {"type": "string", "description": "Destination station"}
            },
            "required": ["source", "destination"]
        }
    },
    {
        "name": "get_nearby_landmarks",
        "description": "Find closest metro station, walking distance, and gate for Delhi monuments, markets, or landmarks.",
        "parameters": {
            "type": "object",
            "properties": {
                "landmark_query": {"type": "string", "description": "Monument or landmark name (e.g. 'India Gate', 'Red Fort', 'Lotus Temple')"}
            },
            "required": ["landmark_query"]
        }
    }
]


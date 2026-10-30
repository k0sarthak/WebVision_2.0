"""
DMRC ONE - Graph Engine & Dijkstra's Shortest Path Algorithm
Computes optimal transit routes across the Delhi Metro network,
accounting for direct travel times, transfer penalties at interchanges,
and passenger preferences (fastest, minimum interchanges, wheelchair accessible).
"""

import heapq
from typing import Dict, List, Tuple, Optional, Any
from app.data.delhi_metro_data import STATIONS, CONNECTIONS, METRO_LINES
from app.services.fare_service import calculate_fare

class MetroGraph:
    def __init__(self):
        self.stations_by_id: Dict[str, Dict[str, Any]] = {s["id"]: s for s in STATIONS}
        self.stations_by_name: Dict[str, Dict[str, Any]] = {s["name"].lower(): s for s in STATIONS}
        self.lines_by_id: Dict[str, Dict[str, Any]] = {l["id"]: l for l in METRO_LINES}
        self.adjacency: Dict[str, List[Dict[str, Any]]] = {s["id"]: [] for s in STATIONS}
        self._build_graph()

    def _build_graph(self):
        for conn in CONNECTIONS:
            u, v = conn["u"], conn["v"]
            line = conn["line"]
            dist = conn["distance"]
            time_m = conn["time"]

            if u in self.adjacency and v in self.adjacency:
                # Undirected track connection
                self.adjacency[u].append({
                    "to": v,
                    "line": line,
                    "distance": dist,
                    "time": time_m
                })
                self.adjacency[v].append({
                    "to": u,
                    "line": line,
                    "distance": dist,
                    "time": time_m
                })

    def find_station_id(self, query: str) -> Optional[str]:
        """Resolves a user-provided station name or ID with fuzzy matching."""
        q = query.strip().lower()
        if q in self.stations_by_id:
            return q
        if q in self.stations_by_name:
            return self.stations_by_name[q]["id"]
        
        # Substring / fuzzy match
        for s in STATIONS:
            s_name = s["name"].lower()
            s_name_hi = s.get("name_hi", "").lower()
            s_code = s["code"].lower()
            if q == s_name or q == s_code or q in s_name or s_name in q:
                return s["id"]
            if s_name_hi and (q in s_name_hi or s_name_hi in q):
                return s["id"]
        return None

    def calculate_route(
        self,
        source_query: str,
        destination_query: str,
        preference: str = "fastest" # "fastest", "min_interchanges", "accessible"
    ) -> Dict[str, Any]:
        src_id = self.find_station_id(source_query)
        dest_id = self.find_station_id(destination_query)

        if not src_id:
            return {"error": f"Source station '{source_query}' not recognized in Delhi Metro network."}
        if not dest_id:
            return {"error": f"Destination station '{destination_query}' not recognized in Delhi Metro network."}
        if src_id == dest_id:
            s = self.stations_by_id[src_id]
            return {
                "source": s,
                "destination": s,
                "total_time_mins": 0,
                "total_distance_km": 0,
                "interchanges_count": 0,
                "lines_used": [s["primary_line"]],
                "path": [s],
                "interchanges": [],
                "instructions": ["You are already at your destination station."],
                "fare": calculate_fare(0)
            }

        # Transfer penalty in minutes
        transfer_penalty = 5.0
        if preference == "min_interchanges":
            transfer_penalty = 25.0 # Strongly penalize line changes to prefer fewer interchanges

        # State in priority queue: (cost, current_station_id, current_line, path_records)
        # path_records: list of (station_id, line_used_to_reach_it, segment_dist, segment_time)
        pq = []
        heapq.heappush(pq, (0.0, src_id, None, [(src_id, None, 0.0, 0)]))
        visited = {} # (station_id, current_line) -> best cost

        best_path = None
        min_cost = float('inf')

        while pq:
            current_cost, curr_id, curr_line, path = heapq.heappop(pq)

            if curr_id == dest_id:
                if current_cost < min_cost:
                    min_cost = current_cost
                    best_path = path
                    break

            state_key = (curr_id, curr_line)
            if state_key in visited and visited[state_key] <= current_cost:
                continue
            visited[state_key] = current_cost

            for edge in self.adjacency.get(curr_id, []):
                next_id = edge["to"]
                edge_line = edge["line"]
                dist = edge["distance"]
                travel_time = edge["time"]

                # If preference is accessible, skip stations that are not verified accessible with lift
                if preference == "accessible":
                    dest_station = self.stations_by_id[next_id]
                    if not dest_station.get("has_lift", False):
                        continue

                # Calculate incremental weight
                penalty = 0.0
                if curr_line is not None and curr_line != edge_line:
                    penalty = transfer_penalty

                new_cost = current_cost + travel_time + penalty
                new_path = path + [(next_id, edge_line, dist, travel_time)]

                next_state_key = (next_id, edge_line)
                if next_state_key not in visited or visited[next_state_key] > new_cost:
                    heapq.heappush(pq, (new_cost, next_id, edge_line, new_path))

        if not best_path:
            # Fallback if accessible filter was too restrictive
            if preference == "accessible":
                return self.calculate_route(source_query, destination_query, preference="fastest")
            return {"error": f"No valid route found between {source_query} and {destination_query}."}

        return self._format_route_result(best_path, preference)

    def _format_route_result(self, raw_path: List[Tuple], preference: str) -> Dict[str, Any]:
        # raw_path is list of (station_id, line_used, dist, time)
        stations_list = []
        total_distance = 0.0
        pure_travel_time = 0
        interchanges = []
        lines_used_ordered = []
        segments = [] # grouped by continuous line travel

        current_segment = None

        for idx, (st_id, line, dist, time_m) in enumerate(raw_path):
            st_data = self.stations_by_id[st_id].copy()
            st_data["line_used"] = line
            stations_list.append(st_data)
            total_distance += dist
            pure_travel_time += time_m

            if line and (not lines_used_ordered or lines_used_ordered[-1] != line):
                lines_used_ordered.append(line)

            # Check for interchange
            if idx > 1:
                prev_line = raw_path[idx - 1][1]
                if line != prev_line:
                    interchanges.append({
                        "station_id": raw_path[idx - 1][0],
                        "station_name": self.stations_by_id[raw_path[idx - 1][0]]["name"],
                        "from_line": prev_line,
                        "to_line": line,
                        "from_line_name": self.lines_by_id[prev_line]["line_name"],
                        "to_line_name": self.lines_by_id[line]["line_name"],
                        "transfer_walk_mins": 4
                    })

        # Add transfer walking time (4 mins per interchange)
        total_time_mins = pure_travel_time + (len(interchanges) * 4)

        # Generate step-by-step instructions
        instructions = self._generate_instructions(raw_path, interchanges)

        # Check if Airport Express line was used
        uses_airport = "airport" in lines_used_ordered
        fare_details = calculate_fare(total_distance, uses_airport_line=uses_airport)

        return {
            "source": stations_list[0],
            "destination": stations_list[-1],
            "total_time_mins": total_time_mins,
            "pure_travel_time_mins": pure_travel_time,
            "total_distance_km": round(total_distance, 2),
            "interchanges_count": len(interchanges),
            "interchanges": interchanges,
            "lines_used": lines_used_ordered,
            "lines_info": [self.lines_by_id[l] for l in lines_used_ordered if l in self.lines_by_id],
            "stations_count": len(stations_list),
            "path": stations_list,
            "instructions": instructions,
            "fare": fare_details,
            "preference_applied": preference
        }

    def _generate_instructions(self, raw_path: List[Tuple], interchanges: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        instructions = []
        if len(raw_path) < 2:
            return [{"step": 1, "text": "Board and arrive at destination."}]

        # Group into legs
        legs = []
        curr_leg = {
            "line": raw_path[1][1],
            "from_station": raw_path[0][0],
            "stations": [raw_path[0][0]]
        }

        for idx in range(1, len(raw_path)):
            st_id = raw_path[idx][0]
            line = raw_path[idx][1]
            if line == curr_leg["line"]:
                curr_leg["stations"].append(st_id)
            else:
                curr_leg["to_station"] = raw_path[idx - 1][0]
                legs.append(curr_leg)
                curr_leg = {
                    "line": line,
                    "from_station": raw_path[idx - 1][0],
                    "stations": [raw_path[idx - 1][0], st_id]
                }
        curr_leg["to_station"] = raw_path[-1][0]
        legs.append(curr_leg)

        step_counter = 1
        for leg_idx, leg in enumerate(legs):
            line_meta = self.lines_by_id.get(leg["line"], {})
            line_name = line_meta.get("line_name", leg["line"].title())
            from_name = self.stations_by_id[leg["from_station"]]["name"]
            to_name = self.stations_by_id[leg["to_station"]]["name"]
            stops_count = len(leg["stations"]) - 1
            terminal_info = f" towards {line_meta.get('terminal_stations', ['destination'])[1]}" if line_meta.get("terminal_stations") else ""

            if leg_idx == 0:
                instructions.append({
                    "step": step_counter,
                    "type": "BOARD",
                    "line": leg["line"],
                    "line_name": line_name,
                    "line_color": line_meta.get("line_color", "#E53935"),
                    "station_name": from_name,
                    "text": f"Board {line_name} at {from_name}{terminal_info}."
                })
            else:
                instructions.append({
                    "step": step_counter,
                    "type": "INTERCHANGE",
                    "line": leg["line"],
                    "line_name": line_name,
                    "line_color": line_meta.get("line_color", "#E53935"),
                    "station_name": from_name,
                    "text": f"At {from_name}, transfer to {line_name}{terminal_info}."
                })
            step_counter += 1

            instructions.append({
                "step": step_counter,
                "type": "RIDE",
                "line": leg["line"],
                "stops": stops_count,
                "text": f"Ride {stops_count} stations until {to_name}."
            })
            step_counter += 1

        instructions.append({
            "step": step_counter,
            "type": "ALIGHT",
            "station_name": self.stations_by_id[raw_path[-1][0]]["name"],
            "text": f"Arrive at destination: {self.stations_by_id[raw_path[-1][0]]['name']}."
        })

        return instructions

# Global graph singleton instance
metro_graph = MetroGraph()


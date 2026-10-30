import { Station, MetroLine, RouteResult, TouristSpot, Announcement, ChatMessage } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export async function fetchStations(filters?: {
  line?: string;
  interchange_only?: boolean;
  accessible_only?: boolean;
  has_parking?: boolean;
}): Promise<Station[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.line) params.append('line', filters.line);
    if (filters?.interchange_only) params.append('interchange_only', 'true');
    if (filters?.accessible_only) params.append('accessible_only', 'true');
    if (filters?.has_parking) params.append('has_parking', 'true');

    const res = await fetch(`${API_BASE_URL}/stations?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch stations');
    const data = await res.json();
    return data.stations;
  } catch (err) {
    console.warn('API error, using client fallback:', err);
    return [];
  }
}

export async function searchStations(query: string): Promise<Station[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/stations/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Failed to search stations');
    const data = await res.json();
    return data.results;
  } catch (err) {
    console.warn('Search error:', err);
    return [];
  }
}

export async function fetchStationDetails(stationId: string): Promise<Station | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/stations/${stationId}`);
    if (!res.ok) throw new Error('Failed to fetch station details');
    return await res.json();
  } catch (err) {
    console.warn('Error fetching station details:', err);
    return null;
  }
}

export async function calculateRoute(
  source: string,
  destination: string,
  preference: string = 'fastest'
): Promise<RouteResult> {
  const res = await fetch(`${API_BASE_URL}/routes/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source, destination, preference })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'Route calculation failed' }));
    throw new Error(errorData.detail || 'Route calculation failed');
  }
  return await res.json();
}

export async function fetchLines(): Promise<MetroLine[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/lines`);
    if (!res.ok) throw new Error('Failed to fetch lines');
    const data = await res.json();
    return data.lines;
  } catch (err) {
    console.warn('Lines error:', err);
    return [];
  }
}

export async function fetchLinesStatus(): Promise<{
  timestamp: string;
  is_demo_data: boolean;
  disclaimer: string;
  overall_status: string;
  lines: MetroLine[];
  announcements: Announcement[];
}> {
  try {
    const res = await fetch(`${API_BASE_URL}/lines/status`);
    if (!res.ok) throw new Error('Failed to fetch status');
    return await res.json();
  } catch (err) {
    console.warn('Status error:', err);
    return {
      timestamp: new Date().toISOString(),
      is_demo_data: true,
      disclaimer: 'Live tracking telemetry is simulated demo data.',
      overall_status: 'Normal Service across network',
      lines: [],
      announcements: []
    };
  }
}

export async function fetchTouristSpots(): Promise<TouristSpot[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/tourist-spots`);
    if (!res.ok) throw new Error('Failed to fetch tourist spots');
    const data = await res.json();
    return data.spots;
  } catch (err) {
    console.warn('Tourist error:', err);
    return [];
  }
}

export async function fetchAnnouncements(): Promise<Announcement[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/announcements`);
    if (!res.ok) throw new Error('Failed to fetch announcements');
    const data = await res.json();
    return data.announcements;
  } catch (err) {
    console.warn('Announcements error:', err);
    return [];
  }
}

export async function sendChatMessage(
  message: string,
  language: string = 'en'
): Promise<{
  reply: string;
  tool_calls: any[];
  structured_data: any;
}> {
  const res = await fetch(`${API_BASE_URL}/assistant/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, language })
  });
  if (!res.ok) {
    throw new Error('AI Assistant service unavailable');
  }
  return await res.json();
}


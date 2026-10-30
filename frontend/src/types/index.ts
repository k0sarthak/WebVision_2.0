export type Language = 'en' | 'hi';

export interface StationGate {
  number: number;
  landmark: string;
}

export interface Station {
  id: string;
  name: string;
  name_hi?: string;
  code: string;
  lat: number;
  lng: number;
  primary_line: string;
  lines: string[];
  is_interchange: boolean;
  layout: string;
  has_lift: boolean;
  has_escalator: boolean;
  has_parking: boolean;
  has_washroom: boolean;
  has_tactile: boolean;
  accessibility_verified: boolean;
  gates?: StationGate[];
  landmarks?: string[];
  first_train?: string;
  last_train?: string;
  line_used?: string;
}

export interface MetroLine {
  id: string;
  line_name: string;
  line_code: string;
  line_color: string;
  text_color: string;
  terminal_stations?: string[];
  status: string;
  status_code?: string;
  description: string;
  operating_hours: string;
  frequency_min: number;
  is_demo_status?: boolean;
}

export interface FareDetails {
  distance_km: number;
  distance_slab: string;
  token_qr_fare: number;
  smart_card_fare: number;
  smart_card_off_peak_fare: number;
  sunday_holiday_fare: number;
  currency: string;
  savings_with_card: number;
  discount_notes: string;
}

export interface InterchangeInfo {
  station_id: string;
  station_name: string;
  from_line: string;
  to_line: string;
  from_line_name: string;
  to_line_name: string;
  transfer_walk_mins: number;
}

export interface RouteInstruction {
  step: number;
  type: 'BOARD' | 'INTERCHANGE' | 'RIDE' | 'ALIGHT';
  line?: string;
  line_name?: string;
  line_color?: string;
  station_name?: string;
  stops?: number;
  text: string;
}

export interface RouteResult {
  source: Station;
  destination: Station;
  total_time_mins: number;
  pure_travel_time_mins: number;
  total_distance_km: number;
  interchanges_count: number;
  interchanges: InterchangeInfo[];
  lines_used: string[];
  lines_info: MetroLine[];
  stations_count: number;
  path: Station[];
  instructions: RouteInstruction[];
  fare: FareDetails;
  preference_applied: string;
  error?: string;
}

export interface TouristSpot {
  id: string;
  name: string;
  name_hi?: string;
  nearest_station_id: string;
  alternative_station_id?: string;
  nearest_station_name: string;
  line: string;
  walking_distance_km: number;
  walking_time_mins: number;
  category: string;
  description: string;
  best_gate: string;
  opening_hours: string;
  entry_fee: string;
  image_url: string;
}

export interface Announcement {
  id: number;
  title: string;
  title_hi?: string;
  type: string;
  line: string;
  date: string;
  description: string;
  is_demo: boolean;
}

export interface AccessibilitySettings {
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  highContrast: boolean;
  reducedMotion: boolean;
  screenReaderOptimized: boolean;
}

export interface ToolCallRecord {
  tool: string;
  args: Record<string, any>;
  result?: any;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  tool_calls?: ToolCallRecord[];
  structured_data?: {
    route?: RouteResult;
    station?: any;
    landmark?: TouristSpot;
    fare?: any;
    status?: any;
  };
}


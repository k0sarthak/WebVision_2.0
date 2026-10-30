import React, { useState, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, MapPin, Navigation, Eye, Check } from 'lucide-react';
import { Station, MetroLine, RouteResult } from '../types';

interface InteractiveMapSVGProps {
  stations: Station[];
  lines: MetroLine[];
  activeRoute?: RouteResult | null;
  onSelectStation?: (stationName: string, role: 'source' | 'destination') => void;
  onClearRoute?: () => void;
}

// Normalized coordinate projection for clean schematic metro map rendering
// Range: viewBox="0 0 1000 800"
const MAP_COORDS: Record<string, { x: number; y: number }> = {
  // Yellow Line (Vertical North-South Spine)
  samaypur_badli: { x: 380, y: 80 },
  azadpur: { x: 380, y: 160 },
  kashmere_gate: { x: 480, y: 240 },
  chandni_chowk: { x: 480, y: 290 },
  chawri_bazar: { x: 480, y: 330 },
  new_delhi: { x: 480, y: 370 },
  rajiv_chowk: { x: 480, y: 420 },
  patel_chowk: { x: 480, y: 465 },
  central_secretariat: { x: 480, y: 510 },
  udyog_bhawan: { x: 480, y: 550 },
  dilli_haat_ina: { x: 480, y: 600 },
  aiims: { x: 480, y: 640 },
  green_park: { x: 480, y: 675 },
  hauz_khas: { x: 480, y: 710 },
  malviya_nagar: { x: 480, y: 745 },
  qutab_minar: { x: 430, y: 775 },
  sikanderpur: { x: 340, y: 780 },
  millennium_city_centre: { x: 260, y: 780 },

  // Blue Line (Horizontal West-East Spine)
  dwarka_sec_21: { x: 120, y: 520 },
  janakpuri_west: { x: 200, y: 420 },
  rajouri_garden: { x: 280, y: 420 },
  kirti_nagar: { x: 340, y: 420 },
  karol_bagh: { x: 410, y: 420 },
  mandi_house: { x: 550, y: 420 },
  yamuna_bank: { x: 640, y: 420 },
  akshardham: { x: 710, y: 440 },
  mayur_vihar_1: { x: 770, y: 480 },
  botanical_garden: { x: 840, y: 550 },
  noida_electronic_city: { x: 920, y: 420 },
  anand_vihar_isbt: { x: 760, y: 350 },

  // Red Line (Northwest to Northeast)
  rithala: { x: 220, y: 160 },
  netaji_subhash_place: { x: 300, y: 200 },
  inderlok: { x: 370, y: 240 },
  welcome: { x: 680, y: 240 },
  shaheed_sthal: { x: 880, y: 240 },

  // Violet Line (Heritage route)
  lal_quila: { x: 540, y: 270 },
  delhi_gate: { x: 540, y: 340 },
  khan_market: { x: 540, y: 540 },
  jln_stadium: { x: 540, y: 590 },
  lajpat_nagar: { x: 580, y: 630 },
  kalkaji_mandir: { x: 670, y: 680 },
  raja_nahar_singh: { x: 700, y: 770 },

  // Magenta Line (South Orbital)
  terminal_1_igi_airport: { x: 240, y: 600 },
  iit: { x: 410, y: 710 },

  // Airport Express Line (High Speed)
  delhi_aerocity: { x: 310, y: 480 },
  igi_airport_t3: { x: 210, y: 520 },

  // Pink Line (Ring Orbital)
  durgabai_deshmukh_south_campus: { x: 360, y: 540 },
  sarai_kale_khan: { x: 670, y: 560 }
};

export const InteractiveMapSVG: React.FC<InteractiveMapSVGProps> = ({
  stations,
  lines,
  activeRoute,
  onSelectStation,
  onClearRoute
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredStation, setHoveredStation] = useState<Station | null>(null);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [visibleLines, setVisibleLines] = useState<string[]>(lines.map(l => l.id));

  const svgRef = useRef<SVGSVGElement>(null);

  // Line track connectivity definitions for SVG paths
  const TRACK_PATHS: { lineId: string; color: string; stations: string[] }[] = [
    {
      lineId: 'yellow',
      color: '#FBC02D',
      stations: [
        'samaypur_badli', 'azadpur', 'kashmere_gate', 'chandni_chowk', 'chawri_bazar',
        'new_delhi', 'rajiv_chowk', 'patel_chowk', 'central_secretariat', 'udyog_bhawan',
        'dilli_haat_ina', 'aiims', 'green_park', 'hauz_khas', 'malviya_nagar',
        'qutab_minar', 'sikanderpur', 'millennium_city_centre'
      ]
    },
    {
      lineId: 'blue',
      color: '#1976D2',
      stations: [
        'dwarka_sec_21', 'janakpuri_west', 'rajouri_garden', 'kirti_nagar', 'karol_bagh',
        'rajiv_chowk', 'mandi_house', 'yamuna_bank', 'akshardham', 'mayur_vihar_1',
        'botanical_garden', 'noida_electronic_city'
      ]
    },
    {
      lineId: 'blue',
      color: '#1976D2',
      stations: ['yamuna_bank', 'anand_vihar_isbt']
    },
    {
      lineId: 'red',
      color: '#D32F2F',
      stations: ['rithala', 'netaji_subhash_place', 'inderlok', 'kashmere_gate', 'welcome', 'shaheed_sthal']
    },
    {
      lineId: 'violet',
      color: '#7B1FA2',
      stations: [
        'kashmere_gate', 'lal_quila', 'delhi_gate', 'mandi_house', 'central_secretariat',
        'khan_market', 'jln_stadium', 'lajpat_nagar', 'kalkaji_mandir', 'raja_nahar_singh'
      ]
    },
    {
      lineId: 'magenta',
      color: '#880E4F',
      stations: [
        'janakpuri_west', 'terminal_1_igi_airport', 'iit', 'hauz_khas', 'kalkaji_mandir', 'botanical_garden'
      ]
    },
    {
      lineId: 'airport',
      color: '#FF6F00',
      stations: ['new_delhi', 'delhi_aerocity', 'igi_airport_t3', 'dwarka_sec_21']
    },
    {
      lineId: 'pink',
      color: '#EC407A',
      stations: [
        'azadpur', 'netaji_subhash_place', 'rajouri_garden', 'durgabai_deshmukh_south_campus',
        'dilli_haat_ina', 'lajpat_nagar', 'sarai_kale_khan', 'mayur_vihar_1', 'anand_vihar_isbt', 'welcome'
      ]
    },
    {
      lineId: 'green',
      color: '#388E3C',
      stations: ['inderlok', 'kirti_nagar']
    }
  ];

  // Set of station IDs present in the active route
  const activeRouteStationIds = new Set(activeRoute?.path.map(s => s.id) || []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedStation(null);
  };

  const toggleLineVisibility = (lineId: string) => {
    setVisibleLines(prev =>
      prev.includes(lineId) ? prev.filter(l => l !== lineId) : [...prev, lineId]
    );
  };

  // Build SVG path string for a line of stations
  const getSvgPath = (stationIds: string[]) => {
    const points = stationIds
      .map(id => MAP_COORDS[id])
      .filter(Boolean);
    if (points.length < 2) return '';
    return points.reduce((acc, curr, idx) => {
      return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
    }, '');
  };

  return (
    <div className="relative w-full h-[620px] bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col">
      {/* Top Map Control Bar */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 max-w-[85%]">
        {/* Line Filter Toggles */}
        <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl p-1.5 flex flex-wrap gap-1 shadow-xs">
          {lines.slice(0, 7).map(line => {
            const isVis = visibleLines.includes(line.id);
            return (
              <button
                key={line.id}
                onClick={() => toggleLineVisibility(line.id)}
                className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isVis ? 'bg-white shadow-xs border border-slate-200' : 'opacity-40 hover:opacity-70'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: line.line_color }} />
                <span>{line.line_code}</span>
              </button>
            );
          })}
        </div>

        {activeRoute && (
          <div className="bg-white/95 backdrop-blur-md border border-dmrc-red rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-xs text-xs font-bold text-dmrc-red">
            <Navigation className="w-3.5 h-3.5 animate-pulse" />
            <span>Route: {activeRoute.source.name} → {activeRoute.destination.name}</span>
            {onClearRoute && (
              <button
                onClick={onClearRoute}
                className="ml-2 text-slate-400 hover:text-slate-700 underline text-[11px]"
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {/* Floating Zoom & Pan Controls */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1.5 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl p-1 shadow-dropdown">
        <button
          onClick={() => setZoom(z => Math.min(z + 0.25, 2.5))}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom(z => Math.max(z - 0.25, 0.75))}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={resetView}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl p-2.5 shadow-xs text-xs space-y-1.5 hidden sm:block">
        <div className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">Legend</div>
        <div className="flex items-center gap-2 text-slate-600 text-[11px]">
          <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-900 bg-white inline-block" />
          <span>Interchange Station</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600 text-[11px]">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" />
          <span>Regular Station</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600 text-[11px]">
          <span className="w-4 h-1 rounded bg-dmrc-red inline-block shadow-xs" />
          <span>Active Route Path</span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div
        className="w-full h-full cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 1000 800"
          className="w-full h-full"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out'
          }}
        >
          {/* Subtle Background Grid */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" strokeWidth="0.5" />
          </pattern>
          <rect width="1000" height="800" fill="url(#grid)" />

          {/* Render Metro Lines */}
          {TRACK_PATHS.map((track, idx) => {
            if (!visibleLines.includes(track.lineId)) return null;
            const pathD = getSvgPath(track.stations);
            return (
              <g key={`track-${idx}`}>
                {/* Shadow/Backing line */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.9"
                />
                {/* Colored Metro Line */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={track.color}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            );
          })}

          {/* Render Active Route Highlight if computed */}
          {activeRoute && activeRoute.path.length > 1 && (
            <path
              d={getSvgPath(activeRoute.path.map(s => s.id))}
              fill="none"
              stroke="#E53935"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="8 4"
              className="animate-pulse"
            />
          )}

          {/* Render Stations as Nodes */}
          {stations.map(station => {
            const pos = MAP_COORDS[station.id];
            if (!pos) return null;
            if (!station.lines.some(l => visibleLines.includes(l))) return null;

            const isInterchange = station.is_interchange;
            const isRouteStation = activeRouteStationIds.has(station.id);
            const isSelected = selectedStation?.id === station.id;

            return (
              <g
                key={station.id}
                className="cursor-pointer transition-transform hover:scale-125"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedStation(station);
                }}
                onMouseEnter={() => setHoveredStation(station)}
                onMouseLeave={() => setHoveredStation(null)}
              >
                {/* Station Node Halo if selected or in active route */}
                {(isRouteStation || isSelected) && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isInterchange ? 14 : 10}
                    fill="#E53935"
                    opacity="0.25"
                    className="animate-ping"
                  />
                )}

                {/* Interchange Concentric Ring */}
                {isInterchange ? (
                  <>
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="8"
                      fill="#FFFFFF"
                      stroke="#172033"
                      strokeWidth="2.5"
                    />
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="4"
                      fill={isRouteStation ? "#E53935" : "#172033"}
                    />
                  </>
                ) : (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="5"
                    fill={isRouteStation ? "#E53935" : "#FFFFFF"}
                    stroke="#475569"
                    strokeWidth="2"
                  />
                )}

                {/* Station Name Label */}
                <text
                  x={pos.x + 9}
                  y={pos.y + 4}
                  fill="#1E293B"
                  fontSize={isInterchange ? '10px' : '9px'}
                  fontWeight={isInterchange ? '700' : '500'}
                  className="pointer-events-none drop-shadow-xs"
                >
                  {station.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Station Details Popup Modal when clicked */}
      {selectedStation && (
        <div className="absolute top-16 right-4 z-30 w-80 bg-white border border-slate-200 rounded-2xl shadow-dropdown p-4 animate-in fade-in duration-150">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold text-slate-900">{selectedStation.name}</span>
                {selectedStation.is_interchange && (
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-red-100 text-dmrc-red">
                    Interchange
                  </span>
                )}
              </div>
              {selectedStation.name_hi && (
                <div className="text-xs text-slate-500 font-medium">{selectedStation.name_hi}</div>
              )}
            </div>
            <button
              onClick={() => setSelectedStation(null)}
              className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
            >
              ✕
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {selectedStation.lines.map(l => (
              <span
                key={l}
                className="text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize"
                style={{
                  backgroundColor: l === 'yellow' ? '#FEF08A' : l === 'blue' ? '#DBEAFE' : l === 'red' ? '#FEE2E2' : '#F1F5F9',
                  color: l === 'yellow' ? '#854D0E' : l === 'blue' ? '#1E40AF' : l === 'red' ? '#991B1B' : '#475569'
                }}
              >
                {l} line
              </span>
            ))}
          </div>

          {selectedStation.landmarks && selectedStation.landmarks.length > 0 && (
            <div className="mt-3 text-xs text-slate-600 bg-slate-50 p-2 rounded-xl">
              <strong>Nearby:</strong> {selectedStation.landmarks.join(', ')}
            </div>
          )}

          {/* Quick Route Plan Actions */}
          {onSelectStation && (
            <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onSelectStation(selectedStation.name, 'source');
                  setSelectedStation(null);
                }}
                className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors text-center"
              >
                Set as Source
              </button>
              <button
                onClick={() => {
                  onSelectStation(selectedStation.name, 'destination');
                  setSelectedStation(null);
                }}
                className="py-1.5 px-2 bg-dmrc-red hover:bg-dmrc-darkred text-white text-xs font-semibold rounded-lg transition-colors text-center"
              >
                Set as Destination
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


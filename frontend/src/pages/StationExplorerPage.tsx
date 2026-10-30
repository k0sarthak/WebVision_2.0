import React, { useState, useEffect } from 'react';
import { 
  Landmark, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Navigation,
  Car,
  ChevronRight,
  Accessibility
} from 'lucide-react';
import { Station, Language } from '../types';
import { fetchStations, fetchStationDetails } from '../services/api';
import { MetroLineBadge } from '../components/MetroLineBadge';

interface StationExplorerPageProps {
  onPlanRouteWithStation?: (stationName: string, role: 'source' | 'destination') => void;
  language: Language;
  initialFilter?: string;
}

export const StationExplorerPage: React.FC<StationExplorerPageProps> = ({
  onPlanRouteWithStation,
  language,
  initialFilter = 'all'
}) => {
  const [stations, setStations] = useState<Station[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>(initialFilter);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStations();
  }, [activeFilter]);

  const loadStations = async () => {
    setIsLoading(true);
    try {
      const filters: any = {};
      if (activeFilter === 'interchange') filters.interchange_only = true;
      if (activeFilter === 'accessible') filters.accessible_only = true;
      if (activeFilter === 'parking') filters.has_parking = true;

      const data = await fetchStations(filters);
      setStations(data);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStations = stations.filter(s => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q) ||
      (s.name_hi && s.name_hi.toLowerCase().includes(q)) ||
      (s.landmarks && s.landmarks.some(lm => lm.toLowerCase().includes(q))) ||
      s.lines.some(l => l.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold mb-2">
          <Landmark className="w-4 h-4" />
          <span>Station Facilities & Accessibility Directory</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          {language === 'hi' ? 'स्टेशन डायरेक्टरी एवं सुविधाएं' : 'Delhi Metro Station Explorer'}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {language === 'hi'
            ? 'स्टेशन के गेट, प्रथम व अंतिम ट्रेन का समय, लिफ्ट उपलब्धता और नजदीकी दर्शनीय स्थल'
            : 'Explore station gates, platform amenities, verified lift access, parking, and landmark connections.'}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Field */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by station name, code (e.g. KG, RC), line, or landmark..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-dmrc-red/20 focus:border-dmrc-red transition-all"
            />
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Stations' },
              { id: 'interchange', label: 'Interchanges Only' },
              { id: 'accessible', label: 'Wheelchair / Lift Accessible' },
              { id: 'parking', label: 'Parking Available' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  activeFilter === f.id
                    ? 'border-dmrc-red bg-red-50 text-dmrc-red'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Showing {filteredStations.length} stations</span>
          {activeFilter === 'accessible' && (
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Verified Lift / Ramp Accessible Stations
            </span>
          )}
        </div>
      </div>

      {/* Stations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStations.map(station => (
          <div
            key={station.id}
            onClick={() => setSelectedStation(station)}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-card hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-dmrc-red transition-colors">
                    {station.name}
                  </h3>
                  {station.name_hi && (
                    <div className="text-xs text-slate-400">{station.name_hi}</div>
                  )}
                </div>

                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {station.code}
                </span>
              </div>

              {/* Lines Pill Badges */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {station.lines.map(l => (
                  <MetroLineBadge key={l} lineId={l} size="sm" />
                ))}
              </div>

              {/* Verified Facilities Badges */}
              <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-medium text-slate-600">
                {station.has_lift && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Lift Access
                  </span>
                )}
                {station.has_parking && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200/60">
                    <Car className="w-3 h-3 text-blue-600" />
                    Parking
                  </span>
                )}
                {station.is_interchange && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200/60">
                    Interchange
                  </span>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>{station.layout} Station</span>
              <span className="text-dmrc-red font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                View Details <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Station Details Modal */}
      {selectedStation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black text-slate-900">{selectedStation.name}</h2>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {selectedStation.code}
                  </span>
                </div>
                {selectedStation.name_hi && (
                  <div className="text-sm text-slate-500">{selectedStation.name_hi}</div>
                )}
              </div>

              <button
                onClick={() => setSelectedStation(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 text-sm font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Metro Lines */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Corridors</span>
              <div className="flex flex-wrap gap-2">
                {selectedStation.lines.map(l => (
                  <MetroLineBadge key={l} lineId={l} size="md" />
                ))}
              </div>
            </div>

            {/* Timings */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
              <div>
                <span className="text-slate-500 font-semibold block">First Train:</span>
                <strong className="text-slate-900 text-sm">{selectedStation.first_train || '05:30 AM'}</strong>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block">Last Train:</span>
                <strong className="text-slate-900 text-sm">{selectedStation.last_train || '11:30 PM'}</strong>
              </div>
            </div>

            {/* Verified Facilities Table */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Station Amenities
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
                  {selectedStation.accessibility_verified ? 'Verified Audit' : 'Demo Verification'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl border border-slate-100 bg-white flex items-center justify-between">
                  <span>Lifts / Elevators</span>
                  {selectedStation.has_lift ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Operational
                    </span>
                  ) : (
                    <span className="text-slate-400">N/A</span>
                  )}
                </div>

                <div className="p-2.5 rounded-xl border border-slate-100 bg-white flex items-center justify-between">
                  <span>Escalators</span>
                  {selectedStation.has_escalator ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Available
                    </span>
                  ) : (
                    <span className="text-slate-400">N/A</span>
                  )}
                </div>

                <div className="p-2.5 rounded-xl border border-slate-100 bg-white flex items-center justify-between">
                  <span>Parking</span>
                  {selectedStation.has_parking ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Available
                    </span>
                  ) : (
                    <span className="text-rose-600">No Parking</span>
                  )}
                </div>

                <div className="p-2.5 rounded-xl border border-slate-100 bg-white flex items-center justify-between">
                  <span>Washrooms</span>
                  {selectedStation.has_washroom ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Available
                    </span>
                  ) : (
                    <span className="text-slate-400">N/A</span>
                  )}
                </div>
              </div>
            </div>

            {/* Gates */}
            {selectedStation.gates && selectedStation.gates.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Entry / Exit Gates & Directions
                </span>
                <div className="space-y-1.5">
                  {selectedStation.gates.map(g => (
                    <div key={g.number} className="p-2 rounded-xl bg-slate-50 text-xs flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-dmrc-red text-white font-bold flex items-center justify-center shrink-0">
                        {g.number}
                      </span>
                      <span className="text-slate-800">{g.landmark}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nearby Landmarks */}
            {selectedStation.landmarks && selectedStation.landmarks.length > 0 && (
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Nearby Landmarks
                </span>
                <p className="text-xs text-slate-700">
                  {selectedStation.landmarks.join(' • ')}
                </p>
              </div>
            )}

            {/* Actions */}
            {onPlanRouteWithStation && (
              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    onPlanRouteWithStation(selectedStation.name, 'source');
                    setSelectedStation(null);
                  }}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold transition-colors"
                >
                  Start Journey Here
                </button>
                <button
                  onClick={() => {
                    onPlanRouteWithStation(selectedStation.name, 'destination');
                    setSelectedStation(null);
                  }}
                  className="py-2.5 px-4 rounded-xl bg-dmrc-red hover:bg-dmrc-darkred text-white text-xs font-bold transition-colors shadow-xs"
                >
                  Travel to This Station
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


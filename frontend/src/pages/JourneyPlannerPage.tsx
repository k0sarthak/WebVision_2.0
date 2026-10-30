import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  ArrowUpDown, 
  Zap, 
  Shield, 
  Clock, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  CircleDot, 
  Map as MapIcon, 
  AlertCircle,
  IndianRupee,
  Sparkles
} from 'lucide-react';
import { StationAutocomplete } from '../components/StationAutocomplete';
import { MetroLineBadge } from '../components/MetroLineBadge';
import { RouteResult, Language } from '../types';
import { calculateRoute } from '../services/api';

interface JourneyPlannerPageProps {
  initialSource?: string;
  initialDestination?: string;
  initialPreference?: string;
  onNavigateToMap: (route: RouteResult) => void;
  language: Language;
}

export const JourneyPlannerPage: React.FC<JourneyPlannerPageProps> = ({
  initialSource = 'Kashmere Gate',
  initialDestination = 'Rajiv Chowk',
  initialPreference = 'fastest',
  onNavigateToMap,
  language
}) => {
  const [source, setSource] = useState(initialSource);
  const [destination, setDestination] = useState(initialDestination);
  const [preference, setPreference] = useState<'fastest' | 'min_interchanges' | 'accessible'>(
    (initialPreference as any) || 'fastest'
  );
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Compute initial route on mount
  useEffect(() => {
    if (initialSource && initialDestination) {
      handleCalculate(initialSource, initialDestination, preference);
    }
  }, []);

  const handleCalculate = async (src: string, dst: string, pref: string) => {
    if (!src.trim() || !dst.trim()) {
      setErrorMsg('Please specify both starting and destination stations.');
      return;
    }
    if (src.trim().toLowerCase() === dst.trim().toLowerCase()) {
      setErrorMsg('Source and destination cannot be the same station.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await calculateRoute(src.trim(), dst.trim(), pref);
      setRouteResult(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Route calculation failed.');
      setRouteResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwap = () => {
    const temp = source;
    setSource(destination);
    setDestination(temp);
    if (temp && destination) {
      handleCalculate(destination, temp, preference);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-dmrc-red text-xs font-bold mb-2">
          <Compass className="w-4 h-4" />
          <span>Graph Algorithm Shortest-Path Transit</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          {language === 'hi' ? 'स्मार्ट यात्रा योजना' : 'Smart Journey Planner'}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {language === 'hi'
            ? 'दिएस्ट्रा एल्गोरिदम द्वारा यात्रा समय, इंटरचेंज और आधिकारिक किराए की सटीक गणना'
            : 'Calculates the fastest route, line transfers, platform directions and official fare slabs across Delhi-NCR.'}
        </p>
      </div>

      {/* Input Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCalculate(source, destination, preference);
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-3 items-center">
            <StationAutocomplete
              label="Starting Station"
              placeholder="e.g. Kashmere Gate, New Delhi..."
              value={source}
              onChange={setSource}
              language={language}
              required
            />

            <div className="flex justify-center -my-1 md:my-0 pt-5">
              <button
                type="button"
                onClick={handleSwap}
                className="w-10 h-10 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 hover:text-dmrc-red transition-all shadow-xs"
                title="Swap stations"
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </div>

            <StationAutocomplete
              label="Destination Station"
              placeholder="e.g. Rajiv Chowk, Hauz Khas..."
              value={destination}
              onChange={setDestination}
              language={language}
              required
            />
          </div>

          {/* Preferences */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setPreference('fastest');
                  if (source && destination) handleCalculate(source, destination, 'fastest');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                  preference === 'fastest'
                    ? 'border-dmrc-red bg-red-50 text-dmrc-red ring-1 ring-dmrc-red/30'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Fastest Route</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPreference('min_interchanges');
                  if (source && destination) handleCalculate(source, destination, 'min_interchanges');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                  preference === 'min_interchanges'
                    ? 'border-dmrc-red bg-red-50 text-dmrc-red ring-1 ring-dmrc-red/30'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>Fewest Interchanges</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPreference('accessible');
                  if (source && destination) handleCalculate(source, destination, 'accessible');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                  preference === 'accessible'
                    ? 'border-dmrc-red bg-red-50 text-dmrc-red ring-1 ring-dmrc-red/30'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Wheelchair / Lift Route</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="py-2.5 px-6 rounded-xl bg-dmrc-red hover:bg-dmrc-darkred text-white text-xs sm:text-sm font-bold shadow-xs transition-all disabled:opacity-50"
            >
              {isLoading ? 'Computing Route...' : 'Recalculate Route'}
            </button>
          </div>
        </form>

        {errorMsg && (
          <div className="mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Results View */}
      {routeResult && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Route Summary & Fare Card */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Main Stats Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Optimal Route Found
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                  Dijkstra Verified
                </span>
              </div>

              {/* Source -> Destination Big Header */}
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-slate-400 font-medium">Boarding</div>
                  <div className="text-lg font-bold text-slate-900">{routeResult.source.name}</div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-300 shrink-0" />
                <div className="text-right">
                  <div className="text-xs text-slate-400 font-medium">Destination</div>
                  <div className="text-lg font-bold text-slate-900">{routeResult.destination.name}</div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <div>
                  <div className="text-xl font-black text-slate-900">{routeResult.total_time_mins}m</div>
                  <div className="text-[11px] text-slate-500 font-medium">Total Time</div>
                </div>
                <div>
                  <div className="text-xl font-black text-slate-900">{routeResult.total_distance_km}</div>
                  <div className="text-[11px] text-slate-500 font-medium">Kilometers</div>
                </div>
                <div>
                  <div className="text-xl font-black text-slate-900">{routeResult.interchanges_count}</div>
                  <div className="text-[11px] text-slate-500 font-medium">Interchanges</div>
                </div>
              </div>

              {/* Metro Lines Used */}
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-slate-500">Lines Used:</div>
                <div className="flex flex-wrap gap-2">
                  {routeResult.lines_used.map(l => (
                    <MetroLineBadge key={l} lineId={l} />
                  ))}
                </div>
              </div>

              {/* Interchanges List */}
              {routeResult.interchanges.length > 0 && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 space-y-1 text-xs">
                  <div className="font-bold text-amber-900">Line Transfers Required:</div>
                  {routeResult.interchanges.map((ic, i) => (
                    <div key={i} className="text-amber-800">
                      • At <strong>{ic.station_name}</strong>: Switch from {ic.from_line_name} to <strong>{ic.to_line_name}</strong> (~{ic.transfer_walk_mins} min walk).
                    </div>
                  ))}
                </div>
              )}

              {/* View on Map CTA */}
              <button
                type="button"
                onClick={() => onNavigateToMap(routeResult)}
                className="w-full py-3 px-4 rounded-xl border border-slate-200 hover:border-dmrc-red hover:bg-red-50 text-slate-800 hover:text-dmrc-red font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <MapIcon className="w-4 h-4" />
                <span>View Route Highlighted on Metro Map</span>
              </button>
            </div>

            {/* Official Fare Breakdown Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-bold text-slate-900">Official DMRC Fare Matrix</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-400">
                  {routeResult.fare.distance_slab}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[11px] text-slate-500 font-semibold uppercase">Token / Paper QR</div>
                  <div className="text-2xl font-black text-slate-900 mt-0.5">
                    ₹{routeResult.fare.token_qr_fare}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Single Journey</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
                  <div className="text-[11px] text-emerald-800 font-semibold uppercase flex items-center justify-between">
                    <span>Smart Card</span>
                    <span className="text-[9px] bg-emerald-200 text-emerald-900 px-1 rounded">10% OFF</span>
                  </div>
                  <div className="text-2xl font-black text-emerald-900 mt-0.5">
                    ₹{routeResult.fare.smart_card_fare}
                  </div>
                  <div className="text-[10px] text-emerald-700 mt-1">
                    Off-peak: ₹{routeResult.fare.smart_card_off_peak_fare} (20% off)
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-600">
                <span>Sunday & National Holiday Concession:</span>
                <strong className="text-slate-900 font-bold">₹{routeResult.fare.sunday_holiday_fare}</strong>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed italic">
                {routeResult.fare.discount_notes}
              </p>
            </div>
          </div>

          {/* Right Column: Step-by-Step Navigation Timeline */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center justify-between">
              <span>Step-by-Step Travel Instructions</span>
              <span className="text-xs font-normal text-slate-500">
                {routeResult.stations_count} stations traversed
              </span>
            </h3>

            <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {routeResult.instructions.map((inst, idx) => {
                const isBoard = inst.type === 'BOARD';
                const isInterchange = inst.type === 'INTERCHANGE';
                const isAlight = inst.type === 'ALIGHT';

                return (
                  <div key={idx} className="relative flex items-start gap-4">
                    {/* Step Node Dot */}
                    <div className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white ${
                      isBoard
                        ? 'bg-dmrc-red text-white'
                        : isInterchange
                        ? 'bg-amber-500 text-white animate-pulse'
                        : isAlight
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-300'
                    }`}>
                      {isAlight ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <span className="text-[10px] font-bold">{inst.step}</span>
                      )}
                    </div>

                    <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          isBoard
                            ? 'bg-red-100 text-dmrc-red'
                            : isInterchange
                            ? 'bg-amber-100 text-amber-800'
                            : isAlight
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}>
                          {inst.type}
                        </span>

                        {inst.line_name && (
                          <span className="text-xs font-semibold text-slate-500">
                            {inst.line_name}
                          </span>
                        )}
                      </div>

                      <p className="text-sm font-semibold text-slate-800 pt-1">
                        {inst.text}
                      </p>

                      {isInterchange && (
                        <p className="text-xs text-amber-700 pt-1 font-medium">
                          Follow overhead yellow signage to transfer platforms.
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};


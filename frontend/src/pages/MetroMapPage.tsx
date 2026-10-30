import React, { useState, useEffect } from 'react';
import { Map, Search, Navigation, RotateCcw, Info } from 'lucide-react';
import { InteractiveMapSVG } from '../components/InteractiveMapSVG';
import { Station, MetroLine, RouteResult, Language } from '../types';
import { fetchStations, fetchLines, calculateRoute } from '../services/api';

interface MetroMapPageProps {
  activeRoute?: RouteResult | null;
  onClearActiveRoute?: () => void;
  onNavigateToPlanner?: (source: string, destination: string) => void;
  language: Language;
}

export const MetroMapPage: React.FC<MetroMapPageProps> = ({
  activeRoute,
  onClearActiveRoute,
  onNavigateToPlanner,
  language
}) => {
  const [stations, setStations] = useState<Station[]>([]);
  const [lines, setLines] = useState<MetroLine[]>([]);
  const [sourceStation, setSourceStation] = useState<string>('');
  const [destStation, setDestStation] = useState<string>('');
  const [currentRoute, setCurrentRoute] = useState<RouteResult | null>(activeRoute || null);

  useEffect(() => {
    fetchStations().then(setStations);
    fetchLines().then(setLines);
  }, []);

  useEffect(() => {
    if (activeRoute) {
      setCurrentRoute(activeRoute);
    }
  }, [activeRoute]);

  const handleStationSelection = async (stationName: string, role: 'source' | 'destination') => {
    if (role === 'source') {
      setSourceStation(stationName);
      if (destStation && destStation !== stationName) {
        const res = await calculateRoute(stationName, destStation);
        setCurrentRoute(res);
      }
    } else {
      setDestStation(stationName);
      if (sourceStation && sourceStation !== stationName) {
        const res = await calculateRoute(sourceStation, stationName);
        setCurrentRoute(res);
      }
    }
  };

  const handleClear = () => {
    setSourceStation('');
    setDestStation('');
    setCurrentRoute(null);
    if (onClearActiveRoute) onClearActiveRoute();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold mb-2">
            <Map className="w-4 h-4" />
            <span>Interactive Network Schematic</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {language === 'hi' ? 'इंटरएक्टिव मेट्रो मैप' : 'Interactive Delhi Metro Map'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {language === 'hi'
              ? 'नेटवर्क मैप पर क्लिक करके सीधे रूट खोजें, इंटरचेंज स्टेशन देखें और लाइनें फ़िल्टर करें'
              : 'Click any station on the schematic to set starting and destination points, pan/zoom, or filter corridors.'}
          </p>
        </div>

        {/* Quick Selection Status Bar */}
        {(sourceStation || destStation || currentRoute) && (
          <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs text-xs">
            {sourceStation && (
              <div>
                <span className="text-slate-400">From: </span>
                <strong className="text-slate-900">{sourceStation}</strong>
              </div>
            )}
            {destStation && (
              <div>
                <span className="text-slate-400">To: </span>
                <strong className="text-slate-900">{destStation}</strong>
              </div>
            )}
            <button
              onClick={handleClear}
              className="ml-2 text-rose-600 hover:text-rose-800 font-semibold underline text-xs"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Interactive Map View */}
      <InteractiveMapSVG
        stations={stations}
        lines={lines}
        activeRoute={currentRoute}
        onSelectStation={handleStationSelection}
        onClearRoute={handleClear}
      />

      {/* Info Tip */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-500 shrink-0" />
          <span>
            <strong>Pro Tip:</strong> Click any station circle to view facilities, gates, and set as source or destination for instant shortest-path calculation.
          </span>
        </div>
        {currentRoute && onNavigateToPlanner && (
          <button
            onClick={() => onNavigateToPlanner(currentRoute.source.name, currentRoute.destination.name)}
            className="text-dmrc-red font-bold hover:underline shrink-0 ml-4 flex items-center gap-1"
          >
            <span>Open in Journey Planner</span>
            <Navigation className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};


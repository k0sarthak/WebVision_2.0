import React, { useState } from 'react';
import { ArrowUpDown, Compass, Zap, Shield, Sparkles, Navigation, ArrowRight } from 'lucide-react';
import { StationAutocomplete } from './StationAutocomplete';
import { Language, RouteResult } from '../types';

interface HeroJourneyPlannerProps {
  onFindRoute: (source: string, destination: string, preference: string) => void;
  isLoading?: boolean;
  language?: Language;
  initialSource?: string;
  initialDestination?: string;
}

export const HeroJourneyPlanner: React.FC<HeroJourneyPlannerProps> = ({
  onFindRoute,
  isLoading = false,
  language = 'en',
  initialSource = '',
  initialDestination = ''
}) => {
  const [source, setSource] = useState(initialSource);
  const [destination, setDestination] = useState(initialDestination);
  const [preference, setPreference] = useState<'fastest' | 'min_interchanges' | 'accessible'>('fastest');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSwap = () => {
    const temp = source;
    setSource(destination);
    setDestination(temp);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!source.trim()) {
      setErrorMsg(language === 'hi' ? 'कृपया प्रारंभिक स्टेशन चुनें' : 'Please specify a starting station');
      return;
    }
    if (!destination.trim()) {
      setErrorMsg(language === 'hi' ? 'कृपया गंतव्य स्टेशन चुनें' : 'Please specify a destination station');
      return;
    }
    if (source.trim().toLowerCase() === destination.trim().toLowerCase()) {
      setErrorMsg(language === 'hi' ? 'प्रारंभिक और गंतव्य स्टेशन अलग होने चाहिए' : 'Source and destination stations cannot be the same');
      return;
    }
    setErrorMsg(null);
    onFindRoute(source.trim(), destination.trim(), preference);
  };

  const handleQuickRoute = (src: string, dst: string) => {
    setSource(src);
    setDestination(dst);
    setErrorMsg(null);
    onFindRoute(src, dst, preference);
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-card p-6 sm:p-8 backdrop-blur-md">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-red-50 text-dmrc-red flex items-center justify-center font-bold">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {language === 'hi' ? 'अपनी यात्रा की योजना बनाएं' : 'Plan Your Journey'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'hi' ? 'दिएस्ट्रा एल्गोरिथम द्वारा सटीक रूट गणना' : 'Computed instantly via verified Dijkstra shortest path algorithm'}
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {language === 'hi' ? 'लाइव रूट इंजन' : 'Live Graph Engine'}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Source & Destination inputs with Swap Button */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-3 items-center">
          
          <StationAutocomplete
            label={language === 'hi' ? 'प्रारंभिक स्टेशन (From)' : 'Starting Station (From)'}
            placeholder={language === 'hi' ? 'उदा. Kashmere Gate, New Delhi...' : 'e.g. Kashmere Gate, New Delhi...'}
            value={source}
            onChange={(val) => {
              setSource(val);
              if (errorMsg) setErrorMsg(null);
            }}
            language={language}
            required
          />

          {/* Swap Button */}
          <div className="flex justify-center -my-1 md:my-0 pt-5">
            <button
              type="button"
              onClick={handleSwap}
              className="w-10 h-10 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 hover:text-dmrc-red transition-all shadow-xs hover:rotate-180"
              title="Swap stations"
              aria-label="Swap starting and destination stations"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>

          <StationAutocomplete
            label={language === 'hi' ? 'गंतव्य स्टेशन (To)' : 'Destination Station (To)'}
            placeholder={language === 'hi' ? 'उदा. Rajiv Chowk, Hauz Khas...' : 'e.g. Rajiv Chowk, Hauz Khas...'}
            value={destination}
            onChange={(val) => {
              setDestination(val);
              if (errorMsg) setErrorMsg(null);
            }}
            language={language}
            required
          />
        </div>

        {/* Travel Preference Chips */}
        <div className="pt-2">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
            {language === 'hi' ? 'यात्रा प्राथमिकता (Travel Preference)' : 'Route Preference'}
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setPreference('fastest')}
              className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                preference === 'fastest'
                  ? 'border-dmrc-red bg-red-50 text-dmrc-red ring-1 ring-dmrc-red/30'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'सबसे तेज़ (Fastest)' : 'Fastest Route'}</span>
            </button>

            <button
              type="button"
              onClick={() => setPreference('min_interchanges')}
              className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                preference === 'min_interchanges'
                  ? 'border-dmrc-red bg-red-50 text-dmrc-red ring-1 ring-dmrc-red/30'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'न्यूनतम इंटरचेंज' : 'Min Interchanges'}</span>
            </button>

            <button
              type="button"
              onClick={() => setPreference('accessible')}
              className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                preference === 'accessible'
                  ? 'border-dmrc-red bg-red-50 text-dmrc-red ring-1 ring-dmrc-red/30'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'सुलभ (Accessible)' : 'Wheelchair Route'}</span>
            </button>
          </div>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium animate-in fade-in">
            {errorMsg}
          </div>
        )}

        {/* Primary Find Route Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-dmrc-red to-dmrc-darkred text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 hover:brightness-105 active:scale-[0.99] transition-all shadow-md disabled:opacity-50"
          >
            {isLoading ? (
              <span>Calculating optimal path...</span>
            ) : (
              <>
                <span>{language === 'hi' ? 'मार्ग खोजें (Find Route)' : 'Find Optimal Route'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Popular Commuter Routes Shortcuts */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        <span className="text-xs font-semibold text-slate-500 mr-2">
          {language === 'hi' ? 'लोकप्रिय यात्राएं:' : 'Popular commuter routes:'}
        </span>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {[
            { s: 'Kashmere Gate', d: 'Rajiv Chowk', label: 'Kashmere Gate → Rajiv Chowk' },
            { s: 'New Delhi', d: 'Airport (Terminal 3)', label: 'New Delhi → Airport T3' },
            { s: 'Rajiv Chowk', d: 'Central Secretariat', label: 'Rajiv Chowk → India Gate / Central Sec' },
            { s: 'Janakpuri West', d: 'Botanical Garden', label: 'Janakpuri West → Botanical Garden' },
          ].map((item, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleQuickRoute(item.s, item.d)}
              className="text-xs font-medium px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};


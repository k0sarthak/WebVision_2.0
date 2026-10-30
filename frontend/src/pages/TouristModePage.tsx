import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Clock, 
  Ticket, 
  Compass, 
  ArrowRight, 
  Search, 
  ExternalLink,
  Navigation
} from 'lucide-react';
import { TouristSpot, Language } from '../types';
import { fetchTouristSpots } from '../services/api';

interface TouristModePageProps {
  onPlanRouteToSpot: (stationName: string) => void;
  language: Language;
}

export const TouristModePage: React.FC<TouristModePageProps> = ({ onPlanRouteToSpot, language }) => {
  const [spots, setSpots] = useState<TouristSpot[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchTouristSpots().then(setSpots);
  }, []);

  const categories = ['all', 'UNESCO World Heritage Site', 'Historical Monument', 'Shopping & Heritage District', 'Spiritual & Cultural Campus'];

  const filteredSpots = spots.filter(spot => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = spot.name.toLowerCase().includes(q) ||
      (spot.name_hi && spot.name_hi.toLowerCase().includes(q)) ||
      spot.nearest_station_name.toLowerCase().includes(q) ||
      spot.description.toLowerCase().includes(q);

    const matchesCat = selectedCategory === 'all' || spot.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Delhi Sights & Monument Transit Mode</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          {language === 'hi' ? 'दिल्ली दर्शन: पर्यटन गाइड' : 'Tourist Mode: Explore Delhi by Metro'}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {language === 'hi'
            ? 'दिल्ली के प्रमुख ऐतिहासिक स्मारकों, बाज़ारों और मंदिरों के निकटतम मेट्रो स्टेशन व पैदल दूरी'
            : 'Discover Delhi’s UNESCO heritage sites, bustling bazaars, and temples with nearest metro connections.'}
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search attractions (e.g. Red Fort, India Gate, Qutub Minar, Akshardham)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-dmrc-red/20 focus:border-dmrc-red transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                selectedCategory === cat
                  ? 'border-dmrc-red bg-red-50 text-dmrc-red'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              {cat === 'all' ? 'All Attractions' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Attractions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSpots.map((spot) => (
          <div
            key={spot.id}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-card transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Photo Banner */}
              <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                <img
                  src={spot.image_url}
                  alt={spot.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-900 shadow-xs">
                  {spot.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-dmrc-red transition-colors">
                    {spot.name}
                  </h3>
                  {spot.name_hi && (
                    <div className="text-xs text-slate-400 font-medium">{spot.name_hi}</div>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-normal line-clamp-2">
                  {spot.description}
                </p>

                {/* Nearest Station Card */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Nearest Metro Station:</span>
                    <strong className="text-slate-900 font-bold">{spot.nearest_station_name}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Line:</span>
                    <span className="font-semibold text-slate-800">{spot.line}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Walking Distance:</span>
                    <span className="font-semibold text-slate-800">{spot.walking_distance_km} km (~{spot.walking_time_mins} mins)</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Recommended Gate:</span>
                    <span className="font-bold text-dmrc-red">{spot.best_gate}</span>
                  </div>
                </div>

                {/* Opening Hours & Fee */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-1">
                  <div>
                    <span className="block font-semibold text-slate-700">Hours:</span>
                    <span>{spot.opening_hours}</span>
                  </div>
                  <div>
                    <span className="block font-semibold text-slate-700">Entry:</span>
                    <span>{spot.entry_fee}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Plan Route CTA */}
            <div className="p-5 pt-0">
              <button
                onClick={() => onPlanRouteToSpot(spot.nearest_station_name)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-dmrc-red text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Plan Metro Route to this Sight</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


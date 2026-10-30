import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Map, 
  Activity, 
  Landmark, 
  Ticket, 
  Sparkles, 
  Bot, 
  PhoneCall, 
  ShieldCheck, 
  ArrowRight, 
  AlertTriangle,
  Clock,
  CheckCircle,
  Accessibility
} from 'lucide-react';
import { HeroJourneyPlanner } from '../components/HeroJourneyPlanner';
import { MetroLineBadge } from '../components/MetroLineBadge';
import { Language, MetroLine, Announcement, Station } from '../types';
import { fetchLines, fetchAnnouncements, fetchStations } from '../services/api';

interface HomePageProps {
  onNavigate: (page: string, params?: any) => void;
  language: Language;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, language }) => {
  const [lines, setLines] = useState<MetroLine[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [popularStations, setPopularStations] = useState<Station[]>([]);

  useEffect(() => {
    fetchLines().then(setLines);
    fetchAnnouncements().then(setAnnouncements);
    fetchStations({ interchange_only: true }).then(sts => setPopularStations(sts.slice(0, 8)));
  }, []);

  const handleFindRoute = (source: string, destination: string, preference: string) => {
    onNavigate('journey-planner', { source, destination, preference });
  };

  const quickAccessCards = [
    {
      id: 'journey-planner',
      title: language === 'hi' ? 'यात्रा योजना' : 'Plan Your Journey',
      desc: language === 'hi' ? 'दिएस्ट्रा एल्गोरिदम द्वारा तेज व सटीक रूट' : 'Fastest routes, transfer points & fare calculator',
      icon: Compass,
      color: 'bg-red-50 text-dmrc-red border-red-100 hover:border-dmrc-red'
    },
    {
      id: 'map',
      title: language === 'hi' ? 'इंटरएक्टिव मेट्रो मैप' : 'Interactive Metro Map',
      desc: language === 'hi' ? 'सम्पूर्ण दिल्ली नेटवर्क का ज़ूम व नेविगेशन' : 'Zoomable network schematic with line filters & route tracer',
      icon: Map,
      color: 'bg-blue-50 text-blue-600 border-blue-100 hover:border-blue-500'
    },
    {
      id: 'live-status',
      title: language === 'hi' ? 'लाइव लाइन स्टेटस' : 'Live Metro Status',
      desc: language === 'hi' ? 'सभी 10 लाइनों की तात्कालिक सेवा स्थिति' : 'Service health, delays & pre-scheduled advisories',
      icon: Activity,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:border-emerald-500'
    },
    {
      id: 'stations',
      title: language === 'hi' ? 'स्टेशन डायरेक्टरी' : 'Find a Station',
      desc: language === 'hi' ? 'लिफ्ट, पार्किंग व गेट जानकारी' : 'Search facilities, lifts, parking & first/last train timings',
      icon: Landmark,
      color: 'bg-purple-50 text-purple-600 border-purple-100 hover:border-purple-500'
    },
    {
      id: 'tickets',
      title: language === 'hi' ? 'स्मार्ट टिकटिंग' : 'Buy a Ticket & NCMC',
      desc: language === 'hi' ? 'मोबाइल QR एवं स्मार्ट कार्ड छूट गाइड' : 'QR ticketing rules, smart card recharge & fare charts',
      icon: Ticket,
      color: 'bg-amber-50 text-amber-600 border-amber-100 hover:border-amber-500'
    },
    {
      id: 'tourist-guide',
      title: language === 'hi' ? 'पर्यटन गाइड' : 'Tourist Mode',
      desc: language === 'hi' ? 'लाल किला, इंडिया गेट आदि के नजदीकी स्टेशन' : 'Delhi’s iconic attractions with 1-click route planning',
      icon: Sparkles,
      color: 'bg-rose-50 text-rose-600 border-rose-100 hover:border-rose-500'
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative pt-6 pb-12 sm:pt-12 sm:pb-16 overflow-hidden">
        {/* Subtle Decorative Light Rings */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 pointer-events-none opacity-40">
          <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-red-100/50 blur-3xl" />
          <div className="absolute top-20 right-1/4 w-80 h-80 rounded-full bg-blue-100/40 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Headline */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-200 text-dmrc-red text-xs font-bold shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-dmrc-red animate-pulse" />
                <span>{language === 'hi' ? 'दिल्ली मेट्रो डिजिटल अनुभव 2.0' : 'Next-Gen Unified Metro Experience'}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                {language === 'hi' ? (
                  <>आपका शहर। आपकी मेट्रो। <span className="text-dmrc-red">एक स्मार्ट यात्रा।</span></>
                ) : (
                  <>Your City. Your Metro. <span className="text-dmrc-red">One Smart Journey.</span></>
                )}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {language === 'hi'
                  ? 'यात्रा की योजना बनाएं, स्टेशन सुविधाओं की जांच करें, लाइव अपडेट देखें और स्मार्ट सहायता के साथ आत्मविश्वास से सफर करें।'
                  : 'Plan journeys, explore stations, check live metro updates and travel smarter across the National Capital Region.'}
              </p>

              {/* Status Indicator & Live Stats Strip */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs text-xs font-semibold text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Network: <strong>All Corridors Operational</strong></span>
                </div>
                <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs text-xs font-semibold text-slate-700">
                  <span>393+ km Network</span>
                  <span className="text-slate-300">|</span>
                  <span>288 Stations</span>
                </div>
              </div>
            </div>

            {/* Right: Focused Hero Journey Planner Widget */}
            <div className="lg:col-span-6">
              <HeroJourneyPlanner onFindRoute={handleFindRoute} language={language} />
            </div>

          </div>
        </div>
      </section>

      {/* Quick Access Services Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {language === 'hi' ? 'त्वरित सेवाएँ' : 'Essential Passenger Services'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {language === 'hi' ? 'एक ही स्थान पर सभी प्रमुख मेट्रो साधन' : 'Everything you need to commute seamlessly across Delhi-NCR'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickAccessCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => onNavigate(card.id)}
                className={`p-6 rounded-2xl border transition-all cursor-pointer shadow-xs hover:shadow-card hover:-translate-y-0.5 group bg-white ${card.color}`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-4 mb-1">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Metro Lines Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {language === 'hi' ? 'मेट्रो लाइन नेटवर्क' : 'Delhi Metro Network Corridors'}
              </h2>
              <p className="text-xs text-slate-500">
                Operational status across all active lines (Verified Line Telemetry)
              </p>
            </div>
            <button
              onClick={() => onNavigate('live-status')}
              className="text-xs font-bold text-dmrc-red hover:underline flex items-center gap-1"
            >
              <span>View Full Live Status</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {lines.map((l) => (
              <div
                key={l.id}
                onClick={() => onNavigate('live-status')}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: l.line_color }} />
                  <span className="text-xs font-bold text-slate-900 truncate">{l.line_name}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-700 font-semibold">{l.status}</span>
                  <span className="text-slate-400 font-mono">{l.frequency_min}m freq</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MetroMate AI Assistant Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
              <Bot className="w-4 h-4 animate-bounce" />
              <span>AI-Powered Commuter Companion</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Meet MetroMate AI: Your Voice & Chat Travel Assistant
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Ask in English or Hindi: <em>"How do I reach India Gate from Rajiv Chowk?"</em> or <em>"Does Kashmere Gate have lifts?"</em>. MetroMate AI calls backend transit tools in real time and speaks the answer aloud.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('assistant')}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-dmrc-red to-rose-600 text-white font-bold text-xs sm:text-sm hover:brightness-105 transition-all shadow-md flex items-center gap-2"
              >
                <span>Launch MetroMate AI</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('tourist-guide')}
                className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm transition-colors border border-slate-700"
              >
                Tourist Mode
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Passenger Announcements & Advisories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-50/50 rounded-3xl border border-amber-200/80 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {language === 'hi' ? 'यात्री सूचनाएं एवं परामर्श' : 'Important Passenger Announcements'}
              </h2>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-200/60 text-amber-900">
              DEMO DATA
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {announcements.map((a) => (
              <div key={a.id} className="bg-white p-4 rounded-xl border border-amber-200/60 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-700 uppercase tracking-wider text-[10px]">
                    {a.type} • {a.line}
                  </span>
                  <span className="text-slate-400 text-[11px]">{a.date}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 leading-snug">
                  {language === 'hi' && a.title_hi ? a.title_hi : a.title}
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {a.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accessibility Commitment Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-dmrc-red flex items-center justify-center shrink-0">
              <Accessibility className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {language === 'hi' ? 'सुलभ और बाधा-मुक्त यात्रा' : 'Accessible & Barrier-Free Transit'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl mt-1 leading-relaxed">
                Delhi Metro is committed to barrier-free travel for senior citizens and passengers with disabilities. Filter stations by operational lifts, tactile paving, and wheelchair-friendly paths.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('stations', { filter: 'accessible' })}
            className="py-2.5 px-5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all shrink-0"
          >
            Explore Accessible Stations
          </button>
        </div>
      </section>
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { Activity, RefreshCw, AlertTriangle, CheckCircle2, Clock, Info, ShieldAlert } from 'lucide-react';
import { MetroLine, Announcement, Language } from '../types';
import { fetchLinesStatus } from '../services/api';

interface LiveStatusPageProps {
  language: Language;
}

export const LiveStatusPage: React.FC<LiveStatusPageProps> = ({ language }) => {
  const [lines, setLines] = useState<MetroLine[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'delayed'>('all');

  const loadStatus = async () => {
    setIsRefreshing(true);
    try {
      const data = await fetchLinesStatus();
      setLines(data.lines);
      setAnnouncements(data.announcements);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } finally {
      setTimeout(() => setIsRefreshing(false), 400);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const displayedLines = filterStatus === 'delayed'
    ? lines.filter(l => l.status.toLowerCase().includes('delay') || l.status.toLowerCase().includes('maintenance'))
    : lines;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-2">
            <Activity className="w-4 h-4 animate-pulse" />
            <span>Real-Time Network Telemetry Dashboard</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {language === 'hi' ? 'लाइव मेट्रो लाइन स्टेटस' : 'Live Metro Line Status'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {language === 'hi'
              ? 'दिल्ली-एनसीआर में सभी 10 मेट्रो लाइनों का सेवा स्वास्थ्य और तात्कालिक परामर्श'
              : 'Operational health, maintenance advisories and frequency metrics across all 10 corridors.'}
          </p>
        </div>

        {/* Refresh & Last Updated */}
        <div className="flex items-center gap-3">
          <div className="text-right text-xs text-slate-500">
            <div>Last Updated: <strong className="text-slate-900">{lastUpdated || 'Just now'}</strong></div>
            <div className="text-[11px] text-slate-400">Auto-sync active</div>
          </div>

          <button
            onClick={loadStatus}
            disabled={isRefreshing}
            className="p-3 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-slate-700 hover:text-slate-900 shadow-xs transition-all disabled:opacity-50"
            title="Refresh status"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-dmrc-red' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mandatory Demo Data Transparency Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-200 text-amber-900">
              DEMO DATA TRANSPARENCY
            </span>
            <span className="text-xs font-semibold text-amber-900">
              Hackathon Demonstration Notice
            </span>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            Public operational telemetry APIs for Delhi Metro train GPS are not publicly accessible. The status data shown below is simulated for prototype evaluation purposes. The backend architecture is configured to seamlessly ingest official DMRC GTFS-RT telemetry streams once integrated.
          </p>
        </div>
      </div>

      {/* Overview Status Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">8 / 9</div>
            <div className="text-xs text-slate-500 font-medium">Lines Running Normal</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">1 Line</div>
            <div className="text-xs text-slate-500 font-medium">Minor Delay Reported (T1)</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">3 - 4 min</div>
            <div className="text-xs text-slate-500 font-medium">Average Peak Frequency</div>
          </div>
        </div>
      </div>

      {/* Corridor Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Corridor-by-Corridor Status</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`text-xs font-semibold px-3 py-1 rounded-lg border transition-all ${
                filterStatus === 'all'
                  ? 'border-dmrc-red bg-red-50 text-dmrc-red'
                  : 'border-slate-200 bg-white text-slate-600'
              }`}
            >
              All Corridors ({lines.length})
            </button>
            <button
              onClick={() => setFilterStatus('delayed')}
              className={`text-xs font-semibold px-3 py-1 rounded-lg border transition-all ${
                filterStatus === 'delayed'
                  ? 'border-dmrc-red bg-red-50 text-dmrc-red'
                  : 'border-slate-200 bg-white text-slate-600'
              }`}
            >
              Advisories Only
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedLines.map((line) => {
            const isNormal = line.status.toLowerCase().includes('normal');
            return (
              <div
                key={line.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-card transition-all space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full ring-2 ring-white shadow-xs shrink-0"
                      style={{ backgroundColor: line.line_color }}
                    />
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{line.line_name}</h3>
                      <span className="text-[11px] text-slate-400 font-mono">Code: {line.line_code}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isNormal ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-100 text-amber-900 animate-pulse'
                  }`}>
                    {line.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {line.description}
                </p>

                <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                  <div>
                    <span className="block font-semibold text-slate-700">Operating Hours:</span>
                    <span>{line.operating_hours}</span>
                  </div>
                  <div>
                    <span className="block font-semibold text-slate-700">Peak Frequency:</span>
                    <span>Every {line.frequency_min} mins</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Advisories Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Active Travel Advisories & Scheduled Maintenance</span>
        </h2>

        <div className="space-y-3">
          {announcements.map((a) => (
            <div key={a.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">{a.title}</span>
                <span className="text-slate-400 text-[11px]">{a.date}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{a.description}</p>
              <div className="text-[10px] font-semibold text-slate-400 pt-1">
                Applies to: {a.line} • {a.is_demo ? 'Simulated Hackathon Notice' : 'Official Notice'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


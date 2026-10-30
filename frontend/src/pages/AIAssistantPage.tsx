import React from 'react';
import { Bot, Wrench, Sparkles, Mic, Volume2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { MetroMateChat } from '../components/MetroMateChat';
import { Language } from '../types';

interface AIAssistantPageProps {
  onNavigateToRoute: (source: string, destination: string) => void;
  language: Language;
}

export const AIAssistantPage: React.FC<AIAssistantPageProps> = ({ onNavigateToRoute, language }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2">
          <Bot className="w-4 h-4 text-emerald-600 animate-pulse" />
          <span>LLM Tool-Calling Travel Architecture</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          MetroMate AI Travel Assistant
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {language === 'hi'
            ? 'प्राकृतिक भाषा और आवाज द्वारा दिल्ली मेट्रो रूट, किराया और सुविधाओं की जानकारी प्राप्त करें'
            : 'Natural language and speech-driven metro assistant powered by real-time backend tool calling.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Chat Interface */}
        <div className="lg:col-span-8">
          <MetroMateChat language={language} onNavigateToRoute={onNavigateToRoute} />
        </div>

        {/* Right Architectural Context Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Tool Calling Architecture Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Wrench className="w-4 h-4 text-amber-500" />
              <span>Registered Backend Tools</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              MetroMate AI does not hallucinate routes or fares. When answering, the agent invokes structured backend tools:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-mono font-bold text-dmrc-red">calculate_route</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Executes Dijkstra's algorithm across graph vertices</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-mono font-bold text-dmrc-red">get_nearby_landmarks</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Resolves monuments (e.g. India Gate) to closest stations</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-mono font-bold text-dmrc-red">get_station_details</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Queries lifts, parking, gates, and timings</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-mono font-bold text-dmrc-red">get_estimated_fare</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Applies official DMRC distance slabs & discounts</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-mono font-bold text-dmrc-red">get_metro_line_status</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Checks line delays and scheduled maintenance</p>
              </div>
            </div>
          </div>

          {/* Multilingual Voice Features Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Mic className="w-4 h-4 text-dmrc-red" />
              <span>Voice Interaction</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Equipped with browser-native <strong>Web Speech API</strong> (Speech-to-Text) and <strong>Speech Synthesis API</strong> (Text-to-Speech) supporting both English (en-IN) and Hindi (hi-IN).
            </p>
            <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
              Try clicking the mic and saying:
              <br />
              <strong className="text-slate-900">"Mujhe Rajiv Chowk se Kashmere Gate jaana hai"</strong>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};


import React from 'react';
import { Train, Phone, ShieldCheck, Info, Heart, ExternalLink } from 'lucide-react';
import { Language } from '../types';

interface FooterProps {
  onNavigate: (page: string) => void;
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, language }) => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-dmrc-red flex items-center justify-center text-white">
                <Train className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                DMRC <span className="text-dmrc-red">ONE</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              {language === 'hi' 
                ? 'दिल्ली मेट्रो रेल कॉर्पोरेशन का एकीकृत डिजिटल अनुभव। यात्रा योजना, स्टेशन सुविधाएं और स्मार्ट सहायता।'
                : 'The unified digital experience for Delhi Metro Rail Corporation. Empowering millions with intelligent journeys, station directories, and AI passenger assistance.'}
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold">
              <Info className="w-3.5 h-3.5" />
              <span>Hackathon Prototype Build</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              {language === 'hi' ? 'सेवाएं' : 'Passenger Services'}
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('journey-planner')} className="hover:text-dmrc-red transition-colors">
                  {language === 'hi' ? 'स्मार्ट यात्रा योजना' : 'Smart Journey Planner'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('map')} className="hover:text-dmrc-red transition-colors">
                  {language === 'hi' ? 'इंटरएक्टिव नेटवर्क मैप' : 'Interactive Metro Map'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('stations')} className="hover:text-dmrc-red transition-colors">
                  {language === 'hi' ? 'स्टेशन डायरेक्टरी व सुविधाएं' : 'Station Directory & Facilities'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('live-status')} className="hover:text-dmrc-red transition-colors">
                  {language === 'hi' ? 'लाइव लाइन स्टेटस' : 'Live Metro Line Status'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tickets')} className="hover:text-dmrc-red transition-colors">
                  {language === 'hi' ? 'स्मार्ट टिकटिंग व स्मार्ट कार्ड' : 'Smart Ticketing & NCMC'}
                </button>
              </li>
            </ul>
          </div>

          {/* Tourist & Support */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              {language === 'hi' ? 'पर्यटन एवं सहायता' : 'Explore & Support'}
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('tourist-guide')} className="hover:text-dmrc-red transition-colors">
                  {language === 'hi' ? 'दिल्ली दर्शन टूरिस्ट गाइड' : 'Tourist Mode (Delhi Sights)'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('assistant')} className="hover:text-dmrc-red transition-colors">
                  {language === 'hi' ? 'मेट्रोमेट एआई असिस्टेंट' : 'MetroMate AI Assistant'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('support')} className="hover:text-dmrc-red transition-colors">
                  {language === 'hi' ? 'खोया-पाया व सहायता केंद्र' : 'Lost & Found / Helpdesk'}
                </button>
              </li>
              <li>
                <a 
                  href="https://delhimetrorail.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1 hover:text-dmrc-red transition-colors"
                >
                  <span>Official DMRC Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Emergency Helplines */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              {language === 'hi' ? 'आपातकालीन हेल्पलाइन' : '24x7 Helplines'}
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-semibold text-slate-900 flex items-center justify-between">
                  <span>Passenger Helpline</span>
                  <span className="text-dmrc-red font-bold text-sm">155370</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">Toll-free 24/7 service inquiries</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-semibold text-slate-900 flex items-center justify-between">
                  <span>Women Passenger Helpline</span>
                  <span className="text-dmrc-red font-bold text-sm">1091</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">Priority assistance for women safety</p>
              </div>

              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>CISF Metro Control Room: 011-23417910</span>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-8 border-slate-200" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 DMRC ONE. Concept and prototype for unified public transportation experience.
          </div>
          <div className="flex items-center gap-4">
            <span>Light Theme Exclusive</span>
            <span>•</span>
            <span>Dijkstra Graph Routing</span>
            <span>•</span>
            <span>Multilingual Web Speech</span>
          </div>
        </div>
      </div>
    </footer>
  );
};


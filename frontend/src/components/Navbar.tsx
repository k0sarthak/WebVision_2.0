import React, { useState } from 'react';
import { 
  Train, 
  Map, 
  Compass, 
  Activity, 
  Ticket, 
  Landmark, 
  Bot, 
  Globe, 
  Eye, 
  Menu, 
  X,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { Language } from '../types';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenAccessibility: () => void;
  onToggleAIAssistant: () => void;
  isAIAssistantOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  language,
  onLanguageChange,
  onOpenAccessibility,
  onToggleAIAssistant,
  isAIAssistantOpen = false
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: language === 'hi' ? 'होम' : 'Home', icon: Train },
    { id: 'journey-planner', label: language === 'hi' ? 'यात्रा योजना' : 'Journey Planner', icon: Compass },
    { id: 'map', label: language === 'hi' ? 'मेट्रो मैप' : 'Metro Map', icon: Map },
    { id: 'stations', label: language === 'hi' ? 'स्टेशन' : 'Stations', icon: Landmark },
    { id: 'live-status', label: language === 'hi' ? 'लाइव स्टेटस' : 'Live Status', icon: Activity },
    { id: 'tickets', label: language === 'hi' ? 'टिकट' : 'Tickets', icon: Ticket },
    { id: 'tourist-guide', label: language === 'hi' ? 'पर्यटन' : 'Tourist Guide', icon: Landmark },
  ];

  const handleLinkClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Advisory Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden md:block border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-amber-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              {language === 'hi' ? '24x7 हेल्पलाइन:' : '24x7 Passenger Helpline:'}
            </span>
            <span className="text-white font-semibold">155370</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">
              {language === 'hi' ? 'महिला हेल्पलाइन:' : 'Women Helpline:'} <strong className="text-white">1091</strong>
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Official Digital Portal of Delhi Metro Rail Corporation</span>
            <span className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded font-mono">
              HACKATHON BUILD
            </span>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Left: DMRC ONE Brand Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleLinkClick('home')}>
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-dmrc-red to-dmrc-darkred flex items-center justify-center text-white shadow-sm ring-2 ring-red-100">
                <Train className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">
                    DMRC <span className="text-dmrc-red">ONE</span>
                  </span>
                  <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                    Unified
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-500 hidden sm:block tracking-tight">
                  One Network. One Experience. Smarter Journeys.
                </span>
              </div>
            </div>

            {/* Center: Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = currentPage === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleLinkClick(link.id)}
                    className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      isActive
                        ? 'text-dmrc-red bg-red-50 shadow-xs ring-1 ring-red-100'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>

            {/* Right: Actions (AI Assistant, Lang, Accessibility, Hamburger) */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              
              {/* MetroMate AI CTA */}
              <button
                type="button"
                onClick={onToggleAIAssistant}
                className={`relative px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-xs ${
                  isAIAssistantOpen
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-gradient-to-r from-dmrc-red to-dmrc-darkred text-white hover:brightness-105'
                }`}
                title="Open MetroMate AI Assistant"
              >
                <Bot className="w-4 h-4 animate-bounce" />
                <span className="hidden sm:inline">MetroMate AI</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </button>

              {/* Language Selector */}
              <div className="hidden sm:flex items-center border border-slate-200 rounded-xl p-0.5 bg-slate-50">
                <button
                  type="button"
                  onClick={() => onLanguageChange('en')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                    language === 'en'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => onLanguageChange('hi')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                    language === 'hi'
                      ? 'bg-white text-dmrc-red shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  हिन्दी
                </button>
              </div>

              {/* Accessibility Settings Button */}
              <button
                type="button"
                onClick={onOpenAccessibility}
                className="p-2 sm:px-3 sm:py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                title="Accessibility Preferences"
                aria-label="Accessibility Settings"
              >
                <Eye className="w-4 h-4 text-slate-500" />
                <span className="hidden md:inline">Aa</span>
              </button>

              {/* Mobile Menu Hamburger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100"
                aria-label="Open Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-slate-800" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                onClick={() => {
                  onLanguageChange(language === 'en' ? 'hi' : 'en');
                }}
                className="py-2 px-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-2 bg-slate-50"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'हिन्दी में बदलें' : 'Switch to English'}</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAccessibility();
                }}
                className="py-2 px-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-2 bg-slate-50"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Accessibility</span>
              </button>
            </div>

            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-red-50 text-dmrc-red'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-dmrc-red' : 'text-slate-400'}`} />
                    <span>{link.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </button>
              );
            })}

            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onToggleAIAssistant();
                }}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center gap-2"
              >
                <Bot className="w-4 h-4 text-emerald-400" />
                <span>Ask MetroMate AI</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};


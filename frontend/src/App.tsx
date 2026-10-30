import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AccessibilityDrawer } from './components/AccessibilityDrawer';
import { MetroMateChat } from './components/MetroMateChat';

import { HomePage } from './pages/HomePage';
import { JourneyPlannerPage } from './pages/JourneyPlannerPage';
import { MetroMapPage } from './pages/MetroMapPage';
import { LiveStatusPage } from './pages/LiveStatusPage';
import { StationExplorerPage } from './pages/StationExplorerPage';
import { TicketingHubPage } from './pages/TicketingHubPage';
import { TouristModePage } from './pages/TouristModePage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { SupportPage } from './pages/SupportPage';

import { Language, AccessibilitySettings, RouteResult } from './types';
import { Bot, MessageSquare, X } from 'lucide-react';

export function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [language, setLanguage] = useState<Language>('en');
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>({
    fontSize: 'md',
    highContrast: false,
    reducedMotion: false,
    screenReaderOptimized: false
  });
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isFloatingAIOpen, setIsFloatingAIOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState<RouteResult | null>(null);

  const [plannerParams, setPlannerParams] = useState<{
    source?: string;
    destination?: string;
    preference?: string;
  }>({
    source: 'Kashmere Gate',
    destination: 'Rajiv Chowk',
    preference: 'fastest'
  });

  const [stationExplorerFilter, setStationExplorerFilter] = useState<string>('all');

  // Synchronize accessibility styles to body
  useEffect(() => {
    const body = document.body;
    body.classList.remove('font-sm', 'font-md', 'font-lg', 'font-xl', 'high-contrast');
    body.classList.add(`font-${accessibilitySettings.fontSize}`);
    if (accessibilitySettings.highContrast) {
      body.classList.add('high-contrast');
    }
  }, [accessibilitySettings]);

  const handleNavigate = (pageId: string, params?: any) => {
    if (pageId === 'journey-planner' && params) {
      setPlannerParams(params);
    }
    if (pageId === 'stations' && params?.filter) {
      setStationExplorerFilter(params.filter);
    }
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToMapWithRoute = (route: RouteResult) => {
    setActiveRoute(route);
    setCurrentPage('map');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlanRouteWithStation = (stationName: string, role: 'source' | 'destination') => {
    if (role === 'source') {
      setPlannerParams(prev => ({ ...prev, source: stationName }));
    } else {
      setPlannerParams(prev => ({ ...prev, destination: stationName }));
    }
    setCurrentPage('journey-planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-dmrc-bg text-dmrc-text font-sans antialiased selection:bg-red-500 selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        language={language}
        onLanguageChange={setLanguage}
        onOpenAccessibility={() => setIsAccessibilityOpen(true)}
        onToggleAIAssistant={() => setIsFloatingAIOpen(!isFloatingAIOpen)}
        isAIAssistantOpen={isFloatingAIOpen}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage onNavigate={handleNavigate} language={language} />
        )}

        {currentPage === 'journey-planner' && (
          <JourneyPlannerPage
            initialSource={plannerParams.source}
            initialDestination={plannerParams.destination}
            initialPreference={plannerParams.preference}
            onNavigateToMap={handleNavigateToMapWithRoute}
            language={language}
          />
        )}

        {currentPage === 'map' && (
          <MetroMapPage
            activeRoute={activeRoute}
            onClearActiveRoute={() => setActiveRoute(null)}
            onNavigateToPlanner={(src, dst) => {
              setPlannerParams({ source: src, destination: dst, preference: 'fastest' });
              setCurrentPage('journey-planner');
            }}
            language={language}
          />
        )}

        {currentPage === 'live-status' && (
          <LiveStatusPage language={language} />
        )}

        {currentPage === 'stations' && (
          <StationExplorerPage
            initialFilter={stationExplorerFilter}
            onPlanRouteWithStation={handlePlanRouteWithStation}
            language={language}
          />
        )}

        {currentPage === 'tickets' && (
          <TicketingHubPage language={language} />
        )}

        {currentPage === 'tourist-guide' && (
          <TouristModePage
            onPlanRouteToSpot={(stationName) => {
              setPlannerParams(prev => ({
                source: prev.source || 'Rajiv Chowk',
                destination: stationName,
                preference: 'fastest'
              }));
              setCurrentPage('journey-planner');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            language={language}
          />
        )}

        {currentPage === 'assistant' && (
          <AIAssistantPage
            onNavigateToRoute={(src, dst) => {
              setPlannerParams({ source: src, destination: dst, preference: 'fastest' });
              setCurrentPage('journey-planner');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            language={language}
          />
        )}

        {currentPage === 'support' && (
          <SupportPage language={language} />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} language={language} />

      {/* Slide-Over Accessibility Drawer */}
      <AccessibilityDrawer
        isOpen={isAccessibilityOpen}
        onClose={() => setIsAccessibilityOpen(false)}
        settings={accessibilitySettings}
        onUpdateSettings={(newSettings) =>
          setAccessibilitySettings(prev => ({ ...prev, ...newSettings }))
        }
        language={language}
        onLanguageChange={setLanguage}
      />

      {/* Floating MetroMate AI Widget Button & Modal */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isFloatingAIOpen ? (
          <button
            type="button"
            onClick={() => setIsFloatingAIOpen(true)}
            className="w-14 h-14 rounded-2xl bg-gradient-to-r from-dmrc-red to-dmrc-darkred text-white flex items-center justify-center shadow-dropdown hover:scale-105 active:scale-95 transition-all group relative ring-4 ring-white"
            title="Ask MetroMate AI"
            aria-label="Open MetroMate AI Assistant"
          >
            <Bot className="w-7 h-7 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
          </button>
        ) : (
          <div className="animate-in slide-in-from-bottom-5 duration-200 shadow-2xl">
            <MetroMateChat
              language={language}
              isFloating={true}
              onCloseFloating={() => setIsFloatingAIOpen(false)}
              onNavigateToRoute={(src, dst) => {
                setIsFloatingAIOpen(false);
                setPlannerParams({ source: src, destination: dst, preference: 'fastest' });
                setCurrentPage('journey-planner');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

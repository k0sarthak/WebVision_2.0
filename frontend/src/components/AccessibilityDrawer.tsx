import React from 'react';
import { X, Eye, Type, Zap, Volume2, Check } from 'lucide-react';
import { AccessibilitySettings, Language } from '../types';

interface AccessibilityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AccessibilitySettings;
  onUpdateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const AccessibilityDrawer: React.FC<AccessibilityDrawerProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  language,
  onLanguageChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 border-l border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-dmrc-red">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {language === 'hi' ? 'सुलभता सेटिंग्स' : 'Accessibility Settings'}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'hi' ? 'अपनी सुविधा अनुसार अनुभव अनुकूलित करें' : 'Tailor your viewing experience'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Language Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              {language === 'hi' ? 'भाषा (Language)' : 'Interface Language'}
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`py-2.5 px-4 rounded-xl text-sm font-semibold border flex items-center justify-between transition-all ${
                  language === 'en'
                    ? 'border-dmrc-red bg-red-50 text-dmrc-red shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <span>English</span>
                {language === 'en' && <Check className="w-4 h-4 text-dmrc-red" />}
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('hi')}
                className={`py-2.5 px-4 rounded-xl text-sm font-semibold border flex items-center justify-between transition-all ${
                  language === 'hi'
                    ? 'border-dmrc-red bg-red-50 text-dmrc-red shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <span>हिन्दी (Hindi)</span>
                {language === 'hi' && <Check className="w-4 h-4 text-dmrc-red" />}
              </button>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Text Sizing */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-slate-600" />
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {language === 'hi' ? 'पाठ का आकार (Text Size)' : 'Text Size'}
              </label>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => onUpdateSettings({ fontSize: size })}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                    settings.fontSize === size
                      ? 'border-dmrc-red bg-red-50 text-dmrc-red ring-1 ring-dmrc-red'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {size === 'sm' ? 'A-' : size === 'md' ? 'Default' : size === 'lg' ? 'A+' : 'A++'}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* High Contrast Mode (Strict Light Theme) */}
          <div className="flex items-center justify-between py-1">
            <div>
              <div className="text-sm font-bold text-slate-900">
                {language === 'hi' ? 'उच्च कंट्रास्ट मोड (High Contrast)' : 'Enhanced Contrast Mode'}
              </div>
              <div className="text-xs text-slate-500">
                {language === 'hi'
                  ? 'स्पष्ट देखने के लिए गहरे बॉर्डर व अक्षरों को सक्रिय करें'
                  : 'Sharpens borders, text weight and outlines while remaining in light theme'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onUpdateSettings({ highContrast: !settings.highContrast })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                settings.highContrast ? 'bg-dmrc-red' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.highContrast ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between py-1">
            <div>
              <div className="text-sm font-bold text-slate-900">
                {language === 'hi' ? 'धीमी गति (Reduced Motion)' : 'Reduced Motion'}
              </div>
              <div className="text-xs text-slate-500">
                {language === 'hi'
                  ? 'अनावश्यक एनिमेशन और ट्रांज़िशन को बंद करें'
                  : 'Minimizes interface transitions and decorative animations'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onUpdateSettings({ reducedMotion: !settings.reducedMotion })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                settings.reducedMotion ? 'bg-dmrc-red' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.reducedMotion ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Screen Reader Optimization */}
          <div className="flex items-center justify-between py-1">
            <div>
              <div className="text-sm font-bold text-slate-900">
                {language === 'hi' ? 'स्क्रीन रीडर अनुकूलन' : 'Screen Reader Optimized'}
              </div>
              <div className="text-xs text-slate-500">
                {language === 'hi'
                  ? 'विस्तृत ARIA लेबल्स और कीबोर्ड नेविगेशन'
                  : 'Exposes descriptive ARIA landmark roles and expanded travel labels'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onUpdateSettings({ screenReaderOptimized: !settings.screenReaderOptimized })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                settings.screenReaderOptimized ? 'bg-dmrc-red' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.screenReaderOptimized ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-5 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            DMRC ONE adheres to Web Content Accessibility Guidelines (WCAG 2.1 AA)
          </p>
        </div>
      </div>
    </div>
  );
};


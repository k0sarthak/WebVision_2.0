import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Mic, X, Loader2 } from 'lucide-react';
import { Station, Language } from '../types';
import { searchStations } from '../services/api';
import { useSpeech } from '../hooks/useSpeech';

interface StationAutocompleteProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  onSelectStation?: (station: Station) => void;
  language?: Language;
  required?: boolean;
}

export const StationAutocomplete: React.FC<StationAutocompleteProps> = ({
  label,
  placeholder,
  value,
  onChange,
  onSelectStation,
  language = 'en',
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const { isListening, transcript, startListening, stopListening, isRecognitionSupported } = useSpeech();

  // Handle voice transcript filling into input
  useEffect(() => {
    if (transcript && isListening) {
      onChange(transcript);
    }
  }, [transcript, isListening, onChange]);

  // Query suggestions when value changes
  useEffect(() => {
    if (value.trim().length >= 1) {
      setIsLoading(true);
      const timer = setTimeout(async () => {
        const results = await searchStations(value.trim());
        setSuggestions(results);
        setIsLoading(false);
        setIsOpen(true);
      }, 150);
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [value]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleSelect(suggestions[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelect = (station: Station) => {
    onChange(station.name);
    if (onSelectStation) {
      onSelectStation(station);
    }
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const toggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening(language);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
        {label} {required && <span className="text-dmrc-red">*</span>}
      </label>

      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-slate-400 pointer-events-none">
          <MapPin className="w-4 h-4 text-slate-400" />
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-20 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-dmrc-red/20 focus:border-dmrc-red transition-all shadow-xs"
        />

        <div className="absolute right-2.5 flex items-center gap-1">
          {isLoading && <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />}

          {value && !isLoading && (
            <button
              type="button"
              onClick={() => {
                onChange('');
                setSuggestions([]);
                setIsOpen(false);
              }}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              title="Clear input"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {isRecognitionSupported && (
            <button
              type="button"
              onClick={toggleVoice}
              className={`p-1.5 rounded-lg transition-colors ${
                isListening
                  ? 'bg-dmrc-red text-white animate-pulse'
                  : 'text-slate-400 hover:text-dmrc-red hover:bg-red-50'
              }`}
              title={isListening ? 'Listening... click to stop' : 'Speak station name'}
            >
              <Mic className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white rounded-xl border border-slate-200 shadow-dropdown max-h-64 overflow-y-auto py-1">
          {suggestions.map((st, idx) => (
            <button
              key={st.id}
              type="button"
              onClick={() => handleSelect(st)}
              className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between transition-colors ${
                idx === selectedIndex ? 'bg-red-50 text-dmrc-red' : 'hover:bg-slate-50 text-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MapPin className={`w-4 h-4 ${idx === selectedIndex ? 'text-dmrc-red' : 'text-slate-400'}`} />
                <div>
                  <div className="text-sm font-medium flex items-center gap-2">
                    <span>{st.name}</span>
                    {st.name_hi && (
                      <span className="text-xs text-slate-400 font-normal">({st.name_hi})</span>
                    )}
                  </div>
                  {st.landmarks && st.landmarks.length > 0 && (
                    <div className="text-xs text-slate-500">
                      Near: {st.landmarks[0]}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {st.is_interchange && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                    Interchange
                  </span>
                )}
                {st.lines.slice(0, 2).map(l => (
                  <span
                    key={l}
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded capitalize"
                    style={{
                      backgroundColor: l === 'yellow' ? '#FEF08A' : l === 'blue' ? '#DBEAFE' : l === 'red' ? '#FEE2E2' : '#F1F5F9',
                      color: l === 'yellow' ? '#854D0E' : l === 'blue' ? '#1E40AF' : l === 'red' ? '#991B1B' : '#475569'
                    }}
                  >
                    {l}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};


import React from 'react';

interface MetroLineBadgeProps {
  lineId: string;
  lineName?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LINE_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  yellow: { bg: '#FBC02D', text: '#000000', label: 'Yellow Line' },
  blue: { bg: '#1976D2', text: '#FFFFFF', label: 'Blue Line' },
  red: { bg: '#D32F2F', text: '#FFFFFF', label: 'Red Line' },
  green: { bg: '#388E3C', text: '#FFFFFF', label: 'Green Line' },
  violet: { bg: '#7B1FA2', text: '#FFFFFF', label: 'Violet Line' },
  pink: { bg: '#EC407A', text: '#FFFFFF', label: 'Pink Line' },
  magenta: { bg: '#880E4F', text: '#FFFFFF', label: 'Magenta Line' },
  airport: { bg: '#FF6F00', text: '#FFFFFF', label: 'Airport Express' },
  grey: { bg: '#757575', text: '#FFFFFF', label: 'Grey Line' },
};

export const MetroLineBadge: React.FC<MetroLineBadgeProps> = ({ lineId, lineName, size = 'md' }) => {
  const normId = lineId.toLowerCase();
  const config = LINE_COLORS[normId] || { bg: '#E53935', text: '#FFFFFF', label: lineName || lineId };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs font-medium px-2.5 py-1',
    lg: 'text-sm font-semibold px-3 py-1.5'
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full shadow-xs transition-transform hover:scale-105 ${sizeClasses}`}
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      <span>{lineName || config.label}</span>
    </span>
  );
};


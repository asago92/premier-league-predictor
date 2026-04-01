import { useState, useCallback } from 'react';
import type { Team } from '@/types';
import { Calculator, SlidersHorizontal } from 'lucide-react';

interface ProbabilitySliderProps {
  team: Team;
  value: number;
  onChange: (value: number) => void;
  label: string;
  isHome: boolean;
}

export function ProbabilitySlider({ team, value, onChange, label, isHome }: ProbabilitySliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    onChange(newValue);
  }, [onChange]);

  const percentage = Math.round((value / 0.1) * 100);
  
  // Get the calculated base probability
  const baseProbability = isHome 
    ? team.calculatedProbability.home 
    : team.calculatedProbability.away;
  
  // Check if user has adjusted from calculated value
  const isAdjusted = Math.abs(value - baseProbability) > 0.001;
  
  return (
    <div className="w-full py-4">
      {/* Header with calculated indicator */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-500">
            Calculated: {baseProbability.toFixed(3)}
          </span>
        </div>
        {isAdjusted && (
          <div className="flex items-center gap-1 text-amber-600">
            <SlidersHorizontal className="w-3 h-3" />
            <span className="text-xs font-medium">Adjusted</span>
          </div>
        )}
      </div>
      
      {/* Value display */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-600 font-mono text-sm">0.000</span>
        <div 
          className="relative"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div 
            className="text-white px-4 py-2 rounded-lg font-mono text-lg font-bold shadow-lg transition-transform"
            style={{ 
              transform: isDragging ? 'scale(1.1)' : 'scale(1)',
              backgroundColor: isAdjusted ? '#F59E0B' : team.color
            }}
          >
            {value.toFixed(3)}
          </div>
          {showTooltip && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {percentage}% of max
            </div>
          )}
        </div>
        <span className="text-gray-600 font-mono text-sm">0.100</span>
      </div>
      
      {/* Slider container */}
      <div className="relative h-12 flex items-center">
        {/* Track background */}
        <div className="absolute w-full h-2 bg-gray-300 rounded-full" />
        
        {/* Base probability marker */}
        <div 
          className="absolute w-1 h-4 bg-gray-500 rounded-full z-5"
          style={{ 
            left: `${(baseProbability / 0.1) * 100}%`,
            transform: 'translateX(-50%)'
          }}
          title={`Calculated base: ${baseProbability.toFixed(3)}`}
        />
        
        {/* Filled track */}
        <div 
          className="absolute h-2 rounded-full transition-all duration-150"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: isAdjusted ? '#F59E0B' : team.color
          }}
        />
        
        {/* Slider input */}
        <input
          type="range"
          min="0"
          max="0.1"
          step="0.001"
          value={value}
          onChange={handleSliderChange}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          className="absolute w-full h-8 opacity-0 cursor-pointer z-10"
        />
        
        {/* Custom thumb */}
        <div 
          className="absolute w-8 h-8 bg-white rounded-full shadow-lg border-4 transition-all duration-150 pointer-events-none"
          style={{ 
            left: `calc(${percentage}% - 16px)`,
            borderColor: isAdjusted ? '#F59E0B' : team.color,
            transform: isDragging ? 'scale(1.2)' : 'scale(1)'
          }}
        />
      </div>
      
      {/* Team label */}
      <div className="text-center mt-2">
        <span 
          className="text-lg font-bold tracking-wider"
          style={{ color: team.color }}
        >
          {label}
        </span>
        <p className="text-xs text-gray-400 mt-1">
          Goals per minute probability
        </p>
      </div>
    </div>
  );
}

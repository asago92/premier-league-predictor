import { useState } from 'react';
import type { Team } from '@/types';
import { premierLeagueTeams } from '@/data/teams';
import { ChevronDown } from 'lucide-react';

interface TeamSelectorProps {
  selectedTeam: Team;
  onSelect: (team: Team) => void;
  label: string;
}

export function TeamSelector({ selectedTeam, onSelect, label }: TeamSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      
      {/* Selected team display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white border-2 border-gray-200 rounded-lg px-4 py-3 hover:border-gray-300 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: selectedTeam.color }}
          >
            {selectedTeam.shortName}
          </div>
          <span className="font-medium">{selectedTeam.name}</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {/* Dropdown */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto">
            {premierLeagueTeams.map((team) => (
              <button
                key={team.id}
                onClick={() => {
                  onSelect(team);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                  team.id === selectedTeam.id ? 'bg-gray-50' : ''
                }`}
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: team.color }}
                >
                  {team.shortName}
                </div>
                <span className="font-medium">{team.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

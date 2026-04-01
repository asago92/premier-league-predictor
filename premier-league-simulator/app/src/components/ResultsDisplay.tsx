import type { SimulationResults, Team } from '@/types';

interface ResultsDisplayProps {
  results: SimulationResults | null;
  homeTeam: Team;
  awayTeam: Team;
  isLoading: boolean;
}

export function ResultsDisplay({ results, homeTeam, awayTeam, isLoading }: ResultsDisplayProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Simulation Results</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800" />
        </div>
        <p className="text-center text-gray-500">Running Monte Carlo simulation...</p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Simulation Results</h3>
        <p className="text-gray-500 text-center py-8">
          Adjust probabilities and click "Run Simulation" to see predictions
        </p>
      </div>
    );
  }

  const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;
  
  const getBarWidth = (value: number) => `${Math.max(value * 100, 5)}%`;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Match Prediction</h3>
      
      {/* Win probabilities */}
      <div className="space-y-4">
        {/* Home Win */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="font-medium" style={{ color: homeTeam.color }}>
              {homeTeam.name} Win
            </span>
            <span className="font-bold">{formatPercent(results.homeWinProbability)}</span>
          </div>
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-500 ease-out rounded-full"
              style={{ 
                width: getBarWidth(results.homeWinProbability),
                backgroundColor: homeTeam.color
              }}
            />
          </div>
        </div>
        
        {/* Draw */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="font-medium text-gray-600">Draw</span>
            <span className="font-bold">{formatPercent(results.drawProbability)}</span>
          </div>
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gray-500 transition-all duration-500 ease-out rounded-full"
              style={{ width: getBarWidth(results.drawProbability) }}
            />
          </div>
        </div>
        
        {/* Away Win */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="font-medium" style={{ color: awayTeam.color }}>
              {awayTeam.name} Win
            </span>
            <span className="font-bold">{formatPercent(results.awayWinProbability)}</span>
          </div>
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-500 ease-out rounded-full"
              style={{ 
                width: getBarWidth(results.awayWinProbability),
                backgroundColor: awayTeam.color
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Expected goals */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-600 mb-3">Expected Goals</h4>
        <div className="flex justify-between">
          <div className="text-center">
            <div 
              className="text-2xl font-bold"
              style={{ color: homeTeam.color }}
            >
              {results.averageHomeGoals.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">{homeTeam.name}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-400">-</div>
          </div>
          <div className="text-center">
            <div 
              className="text-2xl font-bold"
              style={{ color: awayTeam.color }}
            >
              {results.averageAwayGoals.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">{awayTeam.name}</div>
          </div>
        </div>
      </div>
      
      {/* Simulation info */}
      <div className="mt-4 pt-4 border-t border-gray-200 text-center">
        <span className="text-xs text-gray-400">
          Based on {results.totalSimulations.toLocaleString()} Monte Carlo simulations
        </span>
      </div>
    </div>
  );
}

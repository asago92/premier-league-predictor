import type { Team } from '@/types';

interface ScoreboardProps {
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
}

export function Scoreboard({ homeTeam, awayTeam, homeScore, awayScore }: ScoreboardProps) {
  const formatScore = (score: number) => score.toString().padStart(2, '0');
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-xl">
      <div className="flex items-center justify-between gap-8">
        {/* Home Team */}
        <div className="flex flex-col items-center">
          <span 
            className="text-sm font-bold tracking-wider mb-2"
            style={{ color: homeTeam.color }}
          >
            {homeTeam.name.toUpperCase()}
          </span>
          <div className="bg-black rounded px-4 py-2 min-w-[60px] text-center">
            <span className="text-4xl font-mono font-bold text-red-500">
              {formatScore(homeScore)}
            </span>
          </div>
        </div>
        
        {/* VS Divider */}
        <div className="flex flex-col items-center">
          <span className="text-gray-500 text-xs font-bold">VS</span>
        </div>
        
        {/* Away Team */}
        <div className="flex flex-col items-center">
          <span 
            className="text-sm font-bold tracking-wider mb-2"
            style={{ color: awayTeam.color }}
          >
            {awayTeam.name.toUpperCase()}
          </span>
          <div className="bg-black rounded px-4 py-2 min-w-[60px] text-center">
            <span className="text-4xl font-mono font-bold text-red-500">
              {formatScore(awayScore)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

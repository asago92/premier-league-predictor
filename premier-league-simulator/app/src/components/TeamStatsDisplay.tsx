import type { Team } from '@/types';
import { Target, Shield, TrendingUp, Home, Plane, Calculator } from 'lucide-react';

interface TeamStatsDisplayProps {
  team: Team;
  isHome: boolean;
}

export function TeamStatsDisplay({ team, isHome }: TeamStatsDisplayProps) {
  const stats = team.stats;
  
  if (!stats) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
        No historical data available
      </div>
    );
  }

  const formatDecimal = (val: number) => val.toFixed(3);
  const formatPercent = (val: number) => `${(val * 100).toFixed(1)}%`;

  return (
    <div className="bg-white rounded-xl shadow-md p-4 space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
          style={{ backgroundColor: team.color }}
        >
          {team.shortName}
        </div>
        <div>
          <h4 className="font-bold text-gray-800">{team.name}</h4>
          <span className="text-xs text-gray-500">{isHome ? 'Home' : 'Away'} Team</span>
        </div>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard 
          icon={<Calculator className="w-4 h-4" />}
          label="Goal Probability/min"
          value={formatDecimal(isHome ? team.calculatedProbability.home : team.calculatedProbability.away)}
          color={team.color}
          highlight={true}
        />
        <StatCard 
          icon={<Target className="w-4 h-4" />}
          label="Attack Strength"
          value={formatDecimal(isHome ? stats.homeAttackStrength : stats.awayAttackStrength)}
          color={team.color}
        />
        <StatCard 
          icon={<Shield className="w-4 h-4" />}
          label="Defense Strength"
          value={formatDecimal(isHome ? stats.homeDefenseStrength : stats.awayDefenseStrength)}
          color={team.color}
        />
        <StatCard 
          icon={<TrendingUp className="w-4 h-4" />}
          label="Win Rate"
          value={formatPercent(stats.winRate)}
          color={team.color}
        />
      </div>

      {/* Goals Stats */}
      <div className="pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <Home className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">Home: {stats.avgGoalsFor.toFixed(2)} GF, {stats.avgGoalsAgainst.toFixed(2)} GA</span>
        </div>
        <div className="flex items-center gap-2">
          <Plane className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">Away: {(stats.avgGoalsFor * 0.85).toFixed(2)} GF, {(stats.avgGoalsAgainst * 1.1).toFixed(2)} GA</span>
        </div>
      </div>

      {/* Historical Record */}
      <div className="pt-3 border-t border-gray-100 text-xs text-gray-500">
        <div className="flex justify-between">
          <span>Total Matches: {stats.totalMatches}</span>
          <span>W: {stats.totalWins} D: {stats.totalDraws} L: {stats.totalLosses}</span>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  highlight?: boolean;
}

function StatCard({ icon, label, value, color, highlight }: StatCardProps) {
  return (
    <div className={`rounded-lg p-3 ${highlight ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
      <div className="flex items-center gap-2 mb-1">
        <span style={{ color }}>{icon}</span>
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <div className={`text-lg font-bold ${highlight ? 'text-blue-600' : ''}`} style={highlight ? undefined : { color }}>
        {value}
      </div>
    </div>
  );
}

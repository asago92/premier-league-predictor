export interface Team {
  id: string;
  name: string;
  shortName: string;
  color: string;
  flagColors: string[];
  attackStrength: number;
  defenseStrength: number;
  stats?: TeamStats;
  // Calculated probability of scoring per minute (from historical data)
  calculatedProbability: {
    home: number;
    away: number;
    overall: number;
  };
}

// Base team type without calculated fields (used during construction)
export interface BaseTeam {
  id: string;
  name: string;
  shortName: string;
  color: string;
  flagColors: string[];
}

export interface TeamStats {
  totalMatches: number;
  totalWins: number;
  totalDraws: number;
  totalLosses: number;
  totalGoalsFor: number;
  totalGoalsAgainst: number;
  avgGoalsFor: number;
  avgGoalsAgainst: number;
  homeAttackStrength: number;
  homeDefenseStrength: number;
  awayAttackStrength: number;
  awayDefenseStrength: number;
  winRate: number;
  drawRate: number;
  pointsPerGame: number;
  // Calculated probability of scoring per minute (from historical data)
  calculatedProbability?: {
    home: number;
    away: number;
    overall: number;
  };
}

export interface MatchResult {
  homeGoals: number;
  awayGoals: number;
  winner: 'home' | 'away' | 'draw';
}

export interface SimulationResults {
  homeWinProbability: number;
  awayWinProbability: number;
  drawProbability: number;
  averageHomeGoals: number;
  averageAwayGoals: number;
  totalSimulations: number;
}

export interface TeamPosition {
  angle: number;
  distance: number;
}

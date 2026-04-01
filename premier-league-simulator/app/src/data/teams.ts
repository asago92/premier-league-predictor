import type { Team, TeamStats, BaseTeam } from '@/types';
import { getTeamStats } from '@/lib/dataParser';

// Base team data with colors
const baseTeams: BaseTeam[] = [
  {
    id: 'arsenal',
    name: 'Arsenal',
    shortName: 'ARS',
    color: '#EF0107',
    flagColors: ['#EF0107', '#FFFFFF'],
  },
  {
    id: 'aston-villa',
    name: 'Aston Villa',
    shortName: 'AVL',
    color: '#95BFE5',
    flagColors: ['#95BFE5', '#670E36'],
  },
  {
    id: 'brentford',
    name: 'Brentford',
    shortName: 'BRE',
    color: '#E30613',
    flagColors: ['#E30613', '#FFFFFF'],
  },
  {
    id: 'brighton',
    name: 'Brighton',
    shortName: 'BHA',
    color: '#0057B8',
    flagColors: ['#0057B8', '#FFFFFF'],
  },
  {
    id: 'burnley',
    name: 'Burnley',
    shortName: 'BUR',
    color: '#6C1D45',
    flagColors: ['#6C1D45', '#99D6EA'],
  },
  {
    id: 'chelsea',
    name: 'Chelsea',
    shortName: 'CHE',
    color: '#034694',
    flagColors: ['#034694', '#FFFFFF'],
  },
  {
    id: 'palace',
    name: 'Crystal Palace',
    shortName: 'CRY',
    color: '#1B458F',
    flagColors: ['#1B458F', '#C4122E'],
  },
  {
    id: 'everton',
    name: 'Everton',
    shortName: 'EVE',
    color: '#003399',
    flagColors: ['#003399', '#FFFFFF'],
  },
  {
    id: 'fulham',
    name: 'Fulham',
    shortName: 'FUL',
    color: '#000000',
    flagColors: ['#000000', '#FFFFFF'],
  },
  {
    id: 'liverpool',
    name: 'Liverpool',
    shortName: 'LIV',
    color: '#C8102E',
    flagColors: ['#C8102E', '#FFFFFF'],
  },
  {
    id: 'luton',
    name: 'Luton Town',
    shortName: 'LUT',
    color: '#F78F1E',
    flagColors: ['#F78F1E', '#FFFFFF'],
  },
  {
    id: 'city',
    name: 'Manchester City',
    shortName: 'MCI',
    color: '#6CABDD',
    flagColors: ['#6CABDD', '#FFFFFF'],
  },
  {
    id: 'united',
    name: 'Manchester United',
    shortName: 'MUN',
    color: '#DA291C',
    flagColors: ['#DA291C', '#FBE122'],
  },
  {
    id: 'newcastle',
    name: 'Newcastle United',
    shortName: 'NEW',
    color: '#241F20',
    flagColors: ['#241F20', '#FFFFFF'],
  },
  {
    id: 'forest',
    name: 'Nottingham Forest',
    shortName: 'NFO',
    color: '#DD0000',
    flagColors: ['#DD0000', '#FFFFFF'],
  },
  {
    id: 'sheffield',
    name: 'Sheffield United',
    shortName: 'SHU',
    color: '#EE2737',
    flagColors: ['#EE2737', '#FFFFFF'],
  },
  {
    id: 'spurs',
    name: 'Tottenham',
    shortName: 'TOT',
    color: '#132257',
    flagColors: ['#132257', '#FFFFFF'],
  },
  {
    id: 'west-ham',
    name: 'West Ham',
    shortName: 'WHU',
    color: '#7A263A',
    flagColors: ['#7A263A', '#1BB1E7'],
  },
  {
    id: 'wolves',
    name: 'Wolves',
    shortName: 'WOL',
    color: '#FDB913',
    flagColors: ['#FDB913', '#231F20'],
  },
  {
    id: 'bournemouth',
    name: 'Bournemouth',
    shortName: 'BOU',
    color: '#DA291C',
    flagColors: ['#DA291C', '#000000'],
  },
];

// Default stats when no CSV data is available
const defaultStats: TeamStats = {
  totalMatches: 38,
  totalWins: 15,
  totalDraws: 10,
  totalLosses: 13,
  totalGoalsFor: 55,
  totalGoalsAgainst: 55,
  avgGoalsFor: 1.45,
  avgGoalsAgainst: 1.45,
  homeAttackStrength: 0.045,
  homeDefenseStrength: 0.035,
  awayAttackStrength: 0.035,
  awayDefenseStrength: 0.045,
  winRate: 0.39,
  drawRate: 0.26,
  pointsPerGame: 1.45,
  calculatedProbability: {
    home: 0.018,
    away: 0.014,
    overall: 0.016
  }
};

// Build teams with real stats from CSV
function buildTeamsWithStats(): Team[] {
  return baseTeams.map(baseTeam => {
    // Try to find stats for this team
    const stats = getTeamStats(baseTeam.name);
    
    // Use CSV stats or defaults
    const teamStats = stats || defaultStats;
    
    // Calculate overall attack/defense strength
    const attackStrength = (teamStats.homeAttackStrength + teamStats.awayAttackStrength) / 2;
    const defenseStrength = (teamStats.homeDefenseStrength + teamStats.awayDefenseStrength) / 2;
    
    // Get calculated probability from stats (or use default)
    const calculatedProbability = teamStats.calculatedProbability || defaultStats.calculatedProbability!;
    
    return {
      ...baseTeam,
      attackStrength,
      defenseStrength,
      stats: teamStats,
      calculatedProbability,
    };
  });
}

// Export teams with real stats
export const premierLeagueTeams: Team[] = buildTeamsWithStats();

// Get team by ID
export const getTeamById = (id: string): Team | undefined => {
  return premierLeagueTeams.find(team => team.id === id);
};

// Get team by name
export const getTeamByName = (name: string): Team | undefined => {
  return premierLeagueTeams.find(team => 
    team.name.toLowerCase() === name.toLowerCase() ||
    team.shortName.toLowerCase() === name.toLowerCase()
  );
};

// Get default matchup
export const getDefaultMatchup = (): { home: Team; away: Team } => {
  return {
    home: premierLeagueTeams.find(t => t.id === 'city')!,
    away: premierLeagueTeams.find(t => t.id === 'arsenal')!
  };
};

// Refresh teams data (call this when CSV is updated)
export function refreshTeamsData(): Team[] {
  const refreshed = buildTeamsWithStats();
  // Update the exported array
  (premierLeagueTeams as Team[]).length = 0;
  refreshed.forEach(team => premierLeagueTeams.push(team));
  return refreshed;
}

// Get league statistics summary
export function getLeagueStatsSummary() {
  const teams = premierLeagueTeams;
  
  const avgAttack = teams.reduce((sum, t) => sum + t.attackStrength, 0) / teams.length;
  const avgDefense = teams.reduce((sum, t) => sum + t.defenseStrength, 0) / teams.length;
  const avgGoalsFor = teams.reduce((sum, t) => sum + (t.stats?.avgGoalsFor || 1.45), 0) / teams.length;
  const avgGoalsAgainst = teams.reduce((sum, t) => sum + (t.stats?.avgGoalsAgainst || 1.45), 0) / teams.length;
  
  return {
    avgAttackStrength: avgAttack,
    avgDefenseStrength: avgDefense,
    avgGoalsFor,
    avgGoalsAgainst,
    totalTeams: teams.length,
  };
}

// Export for external use
export { defaultStats };
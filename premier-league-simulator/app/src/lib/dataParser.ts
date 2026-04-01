// Raw CSV data will be imported as a string
import eplData from '@/data/epl_data.csv?raw';
import type { TeamStats } from '@/types';

export interface ParsedTeamData {
  name: string;
  seasons: SeasonData[];
  overallStats: TeamStats;
}

export interface SeasonData {
  season: string;
  rank: number;
  name: string;
  home: {
    mp: number;
    w: number;
    d: number;
    l: number;
    gf: number;
    ga: number;
    gd: number;
    pts: number;
    ptsPerMp: number;
  };
  away: {
    mp: number;
    w: number;
    d: number;
    l: number;
    gf: number;
    ga: number;
    gd: number;
    pts: number;
    ptsPerMp: number;
  };
}

// Parse CSV data
function parseCSV(csvText: string): SeasonData[] {
  const lines = csvText.trim().split('\n');
  // Skip header line
  
  const data: SeasonData[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length < 21) continue;
    
    const season: SeasonData = {
      season: values[0],
      rank: parseInt(values[1]),
      name: values[2],
      home: {
        mp: parseInt(values[3]) || 0,
        w: parseInt(values[4]) || 0,
        d: parseInt(values[5]) || 0,
        l: parseInt(values[6]) || 0,
        gf: parseInt(values[7]) || 0,
        ga: parseInt(values[8]) || 0,
        gd: parseInt(values[9]) || 0,
        pts: parseInt(values[10]) || 0,
        ptsPerMp: parseFloat(values[11]) || 0,
      },
      away: {
        mp: parseInt(values[12]) || 0,
        w: parseInt(values[13]) || 0,
        d: parseInt(values[14]) || 0,
        l: parseInt(values[15]) || 0,
        gf: parseInt(values[16]) || 0,
        ga: parseInt(values[17]) || 0,
        gd: parseInt(values[18]) || 0,
        pts: parseInt(values[19]) || 0,
        ptsPerMp: parseFloat(values[20]) || 0,
      }
    };
    
    data.push(season);
  }
  
  return data;
}

// Group data by team
function groupByTeam(data: SeasonData[]): Map<string, ParsedTeamData> {
  const teams = new Map<string, ParsedTeamData>();
  
  for (const season of data) {
    const teamName = normalizeTeamName(season.name);
    
    if (!teams.has(teamName)) {
      teams.set(teamName, {
        name: teamName,
        seasons: [],
        overallStats: calculateEmptyStats()
      });
    }
    
    const team = teams.get(teamName)!;
    team.seasons.push(season);
  }
  
  // Calculate overall stats for each team
  for (const team of teams.values()) {
    team.overallStats = calculateOverallStats(team.seasons);
  }
  
  return teams;
}

// Normalize team names to match our app
function normalizeTeamName(name: string): string {
  const nameMap: Record<string, string> = {
    'Manchester City': 'Manchester City',
    'Manchester Utd': 'Manchester United',
    'Tottenham Hotspur': 'Tottenham',
    'Newcastle United': 'Newcastle United',
    'West Ham United': 'West Ham',
    'Nottingham Forest': 'Nottingham Forest',
    'Aston Villa': 'Aston Villa',
    'Crystal Palace': 'Crystal Palace',
    'Brighton': 'Brighton',
    'Brentford': 'Brentford',
    'Fulham': 'Fulham',
    'Everton': 'Everton',
    'Wolves': 'Wolves',
    'Bournemouth': 'Bournemouth',
    'Sheffield United': 'Sheffield United',
    'Burnley': 'Burnley',
    'Luton Town': 'Luton Town',
    'Leicester City': 'Leicester City',
    'Ipswich Town': 'Ipswich Town',
    'Southampton': 'Southampton',
    'Leeds United': 'Leeds United',
    'Sunderland': 'Sunderland',
    'Stoke City': 'Stoke City',
    'Swansea City': 'Swansea',
    'Cardiff City': 'Cardiff',
    'Huddersfield Town': 'Huddersfield',
    'West Bromwich Albion': 'West Brom',
    'Watford': 'Watford',
    'Norwich City': 'Norwich',
    'Hull City': 'Hull',
    'Middlesbrough': 'Middlesbrough',
    'Queens Park Rangers': 'QPR',
    'Arsenal': 'Arsenal',
    'Liverpool': 'Liverpool',
    'Chelsea': 'Chelsea'
  };
  
  return nameMap[name] || name;
}

function calculateEmptyStats(): TeamStats {
  return {
    totalMatches: 0,
    totalWins: 0,
    totalDraws: 0,
    totalLosses: 0,
    totalGoalsFor: 0,
    totalGoalsAgainst: 0,
    avgGoalsFor: 0,
    avgGoalsAgainst: 0,
    homeAttackStrength: 0,
    homeDefenseStrength: 0,
    awayAttackStrength: 0,
    awayDefenseStrength: 0,
    winRate: 0,
    drawRate: 0,
    pointsPerGame: 0
  };
}

// Calculate overall statistics from season data
function calculateOverallStats(seasons: SeasonData[]): TeamStats {
  let totalMatches = 0;
  let totalWins = 0;
  let totalDraws = 0;
  let totalLosses = 0;
  let totalGoalsFor = 0;
  let totalGoalsAgainst = 0;
  let totalPoints = 0;
  
  let homeMatches = 0;
  let homeGoalsFor = 0;
  let homeGoalsAgainst = 0;
  let awayMatches = 0;
  let awayGoalsFor = 0;
  let awayGoalsAgainst = 0;
  
  for (const season of seasons) {
    // Home stats
    homeMatches += season.home.mp;
    homeGoalsFor += season.home.gf;
    homeGoalsAgainst += season.home.ga;
    
    // Away stats
    awayMatches += season.away.mp;
    awayGoalsFor += season.away.gf;
    awayGoalsAgainst += season.away.ga;
    
    // Overall
    totalMatches += season.home.mp + season.away.mp;
    totalWins += season.home.w + season.away.w;
    totalDraws += season.home.d + season.away.d;
    totalLosses += season.home.l + season.away.l;
    totalGoalsFor += season.home.gf + season.away.gf;
    totalGoalsAgainst += season.home.ga + season.away.ga;
    totalPoints += season.home.pts + season.away.pts;
  }
  
  // Calculate averages
  const avgGoalsFor = totalMatches > 0 ? totalGoalsFor / totalMatches : 0;
  const avgGoalsAgainst = totalMatches > 0 ? totalGoalsAgainst / totalMatches : 0;
  
  // Calculate attack/defense strengths (goals per match normalized)
  const homeAttackStrength = homeMatches > 0 ? homeGoalsFor / homeMatches / 90 : 0.03;
  const homeDefenseStrength = homeMatches > 0 ? homeGoalsAgainst / homeMatches / 90 : 0.03;
  const awayAttackStrength = awayMatches > 0 ? awayGoalsFor / awayMatches / 90 : 0.025;
  const awayDefenseStrength = awayMatches > 0 ? awayGoalsAgainst / awayMatches / 90 : 0.035;
  
  // Calculate probability of scoring per minute (key metric from PDF)
  // Probability = Expected Goals / 90 minutes
  const homeProbabilityPerMinute = homeMatches > 0 ? (homeGoalsFor / homeMatches) / 90 : 0.015;
  const awayProbabilityPerMinute = awayMatches > 0 ? (awayGoalsFor / awayMatches) / 90 : 0.012;
  const overallProbabilityPerMinute = totalMatches > 0 ? (totalGoalsFor / totalMatches) / 90 : 0.014;
  
  return {
    totalMatches,
    totalWins,
    totalDraws,
    totalLosses,
    totalGoalsFor,
    totalGoalsAgainst,
    avgGoalsFor,
    avgGoalsAgainst,
    homeAttackStrength,
    homeDefenseStrength,
    awayAttackStrength,
    awayDefenseStrength,
    winRate: totalMatches > 0 ? totalWins / totalMatches : 0,
    drawRate: totalMatches > 0 ? totalDraws / totalMatches : 0,
    pointsPerGame: totalMatches > 0 ? totalPoints / totalMatches : 0,
    // Add calculated probabilities
    calculatedProbability: {
      home: Math.min(homeProbabilityPerMinute, 0.1),
      away: Math.min(awayProbabilityPerMinute, 0.1),
      overall: Math.min(overallProbabilityPerMinute, 0.1)
    }
  };
}

// Get all parsed team data
export function getAllTeamData(): Map<string, ParsedTeamData> {
  const parsed = parseCSV(eplData);
  return groupByTeam(parsed);
}

// Get stats for a specific team
export function getTeamStats(teamName: string): TeamStats | null {
  const allData = getAllTeamData();
  const normalizedName = normalizeTeamName(teamName);
  const team = allData.get(normalizedName);
  return team?.overallStats || null;
}

// Get available seasons
export function getAvailableSeasons(): string[] {
  const parsed = parseCSV(eplData);
  const seasons = new Set<string>();
  
  for (const season of parsed) {
    seasons.add(season.season);
  }
  
  return Array.from(seasons).sort().reverse();
}

// Get data for a specific season
export function getSeasonData(season: string): SeasonData[] {
  const parsed = parseCSV(eplData);
  return parsed.filter(s => s.season === season);
}

// Calculate league averages for normalization
export function getLeagueAverages(): { attack: number; defense: number } {
  const allData = getAllTeamData();
  let totalAttack = 0;
  let totalDefense = 0;
  let count = 0;
  
  for (const team of allData.values()) {
    totalAttack += team.overallStats.homeAttackStrength + team.overallStats.awayAttackStrength;
    totalDefense += team.overallStats.homeDefenseStrength + team.overallStats.awayDefenseStrength;
    count += 2;
  }
  
  return {
    attack: count > 0 ? totalAttack / count : 0.035,
    defense: count > 0 ? totalDefense / count : 0.035
  };
}

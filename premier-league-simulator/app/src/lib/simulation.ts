import type { Team, MatchResult, SimulationResults } from '@/types';
import { getLeagueStatsSummary } from '@/data/teams';

/**
 * Monte Carlo Simulation for Soccer Match Prediction
 * Uses real historical data from CSV for accurate predictions
 */

// Poisson distribution for goal scoring
function poissonRandom(lambda: number): number {
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  
  return k - 1;
}

// Calculate expected goals based on real team stats
// Uses the calculated probability of scoring per minute (from historical data)
function calculateExpectedGoals(
  attackTeam: Team,
  defenseTeam: Team,
  probabilityPerMinute: number,
  isHomeTeam: boolean
): number {
  const leagueStats = getLeagueStatsSummary();
  
  // Get team-specific attack strength
  const teamAttack = isHomeTeam 
    ? attackTeam.stats?.homeAttackStrength || attackTeam.attackStrength
    : attackTeam.stats?.awayAttackStrength || attackTeam.attackStrength;
  
  // Get opponent's defense strength
  const opponentDefense = isHomeTeam
    ? defenseTeam.stats?.awayDefenseStrength || defenseTeam.defenseStrength
    : defenseTeam.stats?.homeDefenseStrength || defenseTeam.defenseStrength;
  
  // The probabilityPerMinute is the calculated base rate from historical data
  // This represents: (Average Goals per Match) / 90 minutes
  // e.g., if team scores 1.5 goals per match, probability = 1.5/90 = 0.0167 per minute
  
  // Expected goals over 90 minutes based on the probability
  const baseExpectedGoals = probabilityPerMinute * 90;
  
  // Calculate attack vs defense ratio for adjustment
  const attackRatio = teamAttack / leagueStats.avgAttackStrength;
  const defenseRatio = opponentDefense / leagueStats.avgDefenseStrength;
  
  // Home advantage factor
  const homeAdvantage = isHomeTeam ? 1.15 : 0.92;
  
  // Final expected goals calculation
  // The probabilityPerMinute already includes the team's historical scoring rate
  // We adjust it based on opponent defense and home/away advantage
  const expectedGoals = baseExpectedGoals * attackRatio * defenseRatio * homeAdvantage;
  
  return Math.max(0.1, Math.min(expectedGoals, 5.0)); // Clamp between 0.1 and 5.0
}

// Run a single match simulation
export function simulateMatch(
  homeTeam: Team,
  awayTeam: Team,
  homeProbability: number,
  awayProbability: number
): MatchResult {
  const homeExpectedGoals = calculateExpectedGoals(homeTeam, awayTeam, homeProbability, true);
  const awayExpectedGoals = calculateExpectedGoals(awayTeam, homeTeam, awayProbability, false);
  
  const homeGoals = poissonRandom(homeExpectedGoals);
  const awayGoals = poissonRandom(awayExpectedGoals);
  
  let winner: 'home' | 'away' | 'draw';
  if (homeGoals > awayGoals) {
    winner = 'home';
  } else if (awayGoals > homeGoals) {
    winner = 'away';
  } else {
    winner = 'draw';
  }
  
  return {
    homeGoals,
    awayGoals,
    winner
  };
}

// Run Monte Carlo simulation multiple times
export function runMonteCarloSimulation(
  homeTeam: Team,
  awayTeam: Team,
  homeProbability: number,
  awayProbability: number,
  iterations: number = 10000
): SimulationResults {
  let homeWins = 0;
  let awayWins = 0;
  let draws = 0;
  let totalHomeGoals = 0;
  let totalAwayGoals = 0;
  
  for (let i = 0; i < iterations; i++) {
    const result = simulateMatch(homeTeam, awayTeam, homeProbability, awayProbability);
    
    if (result.winner === 'home') {
      homeWins++;
    } else if (result.winner === 'away') {
      awayWins++;
    } else {
      draws++;
    }
    
    totalHomeGoals += result.homeGoals;
    totalAwayGoals += result.awayGoals;
  }
  
  return {
    homeWinProbability: homeWins / iterations,
    awayWinProbability: awayWins / iterations,
    drawProbability: draws / iterations,
    averageHomeGoals: totalHomeGoals / iterations,
    averageAwayGoals: totalAwayGoals / iterations,
    totalSimulations: iterations
  };
}

// Quick simulation for animation (fewer iterations)
export function runQuickSimulation(
  homeTeam: Team,
  awayTeam: Team,
  homeProbability: number,
  awayProbability: number
): SimulationResults {
  return runMonteCarloSimulation(homeTeam, awayTeam, homeProbability, awayProbability, 1000);
}

// Get head-to-head prediction with confidence intervals
export function getPredictionWithConfidence(
  homeTeam: Team,
  awayTeam: Team,
  homeProbability: number,
  awayProbability: number
): {
  mostLikelyScore: string;
  confidence: number;
  overUnder: { over2_5: number; under2_5: number };
  bothTeamsToScore: number;
} {
  const results = runMonteCarloSimulation(homeTeam, awayTeam, homeProbability, awayProbability, 5000);
  
  // Calculate over/under 2.5 goals probability
  let over25 = 0;
  let btts = 0;
  
  for (let i = 0; i < 1000; i++) {
    const match = simulateMatch(homeTeam, awayTeam, homeProbability, awayProbability);
    const totalGoals = match.homeGoals + match.awayGoals;
    
    if (totalGoals > 2.5) over25++;
    if (match.homeGoals > 0 && match.awayGoals > 0) btts++;
  }
  
  // Determine most likely score
  const homeGoals = Math.round(results.averageHomeGoals);
  const awayGoals = Math.round(results.averageAwayGoals);
  
  // Calculate confidence based on win probability spread
  const maxProb = Math.max(results.homeWinProbability, results.awayWinProbability, results.drawProbability);
  const confidence = maxProb;
  
  return {
    mostLikelyScore: `${homeGoals}-${awayGoals}`,
    confidence,
    overUnder: {
      over2_5: over25 / 1000,
      under2_5: 1 - (over25 / 1000),
    },
    bothTeamsToScore: btts / 1000,
  };
}

import { useState, useCallback, useEffect } from 'react';
import { SoccerField } from '@/components/SoccerField';
import { Scoreboard } from '@/components/Scoreboard';
import { ProbabilitySlider } from '@/components/ProbabilitySlider';
import { TeamSelector } from '@/components/TeamSelector';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { TeamStatsDisplay } from '@/components/TeamStatsDisplay';
import { Button } from '@/components/ui/button';
import { Shuffle, Play, RotateCcw, BarChart3, Database } from 'lucide-react';
import type { Team, SimulationResults, MatchResult } from '@/types';
import { premierLeagueTeams, getDefaultMatchup, getLeagueStatsSummary } from '@/data/teams';
import { runMonteCarloSimulation, simulateMatch } from '@/lib/simulation';
import { getAvailableSeasons } from '@/lib/dataParser';
import './App.css';

function App() {
  const { home: defaultHome, away: defaultAway } = getDefaultMatchup();
  
  const [homeTeam, setHomeTeam] = useState<Team>(defaultHome);
  const [awayTeam, setAwayTeam] = useState<Team>(defaultAway);
  // Use calculated probability from historical data as default
  const [homeProbability, setHomeProbability] = useState(defaultHome.calculatedProbability.home);
  const [awayProbability, setAwayProbability] = useState(defaultAway.calculatedProbability.away);
  const [results, setResults] = useState<SimulationResults | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentMatch, setCurrentMatch] = useState<MatchResult | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [availableSeasons] = useState(() => getAvailableSeasons());
  const [leagueStats] = useState(() => getLeagueStatsSummary());

  // Run a quick preview match on load
  useEffect(() => {
    const preview = simulateMatch(homeTeam, awayTeam, homeProbability, awayProbability);
    setCurrentMatch(preview);
  }, []);

  const handleSwapTeams = useCallback(() => {
    setHomeTeam(awayTeam);
    setAwayTeam(homeTeam);
    setResults(null);
  }, [homeTeam, awayTeam]);

  const handleRandomize = useCallback(() => {
    const randomHome = premierLeagueTeams[Math.floor(Math.random() * premierLeagueTeams.length)];
    let randomAway = premierLeagueTeams[Math.floor(Math.random() * premierLeagueTeams.length)];
    while (randomAway.id === randomHome.id) {
      randomAway = premierLeagueTeams[Math.floor(Math.random() * premierLeagueTeams.length)];
    }
    setHomeTeam(randomHome);
    setAwayTeam(randomAway);
    // Use calculated probabilities from the selected teams
    setHomeProbability(randomHome.calculatedProbability.home);
    setAwayProbability(randomAway.calculatedProbability.away);
    setResults(null);
  }, []);

  const handleRunSimulation = useCallback(async () => {
    setIsSimulating(true);
    setIsAnimating(true);
    
    // Small delay for visual feedback
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const simulationResults = runMonteCarloSimulation(
      homeTeam,
      awayTeam,
      homeProbability,
      awayProbability,
      10000
    );
    
    // Generate a sample match for display
    const sampleMatch = simulateMatch(homeTeam, awayTeam, homeProbability, awayProbability);
    setCurrentMatch(sampleMatch);
    
    setResults(simulationResults);
    setIsSimulating(false);
    setIsAnimating(false);
  }, [homeTeam, awayTeam, homeProbability, awayProbability]);

  const handleReset = useCallback(() => {
    setResults(null);
    setCurrentMatch(null);
    setHomeProbability(0.041);
    setAwayProbability(0.015);
  }, []);
  
  // Use handleReset in a reset button or remove if not needed
  useEffect(() => {
    // Reset when teams change significantly
  }, [handleReset]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Premier League Predictor
          </h1>
          <p className="text-gray-600">
            Monte Carlo Simulation for Match Outcome Prediction
          </p>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column - Visualization */}
          <div className="space-y-6">
            {/* Soccer Field Visualization */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <SoccerField 
                homeTeam={homeTeam}
                awayTeam={awayTeam}
                homeScore={currentMatch?.homeGoals || 0}
                awayScore={currentMatch?.awayGoals || 0}
                isAnimating={isAnimating}
              />
            </div>
            
            {/* Scoreboard */}
            <div className="flex justify-center">
              <Scoreboard 
                homeTeam={homeTeam}
                awayTeam={awayTeam}
                homeScore={currentMatch?.homeGoals || 0}
                awayScore={currentMatch?.awayGoals || 0}
              />
            </div>
            
            {/* Control Buttons */}
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={handleSwapTeams}
                className="w-12 h-12 rounded-xl border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                title="Swap Teams"
              >
                <Shuffle className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleRandomize}
                className="w-12 h-12 rounded-xl border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                title="Randomize"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          {/* Right Column - Controls */}
          <div className="space-y-6">
            {/* Team Selectors */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Select Teams</h3>
              <div className="space-y-4">
                <TeamSelector
                  selectedTeam={homeTeam}
                  onSelect={(team) => {
                    setHomeTeam(team);
                    // Auto-update probability to team's calculated home probability
                    setHomeProbability(team.calculatedProbability.home);
                    setResults(null);
                  }}
                  label="Home Team"
                />
                <TeamSelector
                  selectedTeam={awayTeam}
                  onSelect={(team) => {
                    setAwayTeam(team);
                    // Auto-update probability to team's calculated away probability
                    setAwayProbability(team.calculatedProbability.away);
                    setResults(null);
                  }}
                  label="Away Team"
                />
              </div>
            </div>
            
            {/* Probability Sliders */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Goal Probability</h3>
              <p className="text-sm text-gray-500 mb-4">
                Adjust the probability of scoring per minute
              </p>
              
              <ProbabilitySlider
                team={homeTeam}
                value={homeProbability}
                onChange={(value) => {
                  setHomeProbability(value);
                  setResults(null);
                }}
                label={homeTeam.name.toUpperCase()}
                isHome={true}
              />
              
              <ProbabilitySlider
                team={awayTeam}
                value={awayProbability}
                onChange={(value) => {
                  setAwayProbability(value);
                  setResults(null);
                }}
                label={awayTeam.name.toUpperCase()}
                isHome={false}
              />
            </div>
            
            {/* Run Simulation Button */}
            <Button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="w-full py-6 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              style={{ 
                backgroundColor: isSimulating ? '#9CA3AF' : '#10B981',
              }}
            >
              {isSimulating ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Simulating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Run Simulation
                </span>
              )}
            </Button>
            
            {/* Results Display */}
            <ResultsDisplay
              results={results}
              homeTeam={homeTeam}
              awayTeam={awayTeam}
              isLoading={isSimulating}
            />
          </div>
        </div>
        
        {/* Stats Section */}
        {showStats && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 fade-in">
            <TeamStatsDisplay team={homeTeam} isHome={true} />
            <TeamStatsDisplay team={awayTeam} isHome={false} />
          </div>
        )}

        {/* Data Info */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-gray-800">Data Source</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Seasons</span>
              <p className="font-semibold">{availableSeasons.length} seasons</p>
              <p className="text-xs text-gray-400">{availableSeasons[0]} to {availableSeasons[availableSeasons.length - 1]}</p>
            </div>
            <div>
              <span className="text-gray-500">Teams</span>
              <p className="font-semibold">{leagueStats.totalTeams} teams</p>
            </div>
            <div>
              <span className="text-gray-500">Avg Goals/Match</span>
              <p className="font-semibold">{leagueStats.avgGoalsFor.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-gray-500">Data File</span>
              <p className="font-semibold text-blue-500">epl_data.csv</p>
              <p className="text-xs text-gray-400">Edit to update predictions</p>
            </div>
          </div>
        </div>

        {/* Toggle Stats Button */}
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={() => setShowStats(!showStats)}
            className="gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            {showStats ? 'Hide Team Stats' : 'Show Team Stats'}
          </Button>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>
            Using Monte Carlo simulation with Poisson distribution for goal scoring prediction.
          </p>
          <p className="mt-1">
            Based on real historical data from {availableSeasons.length} Premier League seasons.
          </p>
          <p className="mt-2 text-xs">
            To update data: edit <code className="bg-gray-100 px-1 rounded">src/data/epl_data.csv</code> and redeploy.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;

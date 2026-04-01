import { useEffect, useState } from 'react';
import type { Team } from '@/types';

interface SoccerFieldProps {
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  isAnimating: boolean;
}

interface BallPosition {
  x: number;
  y: number;
  team: 'home' | 'away' | null;
}

export function SoccerField({ homeTeam, awayTeam, homeScore, awayScore, isAnimating }: SoccerFieldProps) {
  const [ballPositions, setBallPositions] = useState<BallPosition[]>([]);
  const [animationStep, setAnimationStep] = useState(0);

  // Generate random ball positions around the field
  useEffect(() => {
    const positions: BallPosition[] = [];
    const totalBalls = homeScore + awayScore;
    
    for (let i = 0; i < totalBalls; i++) {
      const angle = (Math.PI * 2 * i) / Math.max(totalBalls, 1);
      const radius = 35 + Math.random() * 15;
      positions.push({
        x: 50 + radius * Math.cos(angle),
        y: 50 + radius * Math.sin(angle),
        team: i < homeScore ? 'home' : 'away'
      });
    }
    
    setBallPositions(positions);
  }, [homeScore, awayScore]);

  // Animation effect
  useEffect(() => {
    if (!isAnimating) return;
    
    const interval = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 360);
    }, 50);
    
    return () => clearInterval(interval);
  }, [isAnimating]);

  const getBallStyle = (pos: BallPosition, index: number) => {
    const animatedAngle = animationStep + (index * 30);
    const radius = 35;
    const x = 50 + radius * Math.cos((animatedAngle * Math.PI) / 180);
    const y = 50 + radius * Math.sin((animatedAngle * Math.PI) / 180);
    
    return {
      left: `${isAnimating ? x : pos.x}%`,
      top: `${isAnimating ? y : pos.y}%`,
      backgroundColor: pos.team === 'home' ? homeTeam.color : awayTeam.color,
      transform: 'translate(-50%, -50%)'
    };
  };

  return (
    <div className="relative w-80 h-80 mx-auto">
      {/* Outer circle - field border */}
      <div className="absolute inset-0 rounded-full border-2 border-dashed border-gray-400" />
      
      {/* Inner circle - center circle */}
      <div className="absolute top-1/2 left-1/2 w-20 h-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gray-300" />
      
      {/* Center dot */}
      <div className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-400" />
      
      {/* Timer in center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <span className="text-4xl font-mono font-bold text-red-500 tracking-wider">
          90:00
        </span>
      </div>
      
      {/* Team flags/badges around the circle */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
        const x = 50 + 45 * Math.cos(angle);
        const y = 50 + 45 * Math.sin(angle);
        const isHome = i % 2 === 0;
        const team = isHome ? homeTeam : awayTeam;
        
        return (
          <div
            key={i}
            className="absolute w-8 h-8 rounded-full border-2 border-white shadow-md flex items-center justify-center text-xs font-bold"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%)',
              backgroundColor: team.color,
              color: isHome ? '#fff' : '#fff'
            }}
          >
            {team.shortName.charAt(0)}
          </div>
        );
      })}
      
      {/* Ball positions (goals) */}
      {ballPositions.map((pos, index) => (
        <div
          key={index}
          className="absolute w-6 h-6 rounded-full border-2 border-white shadow-lg transition-all duration-500 ease-out"
          style={getBallStyle(pos, index)}
        >
          {/* Mini flag inside ball */}
          <div 
            className="w-full h-full rounded-full flex items-center justify-center text-[8px] font-bold text-white"
            style={{ backgroundColor: pos.team === 'home' ? homeTeam.color : awayTeam.color }}
          >
            {pos.team === 'home' ? homeTeam.shortName.charAt(0) : awayTeam.shortName.charAt(0)}
          </div>
        </div>
      ))}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { ArithmeticSpeedRun } from './ArithmeticSpeedRun';
import { MemoryMatrix } from './MemoryMatrix';
import { AnagramSolver } from './AnagramSolver';
import { PatternMaster } from './PatternMaster';
import { Volume2 } from 'lucide-react';

interface GameStats {
  level: number;
  totalScore: number;
  highScore: number;
  gamesCompleted: number;
}

export const BrainGymContainer: React.FC = () => {
  const [activeGame, setActiveGame] = useState<'menu' | 'arithmetic' | 'memory' | 'anagram' | 'pattern'>('menu');
  const [gameStats, setGameStats] = useState<GameStats>({
    level: 1,
    totalScore: 0,
    highScore: 0,
    gamesCompleted: 0,
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('brainGymHighScore');
    const savedLevel = localStorage.getItem('brainGymLevel');
    
    if (savedHighScore) {
      setGameStats((prev) => ({
        ...prev,
        highScore: parseInt(savedHighScore),
      }));
    }
    
    if (savedLevel) {
      setGameStats((prev) => ({
        ...prev,
        level: parseInt(savedLevel),
      }));
    }
  }, []);

  // Save high score and level to localStorage
  useEffect(() => {
    localStorage.setItem('brainGymHighScore', gameStats.highScore.toString());
    localStorage.setItem('brainGymLevel', gameStats.level.toString());
  }, [gameStats.highScore, gameStats.level]);

  const handleLevelUp = () => {
    setGameStats((prev) => ({
      ...prev,
      level: prev.level + 1,
    }));
    triggerConfetti();
  };

  const handleScoreChange = (score: number) => {
    setGameStats((prev) => {
      const newTotal = prev.totalScore + score;
      return {
        ...prev,
        totalScore: newTotal,
        highScore: Math.max(newTotal, prev.highScore),
      };
    });
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const GAMES = [
    {
      id: 'arithmetic',
      name: '⚡ Arithmetic Speed Run',
      description: 'Solve math problems under time pressure',
      color: 'from-cyan-500 to-blue-600',
      icon: '🧮',
    },
    {
      id: 'memory',
      name: '🧠 Memory Matrix',
      description: 'Find matching pairs in a grid',
      color: 'from-purple-500 to-pink-600',
      icon: '🎮',
    },
    {
      id: 'anagram',
      name: '🔤 Anagram Solver',
      description: 'Unscramble words with hints',
      color: 'from-yellow-500 to-orange-600',
      icon: '📝',
    },
    {
      id: 'pattern',
      name: '🎨 Pattern Master',
      description: 'Repeat color sequences',
      color: 'from-pink-500 to-rose-600',
      icon: '🎵',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {showConfetti && <Confetti />}

      {/* Background Effect */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            🧠 SHERY Brain Gym
          </h1>
          <p className="text-xl text-slate-400">Level Up Your Mind with Interactive Games</p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-cyan-500/30 rounded-xl p-4">
            <p className="text-sm text-slate-400">Level</p>
            <p className="text-3xl font-bold text-cyan-400">{gameStats.level}</p>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-purple-500/30 rounded-xl p-4">
            <p className="text-sm text-slate-400">Score</p>
            <p className="text-3xl font-bold text-purple-400">{gameStats.totalScore}</p>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-yellow-500/30 rounded-xl p-4">
            <p className="text-sm text-slate-400">High Score</p>
            <p className="text-3xl font-bold text-yellow-400">{gameStats.highScore}</p>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-pink-500/30 rounded-xl p-4">
            <p className="text-sm text-slate-400">Games</p>
            <p className="text-3xl font-bold text-pink-400">{gameStats.gamesCompleted}</p>
          </div>
        </motion.div>

        {/* Game Menu / Active Game */}
        <AnimatePresence mode="wait">
          {activeGame === 'menu' ? (
            <motion.div
              key="menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {GAMES.map((game, idx) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setActiveGame(game.id as any)}
                  className={`group cursor-pointer bg-gradient-to-br ${game.color} rounded-2xl p-8 border-2 border-white/10 hover:border-white/30 transition-all hover:shadow-2xl hover:shadow-current/50`}
                >
                  <div className="text-6xl mb-4">{game.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{game.name}</h3>
                  <p className="text-white/80 mb-4">{game.description}</p>
                  <motion.button
                    whileHover={{ x: 5 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg font-bold hover:bg-white/30 transition-all"
                  >
                    Play Now →
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={activeGame}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Back Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveGame('menu')}
                className="mb-6 px-4 py-2 bg-slate-800 border-2 border-slate-600 rounded-lg font-bold hover:border-cyan-400 hover:text-cyan-400 transition-all"
              >
                ← Back to Menu
              </motion.button>

              {/* Game Component */}
              {activeGame === 'arithmetic' && (
                <ArithmeticSpeedRun
                  level={gameStats.level}
                  onLevelUp={handleLevelUp}
                  onScoreChange={handleScoreChange}
                />
              )}
              {activeGame === 'memory' && (
                <MemoryMatrix
                  level={gameStats.level}
                  onLevelUp={handleLevelUp}
                  onScoreChange={handleScoreChange}
                />
              )}
              {activeGame === 'anagram' && (
                <AnagramSolver
                  level={gameStats.level}
                  onLevelUp={handleLevelUp}
                  onScoreChange={handleScoreChange}
                />
              )}
              {activeGame === 'pattern' && (
                <PatternMaster
                  level={gameStats.level}
                  onLevelUp={handleLevelUp}
                  onScoreChange={handleScoreChange}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sound Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-slate-800 to-slate-900 border-2 border-slate-600 rounded-full hover:border-cyan-400 transition-all"
        >
          <Volume2 className={`w-6 h-6 ${soundEnabled ? 'text-cyan-400' : 'text-slate-600'}`} />
        </motion.button>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 text-center py-8 text-slate-500 border-t border-slate-800"
      >
        <p>Made with 💜 by SHERY | Level Up Your Brain Power</p>
      </motion.div>
    </div>
  );
};

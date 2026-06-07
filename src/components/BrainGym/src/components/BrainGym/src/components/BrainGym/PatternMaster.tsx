import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

interface PatternMasterProps {
  level: number;
  onLevelUp: () => void;
  onScoreChange: (score: number) => void;
}

const COLORS = [
  { id: 0, name: 'Red', color: 'from-red-500 to-red-600', sound: '🔴' },
  { id: 1, name: 'Green', color: 'from-green-500 to-green-600', sound: '🟢' },
  { id: 2, name: 'Blue', color: 'from-blue-500 to-blue-600', sound: '🔵' },
  { id: 3, name: 'Yellow', color: 'from-yellow-500 to-yellow-600', sound: '🟡' },
];

export const PatternMaster: React.FC<PatternMasterProps> = ({
  level,
  onLevelUp,
  onScoreChange,
}) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeColor, setActiveColor] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [gameOver, setGameOver] = useState(false);

  const playSequence = async (seq: number[]) => {
    setIsPlaying(true);
    for (let i = 0; i < seq.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setActiveColor(seq[i]);
      await new Promise((resolve) => setTimeout(resolve, 400));
      setActiveColor(null);
    }
    setIsPlaying(false);
  };

  const startGame = async () => {
    setGameStarted(true);
    setSequence([]);
    setPlayerSequence([]);
    setScore(0);
    setGameOver(false);
    setFeedback(null);

    const newSequence = [Math.floor(Math.random() * 4)];
    setSequence(newSequence);
    await playSequence(newSequence);
  };

  const handleColorClick = async (colorId: number) => {
    if (isPlaying || !gameStarted) return;

    const newPlayerSequence = [...playerSequence, colorId];
    setPlayerSequence(newPlayerSequence);
    setActiveColor(colorId);

    await new Promise((resolve) => setTimeout(resolve, 300));
    setActiveColor(null);

    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      setFeedback('wrong');
      setGameOver(true);
      return;
    }

    if (newPlayerSequence.length === sequence.length) {
      setFeedback('correct');
      const newScore = score + 100 * level;
      setScore(newScore);
      onScoreChange(newScore);

      if (sequence.length % 3 === 0 && sequence.length > 0) {
        onLevelUp();
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setFeedback(null);

      const newSequence = [...sequence, Math.floor(Math.random() * 4)];
      setSequence(newSequence);
      setPlayerSequence([]);
      await playSequence(newSequence);
    }
  };

  const progressPercentage = (sequence.length / (10 + level * 2)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="p-8 rounded-2xl backdrop-blur-md border-2 border-slate-700 bg-slate-900/50"
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-pink-400">🎨 Pattern Master</h2>
          <div className="text-right">
            <p className="text-sm text-slate-400">Level {level}</p>
            <p className="text-2xl font-bold text-pink-400">{score}</p>
          </div>
        </div>

        {/* Stats */}
        {gameStarted && !gameOver && (
          <div className="bg-slate-800/50 border-2 border-slate-600 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm text-slate-400">
                Sequence Length: <span className="text-pink-400 font-bold">{sequence.length}</span>
              </p>
              <p className="text-sm text-slate-400">
                Your Progress: <span className="text-pink-400 font-bold">{playerSequence.length}</span>
              </p>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-pink-400 to-rose-500"
                animate={{
                  width: `${(playerSequence.length / sequence.length) * 100}%`,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {/* Game Start */}
        {!gameStarted ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl font-bold text-lg text-white hover:shadow-lg hover:shadow-pink-500/50 mb-6"
          >
            🎮 Start Pattern Game
          </motion.button>
        ) : gameOver ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4"
          >
            <p className="text-4xl font-bold text-pink-400">❌ Game Over!</p>
            <p className="text-2xl text-slate-300">Final Score: {score}</p>
            <p className="text-lg text-slate-400">Sequence Length: {sequence.length}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl font-bold text-lg text-white"
            >
              <RotateCcw className="inline mr-2 w-5 h-5" />
              Try Again
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Instructions */}
            <div className="text-center">
              {isPlaying ? (
                <p className="text-xl text-slate-300 font-bold">👀 Watch the sequence...</p>
              ) : playerSequence.length === 0 ? (
                <p className="text-xl text-slate-300 font-bold">🎯 Ready? Repeat the pattern!</p>
              ) : (
                <p className="text-xl text-slate-300 font-bold">🎵 Continue the pattern...</p>
              )}
            </div>

            {/* Color Grid */}
            <div className="grid grid-cols-2 gap-6">
              {COLORS.map((colorItem) => (
                <motion.button
                  key={colorItem.id}
                  onClick={() => handleColorClick(colorItem.id)}
                  disabled={isPlaying || !gameStarted}
                  whileHover={!isPlaying ? { scale: 1.05 } : {}}
                  whileTap={!isPlaying ? { scale: 0.95 } : {}}
                  className={`aspect-square rounded-2xl font-bold text-lg transition-all ${
                    activeColor === colorItem.id
                      ? `bg-gradient-to-br ${colorItem.color} shadow-2xl scale-95`
                      : `bg-gradient-to-br ${colorItem.color} opacity-70 hover:opacity-90 shadow-lg`
                  } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {colorItem.sound}
                  <div className="text-sm mt-2">{colorItem.name}</div>
                </motion.button>
              ))}
            </div>

            {/* Feedback */}
            {feedback && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`text-center text-xl font-bold py-3 rounded-lg ${
                  feedback === 'correct'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {feedback === 'correct' ? '✅ Correct! Next sequence coming...' : '❌ Wrong color!'}
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

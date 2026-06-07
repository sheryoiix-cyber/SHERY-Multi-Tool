import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

interface ArithmeticSpeedRunProps {
  level: number;
  onLevelUp: () => void;
  onScoreChange: (score: number) => void;
}

export const ArithmeticSpeedRun: React.FC<ArithmeticSpeedRunProps> = ({
  level,
  onLevelUp,
  onScoreChange,
}) => {
  const [timeLeft, setTimeLeft] = useState(30 + level * 5);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<{
    num1: number;
    num2: number;
    operation: string;
    answer: number;
  } | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [showFlash, setShowFlash] = useState(false);

  const generateQuestion = () => {
    const operations = ['+', '-', '*', '/'];
    const op = operations[Math.floor(Math.random() * operations.length)];
    let num1 = Math.floor(Math.random() * (10 + level * 5)) + 1;
    let num2 = Math.floor(Math.random() * (10 + level * 5)) + 1;

    if (op === '/') {
      num2 = Math.floor(Math.random() * 9) + 1;
      num1 = num2 * Math.floor(Math.random() * 10 + 1);
    }

    const answer =
      op === '+'
        ? num1 + num2
        : op === '-'
        ? num1 - num2
        : op === '*'
        ? num1 * num2
        : num1 / num2;

    setCurrentQuestion({
      num1,
      num2,
      operation: op,
      answer: Math.round(answer * 100) / 100,
    });
    setUserAnswer('');
  };

  useEffect(() => {
    if (!gameStarted) return;
    if (!currentQuestion) generateQuestion();

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameStarted(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, currentQuestion]);

  const handleSubmit = () => {
    if (!currentQuestion) return;

    const correct =
      Math.abs(parseFloat(userAnswer) - currentQuestion.answer) < 0.01;

    if (correct) {
      setFeedback('correct');
      const newScore = score + 10 * level;
      setScore(newScore);
      onScoreChange(newScore);
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 300);

      if (newScore % (50 * level) === 0 && newScore > 0) {
        onLevelUp();
      }
    } else {
      setFeedback('wrong');
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 300);
    }

    setTimeout(() => {
      generateQuestion();
      setFeedback(null);
    }, 500);
  };

  const progressPercentage = (score / (100 * level)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`p-8 rounded-2xl backdrop-blur-md border-2 transition-all ${
        showFlash
          ? feedback === 'correct'
            ? 'bg-green-500/20 border-green-400'
            : 'bg-red-500/20 border-red-400'
          : 'bg-slate-900/50 border-slate-700'
      }`}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-cyan-400">⚡ Arithmetic Speed Run</h2>
          <div className="text-right">
            <p className="text-sm text-slate-400">Level {level}</p>
            <p className="text-2xl font-bold text-cyan-400">{score}</p>
          </div>
        </div>

        {/* Timer */}
        <div className="mb-6">
          <div className="text-5xl font-bold text-center mb-4 text-cyan-400">
            {timeLeft}s
          </div>
          <motion.div
            className="h-3 bg-slate-700 rounded-full overflow-hidden"
            initial={{ width: '100%' }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
              animate={{ width: `${(timeLeft / (30 + level * 5)) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <p className="text-sm text-slate-400 mb-2">Progress to Next Level</p>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
              animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Game Controls */}
        {!gameStarted ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setGameStarted(true);
              setTimeLeft(30 + level * 5);
              setScore(0);
              generateQuestion();
            }}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-bold text-lg text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
          >
            🚀 Start Game
          </motion.button>
        ) : timeLeft > 0 ? (
          currentQuestion && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="text-center">
                <p className="text-5xl font-bold text-cyan-400">
                  {currentQuestion.num1} {currentQuestion.operation} {currentQuestion.num2}
                </p>
              </div>

              <div className="flex gap-4">
                <input
                  type="number"
                  step="0.01"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="Enter your answer"
                  className="flex-1 px-4 py-3 bg-slate-800 border-2 border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none text-xl font-bold"
                  autoFocus
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-bold text-white hover:shadow-lg hover:shadow-green-500/50"
                >
                  ✓
                </motion.button>
              </div>

              {feedback && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-center text-2xl font-bold py-3 rounded-lg ${
                    feedback === 'correct'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {feedback === 'correct' ? '✅ Correct!' : '❌ Wrong!'}
                </motion.div>
              )}
            </motion.div>
          )
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4"
          >
            <p className="text-4xl font-bold text-cyan-400">Game Over! 🎮</p>
            <p className="text-2xl text-slate-300">Final Score: {score}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setGameStarted(true);
                setTimeLeft(30 + level * 5);
                setScore(0);
                generateQuestion();
              }}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-bold text-lg text-white hover:shadow-lg hover:shadow-cyan-500/50"
            >
              <RotateCcw className="inline mr-2 w-5 h-5" />
              Play Again
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

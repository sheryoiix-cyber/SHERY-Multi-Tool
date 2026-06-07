import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, RotateCcw } from 'lucide-react';

interface AnagramSolverProps {
  level: number;
  onLevelUp: () => void;
  onScoreChange: (score: number) => void;
}

const WORD_DATABASE = {
  easy: [
    { word: 'REACT', hint: 'A JavaScript library for building UIs', anagram: 'TRACE' },
    { word: 'JAVASCRIPT', hint: 'Programming language for web', anagram: 'IPSCAVTRJA' },
    { word: 'CODING', hint: 'Writing computer programs', anagram: 'DICNOG' },
    { word: 'PYTHON', hint: 'Snake-named programming language', anagram: 'PHYTON' },
    { word: 'ALGORITHM', hint: 'Step-by-step procedure', anagram: 'MIGLORTHA' },
  ],
  medium: [
    { word: 'TYPESCRIPT', hint: 'Typed JavaScript variant', anagram: 'PRICTTYPES' },
    { word: 'DATABASE', hint: 'Organized data storage', anagram: 'BASATADED' },
    { word: 'FUNCTION', hint: 'Reusable code block', anagram: 'NUFCTION' },
    { word: 'VARIABLE', hint: 'Container for data', anagram: 'VALEIBRAR' },
    { word: 'DEBUGGING', hint: 'Finding and fixing errors', anagram: 'GGDEUINDB' },
  ],
  hard: [
    { word: 'ENCRYPTION', hint: 'Securing data with codes', anagram: 'CRYPTNIONE' },
    { word: 'ARCHITECTURE', hint: 'System design pattern', anagram: 'REACHICUART' },
    { word: 'DOCUMENTATION', hint: 'Project explanation', anagram: 'TAICODUMNENT' },
    { word: 'INFRASTRUCTURE', hint: 'System foundation', anagram: 'FURTCUSTREIN' },
    { word: 'OPTIMIZATION', hint: 'Making code faster', anagram: 'MIZATIOPTON' },
  ],
};

export const AnagramSolver: React.FC<AnagramSolverProps> = ({
  level,
  onLevelUp,
  onScoreChange,
}) => {
  const difficulty = level <= 2 ? 'easy' : level <= 5 ? 'medium' : 'hard';
  const wordList = WORD_DATABASE[difficulty as keyof typeof WORD_DATABASE];

  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  const currentWord = wordList[currentWordIdx];

  const handleSubmit = () => {
    const correct = userAnswer.toUpperCase() === currentWord.word;
    setTotalAttempts((prev) => prev + 1);

    if (correct) {
      setFeedback('correct');
      const points = showHint ? 25 * level : 50 * level;
      const newScore = score + points;
      setScore(newScore);
      setCorrectCount((prev) => prev + 1);
      onScoreChange(newScore);

      if (correctCount + 1 >= 5 && (correctCount + 1) % 5 === 0) {
        onLevelUp();
      }

      setTimeout(() => {
        if (currentWordIdx < wordList.length - 1) {
          setCurrentWordIdx(currentWordIdx + 1);
          setUserAnswer('');
          setFeedback(null);
          setShowHint(false);
        } else {
          setGameStarted(false);
        }
      }, 1000);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  const progressPercentage = (correctCount / 5) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="p-8 rounded-2xl backdrop-blur-md border-2 border-slate-700 bg-slate-900/50"
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-yellow-400">🔤 Anagram Solver</h2>
          <div className="text-right">
            <p className="text-sm text-slate-400">Level {level}</p>
            <p className="text-2xl font-bold text-yellow-400">{score}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <p className="text-sm text-slate-400 mb-2">Progress: {correctCount} / 5</p>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Game Start */}
        {!gameStarted ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setGameStarted(true);
              setCurrentWordIdx(0);
              setScore(0);
              setCorrectCount(0);
              setTotalAttempts(0);
            }}
            className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl font-bold text-lg text-white hover:shadow-lg hover:shadow-yellow-500/50"
          >
            🎮 Start Anagram Game (Difficulty: {difficulty.toUpperCase()})
          </motion.button>
        ) : currentWordIdx < wordList.length ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Hint */}
            <div className="bg-slate-800/50 border-2 border-slate-600 rounded-lg p-4">
              <p className="text-sm text-slate-400 mb-2">💡 Hint:</p>
              <p className="text-lg text-slate-200">{currentWord.hint}</p>
            </div>

            {/* Anagram */}
            <div className="text-center">
              <p className="text-sm text-slate-400 mb-2">Unscramble the letters:</p>
              <motion.div
                className="text-5xl font-bold text-yellow-400 tracking-widest mb-4"
                initial={{ rotateZ: -5 }}
                animate={{ rotateZ: 0 }}
              >
                {currentWord.anagram}
              </motion.div>
            </div>

            {/* Input */}
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Type your answer"
              className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-yellow-400 focus:outline-none text-xl font-bold"
              autoFocus
            />

            {/* Buttons */}
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-bold text-white hover:shadow-lg hover:shadow-green-500/50"
              >
                ✓ Submit
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowHint(true)}
                disabled={showHint}
                className={`px-4 py-3 rounded-lg font-bold flex items-center gap-2 ${
                  showHint
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/50'
                }`}
              >
                <Lightbulb className="w-5 h-5" />
                Hint
              </motion.button>
            </div>

            {/* Feedback */}
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
                {feedback === 'correct' ? '✅ Correct!' : '❌ Try Again!'}
              </motion.div>
            )}

            {showHint && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-500/20 border-2 border-blue-400 rounded-lg p-3 text-blue-300 text-sm"
              >
                The word has {currentWord.word.length} letters
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4"
          >
            <p className="text-4xl font-bold text-yellow-400">🎉 Game Complete!</p>
            <p className="text-2xl text-slate-300">Final Score: {score}</p>
            <p className="text-lg text-slate-400">Correct: {correctCount} / 5</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setGameStarted(true);
                setCurrentWordIdx(0);
                setScore(0);
                setCorrectCount(0);
                setTotalAttempts(0);
              }}
              className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl font-bold text-lg text-white"
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

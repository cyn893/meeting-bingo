import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { GameState } from '../types';
import { generateShareText, copyToClipboard } from '../lib/shareUtils';
import { useState } from 'react';

interface Props {
  game: GameState;
  onPlayAgain: () => void;
  onHome: () => void;
}

export function WinScreen({ game, onPlayAgain, onHome }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  const duration = game.startedAt && game.completedAt
    ? Math.round((game.completedAt - game.startedAt) / 1000 / 60)
    : null;

  const handleShare = async () => {
    const text = generateShareText(game);
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-sage-200 to-sage-50">
      <div className="text-center max-w-md animate-bounce-in">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">BINGO!</h1>
        <p className="text-lg text-gray-600 mb-6">
          You got {game.winningLine?.type === 'diagonal' ? 'a diagonal' : `a ${game.winningLine?.type}`}!
        </p>

        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 text-left">
          <div className="text-sm text-gray-600 space-y-1">
            <p>Squares filled: <span className="font-semibold text-gray-900">{game.filledCount}/25</span></p>
            {duration !== null && (
              <p>Time: <span className="font-semibold text-gray-900">{duration} min</span></p>
            )}
            {game.winningWord && (
              <p>Winning word: <span className="font-semibold text-gray-900">{game.winningWord}</span></p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleShare}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 active:scale-95 transition-all"
          >
            {copied ? 'Copied!' : 'Share Result'}
          </button>
          <button
            onClick={onPlayAgain}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:scale-95 transition-all"
          >
            Play Again
          </button>
          <button
            onClick={onHome}
            className="px-6 py-3 text-gray-600 font-medium hover:text-gray-800 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

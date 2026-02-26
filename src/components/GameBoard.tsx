import { useState, useCallback, useEffect } from 'react';
import type { GameState } from '../types';
import { BingoCard } from './BingoCard';
import { TranscriptPanel } from './TranscriptPanel';
import { checkForBingo, countFilled, getClosestToWin } from '../lib/bingoChecker';
import { detectWordsWithAliases } from '../lib/wordDetector';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { cn } from '../lib/cn';

interface Props {
  game: GameState;
  setGame: React.Dispatch<React.SetStateAction<GameState>>;
  onWin: (winningLine: any, winningWord: string) => void;
  onBack: () => void;
}

export function GameBoard({ game, setGame, onWin, onBack }: Props) {
  const [detectedWords, setDetectedWords] = useState<string[]>([]);
  const speech = useSpeechRecognition();

  const handleSquareClick = useCallback((row: number, col: number) => {
    setGame(prev => {
      if (!prev.card) return prev;
      const square = prev.card.squares[row][col];
      if (square.isFreeSpace) return prev;

      const newSquares = prev.card.squares.map(r =>
        r.map(sq => {
          if (sq.id !== square.id) return sq;
          return {
            ...sq,
            isFilled: !sq.isFilled,
            isAutoFilled: false,
            filledAt: !sq.isFilled ? Date.now() : null,
          };
        })
      );

      const newCard = { ...prev.card, squares: newSquares };
      return { ...prev, card: newCard, filledCount: countFilled(newCard) };
    });
  }, [setGame]);

  // Check for bingo on every state change
  useEffect(() => {
    if (!game.card || game.status !== 'playing') return;

    const winningLine = checkForBingo(game.card);
    if (winningLine) {
      const winSquareIds = new Set(winningLine.squares);
      const winningWord = game.card.squares
        .flat()
        .find(sq => winSquareIds.has(sq.id) && !sq.isFreeSpace && sq.isFilled)?.word ?? '';
      onWin(winningLine, winningWord);
    }
  }, [game.card, game.status, onWin]);

  // Handle speech transcript for auto-fill
  const handleTranscript = useCallback((transcript: string) => {
    setGame(prev => {
      if (!prev.card) return prev;

      const filledWords = new Set(
        prev.card.squares.flat().filter(sq => sq.isFilled).map(sq => sq.word.toLowerCase())
      );

      const newDetected = detectWordsWithAliases(transcript, prev.card.words, filledWords);
      if (newDetected.length === 0) return prev;

      setDetectedWords(d => [...d, ...newDetected]);

      const detectedLower = new Set(newDetected.map(w => w.toLowerCase()));
      const newSquares = prev.card.squares.map(row =>
        row.map(sq => {
          if (sq.isFilled || sq.isFreeSpace) return sq;
          if (detectedLower.has(sq.word.toLowerCase())) {
            return { ...sq, isFilled: true, isAutoFilled: true, filledAt: Date.now() };
          }
          return sq;
        })
      );

      const newCard = { ...prev.card, squares: newSquares };
      return { ...prev, card: newCard, filledCount: countFilled(newCard) };
    });
  }, [setGame]);

  const toggleListening = useCallback(() => {
    if (speech.isListening) {
      speech.stopListening();
      setGame(prev => ({ ...prev, isListening: false }));
    } else {
      speech.startListening(handleTranscript);
      setGame(prev => ({ ...prev, isListening: true }));
    }
  }, [speech, handleTranscript, setGame]);

  const closest = game.card ? getClosestToWin(game.card) : null;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-sm mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            ← Back
          </button>
          <div className="text-sm text-gray-500">
            {game.filledCount}/25 filled
          </div>
        </div>

        {closest && closest.needed === 1 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3 text-center text-sm text-amber-700 font-medium animate-pulse">
            One away! ({closest.line})
          </div>
        )}

        {game.card && (
          <BingoCard
            card={game.card}
            winningLine={game.winningLine}
            onSquareClick={handleSquareClick}
          />
        )}

        <div className="mt-4 flex gap-2">
          {speech.isSupported ? (
            <button
              onClick={toggleListening}
              className={cn(
                'flex-1 py-2.5 rounded-xl font-medium text-sm transition-all',
                speech.isListening
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-blue-600 text-white hover:bg-blue-700',
              )}
            >
              {speech.isListening ? 'Stop Listening' : 'Start Listening'}
            </button>
          ) : (
            <div className="flex-1 py-2.5 rounded-xl bg-gray-200 text-gray-500 text-sm text-center">
              Speech not supported — manual mode only
            </div>
          )}
        </div>

        {speech.error && (
          <p className="mt-2 text-xs text-red-500 text-center">
            Mic error: {speech.error}
          </p>
        )}

        <TranscriptPanel
          transcript={speech.transcript}
          interimTranscript={speech.interimTranscript}
          detectedWords={detectedWords}
          isListening={speech.isListening}
        />

        <p className="mt-4 text-[10px] text-gray-400 text-center">
          Audio processed locally. Never recorded. Never transmitted.
        </p>
      </div>
    </div>
  );
}

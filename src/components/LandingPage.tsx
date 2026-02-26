interface Props {
  onStart: () => void;
}

export function LandingPage({ onStart }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🎯</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Meeting Bingo</h1>
        <p className="text-lg text-gray-600 mb-8">
          Turn your meetings into a game. Listen for buzzwords and fill your bingo card!
        </p>
        <button
          onClick={onStart}
          className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-lg"
        >
          New Game
        </button>
        <p className="mt-8 text-xs text-gray-400">
          Audio processed locally. Never recorded. Never transmitted.
        </p>
      </div>
    </div>
  );
}

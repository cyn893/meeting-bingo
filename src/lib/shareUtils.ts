import type { GameState } from '../types';

export function generateShareText(game: GameState): string {
  if (!game.card) return '';

  const grid = game.card.squares
    .map(row =>
      row.map(sq => {
        if (sq.isFreeSpace) return '⭐';
        if (sq.isAutoFilled) return '🟢';
        if (sq.isFilled) return '🟦';
        return '⬜';
      }).join('')
    )
    .join('\n');

  const duration = game.startedAt && game.completedAt
    ? Math.round((game.completedAt - game.startedAt) / 1000 / 60)
    : null;

  const lines = [
    '🎯 Meeting Bingo!',
    grid,
    '',
    `Filled: ${game.filledCount}/25`,
  ];

  if (duration !== null) {
    lines.push(`Time: ${duration}m`);
  }

  return lines.join('\n');
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

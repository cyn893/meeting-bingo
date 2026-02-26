# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Meeting Bingo — a browser-based game that gamifies corporate meetings by auto-detecting buzzwords via live audio transcription. Players get a 5x5 bingo card, and squares fill automatically when keywords are spoken. Currently pre-implementation with comprehensive design docs in `docs/`.

## Planned Stack

React 18 + TypeScript, Vite, Tailwind CSS, Web Speech API, canvas-confetti, Vercel deployment. Zero-cost infrastructure — all browser-native APIs, no backend.

## Build Commands (once scaffolded)

- `npm run dev` — start Vite dev server (port 3000)
- `npm run build` — `tsc && vite build`
- `npm run preview` — preview production build
- `npm run lint` — ESLint
- `npm run typecheck` — `tsc --noEmit`

## Environment Setup

- Uses [varlock](https://varlock.dev/env-spec) for environment variable management
- `.env.schema` defines required variables (including `LINEAR_API_KEY`)
- `env.d.ts` is auto-generated from `.env.schema` — do not edit manually
- `.env` contains actual secrets and is not tracked in git

## Architecture

See `docs/research/meeting-bingo-architecture.md` for full architecture and `docs/implementation/plan.md` for the phased build plan.

**Key design decisions:**
- State-based routing in `App.tsx` (landing → category select → game → win) — no router library
- Game state via React useState + Context, persisted to localStorage
- Speech recognition via Web Speech API with graceful fallback to manual-only mode
- Word detection: case-insensitive matching with alias support for acronyms (e.g., CI/CD → "ci cd", "cicd")
- 5x5 bingo grid with free center space, 24 words drawn from category packs of 40+ words each
- Three category packs: Agile & Scrum, Corporate Speak, Tech & Engineering (`src/data/categories.ts`)

**Planned source layout:**
- `src/components/` — React components (BingoCard, BingoSquare, GameBoard, etc.)
- `src/hooks/` — useSpeechRecognition, useGame, useBingoDetection, useLocalStorage
- `src/lib/` — cardGenerator (Fisher-Yates shuffle), bingoChecker (12 winning lines), wordDetector, shareUtils
- `src/types/` — TypeScript interfaces (BingoGame, BingoCard, BingoSquare, GameState, etc.)
- `src/context/` — GameContext provider
- `src/data/` — buzzword category data

## Tools

- **varlock** — environment variable schema management and TypeScript type generation
- **Linear API** (`@linear/sdk`) — project management integration (requires `LINEAR_API_KEY` in `.env`)
- **Vercel** — deployment and hosting platform

# Meeting Bingo — Implementation Plan

## Context

Meeting Bingo is a browser-based game that gamifies corporate meetings by auto-detecting buzzwords via live audio transcription. Players get a 5x5 bingo card, and squares fill automatically when keywords are spoken. The project has comprehensive PRD, architecture, and UX research docs but **zero source code** — this plan covers the full build from scratch.

**Stack**: React 18 + TypeScript, Vite, Tailwind CSS, Web Speech API, canvas-confetti, Vercel deployment.

---

## Phase 1: Project Scaffolding & Foundation (~20 min)

### 1.1 Initialize Vite + React + TypeScript project
- `npm create vite@latest . -- --template react-ts`
- Install dependencies: `tailwindcss`, `postcss`, `autoprefixer`, `canvas-confetti`, `@types/canvas-confetti`
- Configure `tailwind.config.js`, `postcss.config.js`, update `index.css` with Tailwind directives

### 1.2 Create type definitions
- **`src/types/index.ts`** — `BingoGame`, `BingoCard`, `BingoSquare`, `WinningLine`, `GameStatus`, `Category`

### 1.3 Create buzzword data
- **`src/data/categories.ts`** — Three category packs (Agile & Scrum, Corporate Speak, Tech & Engineering) with 40+ words each, including aliases for fuzzy matching

### 1.4 Project structure
Create the directory skeleton: `src/components/`, `src/components/ui/`, `src/hooks/`, `src/lib/`, `src/data/`, `src/types/`, `src/context/`

---

## Phase 2: Core Game Logic & UI (~30 min)

### 2.1 Utility libraries
- **`src/lib/cardGenerator.ts`** — Fisher-Yates shuffle, random 24-word selection, free space in center
- **`src/lib/bingoChecker.ts`** — Check all 12 winning lines (5 rows, 5 columns, 2 diagonals)
- **`src/lib/wordDetector.ts`** — Buzzword matching against transcript text (case-insensitive, alias support, phrase matching)
- **`src/lib/shareUtils.ts`** — Generate shareable text/image of completed board

### 2.2 Game state management
- **`src/hooks/useGame.ts`** — Core game state hook (new game, toggle square, auto-fill, reset)
- **`src/hooks/useLocalStorage.ts`** — Persist/restore game state
- **`src/hooks/useBingoDetection.ts`** — Watch for win conditions on every square change
- **`src/context/GameContext.tsx`** — Global game state provider

### 2.3 UI Components
- **`src/components/LandingPage.tsx`** — Hero section, "New Game" CTA, privacy notice
- **`src/components/CategorySelect.tsx`** — Card grid to pick Agile/Corporate/Tech pack
- **`src/components/BingoSquare.tsx`** — Individual square (tap to toggle, visual states: default/filled/auto-filled/winning)
- **`src/components/BingoCard.tsx`** — 5x5 grid layout, free space center
- **`src/components/GameBoard.tsx`** — Main game view: card + controls + transcript
- **`src/components/GameControls.tsx`** — Start/stop listening, new game, category info
- **`src/components/ui/Button.tsx`**, **`Card.tsx`**, **`Toast.tsx`** — Reusable UI primitives

### 2.4 App routing
- **`src/App.tsx`** — Simple state-based routing (landing → category select → game → win)

---

## Phase 3: Speech Recognition & Auto-Fill (~25 min)

### 3.1 Speech recognition hook
- **`src/hooks/useSpeechRecognition.ts`** — Wrap Web Speech API with:
  - Start/stop controls
  - Continuous mode + interim results
  - Auto-restart on unexpected stop
  - Browser compatibility detection (Chrome/Edge preferred, webkit prefix for Safari)
  - Graceful fallback when unavailable (manual-only mode)
  - Microphone permission handling with trust-building UI

### 3.2 Word detection integration
- Wire `wordDetector.ts` to process transcript chunks in real-time
- Match against current card's words (including aliases)
- Auto-fill squares with `autoFilled: true` flag for visual distinction
- Target: < 500ms from speech to square fill

### 3.3 Transcript panel
- **`src/components/TranscriptPanel.tsx`** — Live scrolling transcript with highlighted detected words
- Collapsible to minimize distraction (ambient engagement principle)

---

## Phase 4: Win State & Polish (~15 min)

### 4.1 Win celebration
- **`src/components/WinScreen.tsx`** — Confetti animation (canvas-confetti), winning line highlight, game stats (time played, words detected)
- Silent by default (no sound — user is in a meeting)

### 4.2 Share functionality
- Generate shareable text result (emoji grid like Wordle)
- Copy to clipboard for Slack/Teams sharing
- "Play Again" and "New Category" options

### 4.3 Responsive design & polish
- Mobile-first responsive layout (phone near laptop speaker use case)
- Touch-friendly square sizes (min 44px tap targets)
- "One away!" visual indicator when 4-in-a-row achieved
- Privacy notice footer: "Audio processed locally. Never recorded. Never transmitted."

### 4.4 Entry point & HTML
- **`index.html`** — Meta tags, favicon, viewport config
- **`src/main.tsx`** — React root with GameContext provider
- **`src/index.css`** — Tailwind directives + custom CSS variables for theme

---

## Verification

1. **Build**: `npm run dev` starts without errors
2. **Card generation**: Click through landing → category → board; verify 5x5 grid with free center space, 24 unique words
3. **Manual play**: Tap squares to toggle filled state; verify BINGO detection triggers win screen on 5-in-a-row
4. **Speech recognition**: Enable mic; speak buzzwords; verify auto-fill within ~500ms
5. **Win flow**: Complete a line; verify confetti animation and share text generation
6. **Persistence**: Refresh page mid-game; verify game state restores from localStorage
7. **Mobile**: Test responsive layout at 375px width
8. **Deploy**: `vercel` deploys successfully to free tier

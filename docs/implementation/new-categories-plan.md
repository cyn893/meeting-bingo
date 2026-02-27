# New Category Packs — Implementation Plan

## Overview

Add three new bingo category packs — **Traffic**, **Kids**, and **Hockey** — to `src/data/categories.ts`, following the existing `Category` interface pattern. Each pack gets 40+ thematic words/phrases for a full bingo experience.

**Files modified**: `src/data/categories.ts` (single file change)

---

## Category 1: Traffic (🚗)

**id**: `traffic`
**name**: `Traffic & Commuting`
**description**: `Road rage, detours, and are we there yet`

**Words (40+)**:
```
road rage, pothole, detour, rubbernecking, fender bender,
merge, tailgating, gridlock, rush hour, construction zone,
speed trap, red light, green light, yield, roundabout,
carpool lane, HOV, exit ramp, on-ramp, bumper to bumper,
blind spot, cut off, jaywalker, crosswalk, school zone,
parallel parking, double parked, meter expired, tow truck, flat tire,
road work, lane closure, alternate route, GPS recalculating, U-turn,
speed bump, traffic jam, left turn signal, no parking, backed up,
shoulder, median, overpass, highway, interstate
```

---

## Category 2: Kids (🧒)

**id**: `kids`
**name**: `Kids & Parenting`
**description**: `Snack time, nap time, and "are we there yet"`

**Words (40+)**:
```
snack time, nap time, time out, play date, screen time,
bedtime, tantrum, picky eater, juice box, goldfish crackers,
diaper, pacifier, stroller, car seat, baby proof,
lullaby, binky, sippy cup, booster seat, night light,
recess, show and tell, finger paint, coloring book, playground,
sleepover, birthday party, trick or treat, tooth fairy, santa claus,
are we there yet, I'm bored, it's not fair, he started it, five more minutes,
indoor voice, sharing is caring, because I said so, no dessert, clean your room,
mac and cheese, chicken nuggets, bubble bath, story time, blankie
```

---

## Category 3: Hockey (🏒)

**id**: `hockey`
**name**: `Hockey`
**description**: `Hat tricks, power plays, and dropping the gloves`

**Words (40+)**:
```
hat trick, power play, penalty box, icing, offside,
face off, slapshot, wrist shot, top shelf, five hole,
breakaway, deke, dangle, snipe, bar down,
empty net, pull the goalie, short handed, odd man rush, line change,
boarding, cross checking, high sticking, hooking, tripping,
zamboni, blue line, red line, crease, neutral zone,
enforcer, goon, drop the gloves, sin bin, two minutes,
hat trick, one timer, backhand, forecheck, backcheck,
dump and chase, wrap around, screened, blocker, glove side
```

---

## Implementation Steps

### Step 1: Add category entries to `src/data/categories.ts`

Append three new objects to the `CATEGORIES` array, each following the existing structure:

```typescript
{
  id: string,        // 'traffic' | 'kids' | 'hockey'
  name: string,      // display name
  description: string,
  icon: string,      // emoji
  words: string[],   // 40+ entries
}
```

No changes to the `Category` type or any other files — the existing card generator, word detector, and UI components already handle arbitrary categories dynamically.

### Step 2: Verify

1. `npm run dev` — confirm no build errors
2. `npm run typecheck` — confirm no type errors
3. Manual check — all six categories appear in the category select screen
4. Play a round with each new category — confirm 24 unique words populate the 5x5 grid

---

## Scope

- **In scope**: Word list curation, `categories.ts` update
- **Out of scope**: UI changes, new components, alias mappings (none needed for these categories — no acronyms like CI/CD)
- **Risk**: None — additive change to a single data file, no logic changes

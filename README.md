# SidelineReel Coach Review

A clickable product prototype simulating a coach-facing roster tagging verification flow.
The app has flagged low confidence jersey number matches, and the coach confirms or
reassigns each one before highlight reels are sent to parents.

Built with React + Vite + Tailwind. No backend, all state lives in React.

## Flow

1. **Dashboard** — how many clips are flagged this week, with a Start Review button.
2. **Review queue** — one flagged clip at a time: thumbnail, detected jersey number,
   matched player, and confidence score. Confirm keeps the tag; Reassign picks the
   correct player from the roster. A Back button re-opens the previous clip.
3. **Completion** — a tally of confirmed vs reassigned, then Send Reels triggers the
   success state.

Keyboard shortcuts on the review screen: `C` confirm, `R` reassign, `Enter` save, `Esc` cancel.

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Build

```bash
npm run build
```

Static output is written to `dist/`.

## Notes

This is a prototype. The roster, players, and dashboard metrics are placeholder seed
data (see `src/data.js`), used to make the demo credible. They are not real records.

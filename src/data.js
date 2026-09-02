// Prototype seed data. No backend: this is the source of truth for the demo.

export const TEAM = {
  name: "Riverside United",
  ageGroup: "U12 Boys",
  season: "Fall 2026",
  week: "Week 6",
}

// Full team roster used to populate the Reassign dropdown.
export const ROSTER = [
  { number: 3, name: "Aiden Brooks" },
  { number: 5, name: "Marcus Lee" },
  { number: 7, name: "Diego Ramirez" },
  { number: 8, name: "Noah Whitfield" },
  { number: 9, name: "Caleb Turner" },
  { number: 11, name: "Ethan Park" },
  { number: 12, name: "Liam Novak" },
  { number: 14, name: "Owen Delgado" },
  { number: 16, name: "Jayden Cole" },
  { number: 18, name: "Sam Okafor" },
  { number: 21, name: "Tyler Bishop" },
  { number: 23, name: "Ryan Mercer" },
]

// Clips the model flagged as low confidence for coach verification.
export const FLAGGED_CLIPS = [
  {
    id: "clip-1042",
    timestamp: "1H 12:04",
    detectedNumber: 8,
    matchedPlayer: "Noah Whitfield",
    confidence: 67,
    tint: "from-emerald-500/20 to-emerald-900/10",
  },
  {
    id: "clip-1058",
    timestamp: "1H 27:41",
    detectedNumber: 3,
    matchedPlayer: "Aiden Brooks",
    confidence: 54,
    tint: "from-sky-500/20 to-sky-900/10",
  },
  {
    id: "clip-1073",
    timestamp: "2H 04:18",
    detectedNumber: 11,
    matchedPlayer: "Ethan Park",
    confidence: 71,
    tint: "from-amber-500/20 to-amber-900/10",
  },
  {
    id: "clip-1090",
    timestamp: "2H 19:55",
    detectedNumber: 23,
    matchedPlayer: "Ryan Mercer",
    confidence: 62,
    tint: "from-violet-500/20 to-violet-900/10",
  },
  {
    id: "clip-1101",
    timestamp: "2H 33:09",
    detectedNumber: 16,
    matchedPlayer: "Jayden Cole",
    confidence: 48,
    tint: "from-rose-500/20 to-rose-900/10",
  },
]

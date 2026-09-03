# SidelineReel — Coach Review
### Product spec (prototype)

**One-liner**
A coach-facing verification flow that catches low-confidence jersey-number
matches before AI-tagged highlight reels are sent to parents.

**Problem**
SidelineReel auto-tags every game clip to a player by reading jersey numbers.
When the model isn't sure (blur, occlusion, similar numbers), a wrong tag means
a parent gets the wrong kid's highlight. We need a fast human check on only the
uncertain tags, done by the person who knows the roster: the coach.

**User & context**
A youth team coach, on a phone or laptop, reviewing a week of clips in a few
minutes between other tasks. Not technical. Wants to move fast and be sure.

**Goal**
Let a coach verify or correct every flagged tag in one sitting, then release the
reels with confidence.

**Non-goals (out of scope for this prototype)**
- Real video playback or actual ML inference
- Editing tags that were high-confidence (only flagged clips surface)
- Auth, roster management, notifications, or the parent-facing side
- Persistence / backend. All state is in-session

---

## Flow (3 screens)

### 1. Dashboard
- Shows the count of clips flagged for review this week, framed by team + week.
- Supporting stats: average confidence, reels queued, parents waiting.
- A preview list of the flagged clips (thumbnail, detected number, matched
  player, confidence).
- Primary action: **Start Review**.

### 2. Review queue (one clip at a time)
Each clip card shows:
- A video thumbnail with a play affordance.
- The **AI-detected jersey number**, the **player it matched to**, and a
  **confidence score** (color-coded: the lower the score, the hotter the warning).
- Two actions: **Confirm** (tag is right) or **Reassign** (wrong player, pick the
  correct name from the roster dropdown).

Behavior:
- Deciding advances to the next undecided clip.
- The coach can move **Back / Next** freely; decisions are kept per clip.
- Revisiting a decided clip shows its prior decision and allows changing it.
- Progress = clips decided / total.
- Once every clip has a decision, a **See summary** action appears.

### 3. Completion
- Tally of **Confirmed vs Reassigned**.
- An ordered **decision log** (per clip: player + kept/fixed).
- Primary action: **Send Reels to Parents**, then a success state
  ("Reels sent," delivery timestamp).
- Escape hatches: back to review a clip, or back to dashboard.

---

## States & rules
- **Confidence tiers** drive the badge color (higher = amber caution, lower = red).
- **Reassign** requires a roster selection before it can save.
- A clip always has exactly one decision once acted on; changing it overwrites.
- The flow can't be "finished" until all flagged clips are decided.

## Data model (per clip)
`id, timestamp, detectedNumber, matchedPlayer, confidence`, plus a team roster of
`{number, name}` for reassignment. All seed data; no real records.

## Success criteria
- A coach can clear the full flagged queue without confusion.
- No flagged tag can slip through unverified before reels send.
- Correcting a tag takes one tap + one selection.
- Works on a phone as well as a laptop.

## Interaction niceties (build-level, not core spec)
Keyboard shortcuts on the review screen: `C` confirm, `R` reassign, `Enter` save,
`Esc` cancel, arrows to move between clips.

---

## Tradeoffs & open questions

Decisions worth defending, and the ones still open. This is the part that matters
more than the pixels.

**Why only surface low-confidence clips, not every tag.**
The coach's time is the scarce resource. Reviewing every clip would make the tool a
chore and train coaches to click through on autopilot, which defeats the point. We
show only the tags the model isn't sure about, so every decision the coach makes is
one that actually needed a human. The cost: a high-confidence tag that is wrong still
slips through. That is an acceptable trade at youth-sports stakes, and it is why the
confidence threshold is a lever, not a constant.

**Why Confirm / Reassign instead of free-text or a yes/no.**
Reassign is constrained to the roster because the failure mode is "right team, wrong
player," not "unknown person." A dropdown of known names makes the correct answer one
tap away and removes typos, mismatched spellings, and off-roster guesses. Free-text
would be faster to build and worse to use.

**Why the coach, not a league admin or the parent.**
The coach is the only person who reliably knows the roster by number on sight, and
they already have the game context. Pushing verification to parents would scale the
labor but wreck accuracy and privacy.

**Why decisions are reversible and the flow refuses to finish early.**
A coach moving fast will misclick. Free back/forward navigation with a visible prior
decision, plus a hard gate that no reel sends until every flagged clip is decided,
trades a little speed for the guarantee the product actually sells: no wrong kid's
highlight reaches a parent.

**What I would instrument if this were real.**
- Time-per-clip and abandon rate (is the queue too long to finish in one sitting?).
- Reassign rate by confidence band (is the model's uncertainty well calibrated?).
- Which jersey-number pairs get confused most (feeds back into the model).
- Post-send corrections from parents (the tags that got through wrong).

**Open questions.**
- Batch actions for a coach with 40 flagged clips, or is per-clip review the point?
- Should a reassignment retrain the tagger, or just fix this one clip?
- What is the right confidence threshold, and should it adapt per team or per coach?
- How does this behave with two players sharing lookalike numbers (6/9, 1/7)?

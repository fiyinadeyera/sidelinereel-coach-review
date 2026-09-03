import { useState, useEffect } from "react"
import { TEAM, ROSTER, FLAGGED_CLIPS } from "./data"

/* ------------------------------------------------------------------ */
/*  Small presentational helpers                                       */
/* ------------------------------------------------------------------ */

// Ball / logo mark for the brand.
function Logo({ className = "" }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-green-500 text-slate-950">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M5 4v16M19 4v16M5 12h14" strokeLinecap="round" />
          <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
        </svg>
      </div>
      <div className="leading-tight">
        <p className="text-sm font-bold text-white">SidelineReel</p>
        <p className="font-mono text-[10px] uppercase tracking-widest text-green-400">Coach Review</p>
      </div>
    </div>
  )
}

// Honest label: this is concept work running on mock data.
function PrototypeChip({ className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-amber-500/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-amber-300/90 ring-1 ring-amber-500/20 ${className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
      Prototype · mock data
    </span>
  )
}

function PlayIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="white">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function PauseIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="white">
      <path d="M7 5h3v14H7zM14 5h3v14h-3z" />
    </svg>
  )
}

// Faux pitch markings shared by every thumbnail.
function PitchLines() {
  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_60%)]" />
      <div className="absolute inset-0 opacity-20">
        <div className="absolute left-1/2 top-0 h-full w-px bg-white" />
        <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white" />
        <div className="absolute left-0 top-1/2 h-14 w-8 -translate-y-1/2 border border-l-0 border-white" />
        <div className="absolute right-0 top-1/2 h-14 w-8 -translate-y-1/2 border border-r-0 border-white" />
      </div>
    </>
  )
}

// Confidence chip: color scales with how sure the model is.
function ConfidenceBadge({ value }) {
  const tone =
    value >= 70
      ? "bg-amber-500/15 text-amber-300 ring-amber-500/30"
      : value >= 55
      ? "bg-orange-500/15 text-orange-300 ring-orange-500/30"
      : "bg-rose-500/15 text-rose-300 ring-rose-500/30"
  return (
    <span className={`inline-flex flex-shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 font-mono text-xs font-medium ring-1 ${tone}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {value}% match
    </span>
  )
}

// Video placeholder. The big variant is an interactive fake player: pressing
// play animates a jersey marker running the pitch with a scrubbing timeline,
// so it reads like footage without shipping a real video file.
function VideoThumb({ tint, timestamp, number, big = false }) {
  const [playing, setPlaying] = useState(false)

  if (!big) {
    return (
      <div className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br ${tint} ring-1 ring-white/10`}>
        <PitchLines />
        <div className="absolute inset-0 grid place-items-center">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-black/40 backdrop-blur">
            <PlayIcon className="h-3.5 w-3.5" />
          </div>
        </div>
        <span className="absolute bottom-1.5 right-1.5 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[10px] text-white">
          {timestamp}
        </span>
      </div>
    )
  }

  return (
    <div className={`relative aspect-video w-full overflow-hidden rounded-xl bg-gradient-to-br ${tint} ring-1 ring-white/10`}>
      <PitchLines />

      {/* Moving jersey marker (paused until the coach presses play). */}
      <div
        className="pointer-events-none absolute z-10 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-green-500 text-xs font-bold text-slate-950 shadow-lg shadow-black/40"
        style={{
          left: "8%",
          top: "62%",
          animation: "reel-run 6s ease-in-out infinite",
          animationPlayState: playing ? "running" : "paused",
        }}
      >
        {number}
      </div>

      {/* Big centre play button, fades out while playing. */}
      <button
        type="button"
        onClick={() => setPlaying((p) => !p)}
        className="absolute inset-0 grid place-items-center"
        aria-label={playing ? "Pause clip" : "Play clip"}
      >
        <span
          className={`grid h-16 w-16 place-items-center rounded-full bg-black/45 backdrop-blur transition-opacity duration-200 ${
            playing ? "opacity-0" : "opacity-100"
          }`}
        >
          <PlayIcon className="h-7 w-7" />
        </span>
      </button>

      {/* Corner tag */}
      <span className="pointer-events-none absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded bg-black/55 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-white">
        <span className={`h-1.5 w-1.5 rounded-full ${playing ? "animate-pulse bg-green-400" : "bg-slate-400"}`} />
        {playing ? "Playing" : "Clip"}
      </span>

      {/* Bottom control bar with a scrubbing timeline. */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-center gap-2.5 bg-gradient-to-t from-black/75 to-transparent px-3 pb-2.5 pt-8">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-full bg-white/15 hover:bg-white/25"
          aria-label={playing ? "Pause clip" : "Play clip"}
        >
          {playing ? <PauseIcon className="h-3.5 w-3.5" /> : <PlayIcon className="h-3.5 w-3.5" />}
        </button>
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/25">
          <div
            className="h-full rounded-full bg-green-400"
            style={{
              width: playing ? undefined : "0%",
              animation: "reel-scrub 6s linear infinite",
              animationPlayState: playing ? "running" : "paused",
            }}
          />
        </div>
        <span className="flex-shrink-0 font-mono text-[10px] text-white">{timestamp}</span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Layout shell: dark sidebar (desktop) + top bar (mobile)            */
/* ------------------------------------------------------------------ */

function Shell({ step, children }) {
  const nav = [
    { key: "dashboard", label: "Review Queue", active: step !== "done" },
    { key: "highlights", label: "Highlights", active: false },
    { key: "roster", label: "Roster", active: false },
    { key: "settings", label: "Settings", active: false },
  ]
  return (
    <div className="flex min-h-full flex-col bg-slate-950 lg:flex-row">
      {/* Sidebar (desktop) */}
      <aside className="hidden w-60 flex-shrink-0 flex-col border-r border-white/5 bg-[#0d1117] px-4 py-6 lg:flex">
        <Logo />
        <PrototypeChip className="mt-4 self-start" />
        <nav className="mt-8 flex flex-col gap-1">
          {nav.map((item) => (
            <div
              key={item.key}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                item.active
                  ? "bg-green-500/10 text-green-300 ring-1 ring-green-500/20"
                  : "text-slate-400"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${item.active ? "bg-green-400" : "bg-slate-600"}`} />
              {item.label}
            </div>
          ))}
        </nav>
        <div className="mt-auto rounded-lg border border-white/5 bg-white/[0.03] p-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Signed in</p>
          <p className="mt-1 text-sm font-semibold text-white">Coach Daniels</p>
          <p className="text-xs text-slate-400">{TEAM.name}</p>
        </div>
      </aside>

      {/* Top bar (mobile) */}
      <header className="lg:hidden">
        <div className="flex items-center justify-between border-b border-white/5 bg-[#0d1117] px-4 py-3">
          <Logo />
          <div className="grid h-9 w-9 place-items-center rounded-full bg-white/5 text-xs font-bold text-white">
            CD
          </div>
        </div>
        <div className="flex border-b border-white/5 bg-[#0d1117] px-4 pb-2.5">
          <PrototypeChip />
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Screen 1: Dashboard                                                */
/* ------------------------------------------------------------------ */

function Dashboard({ clips, onStart }) {
  // Nothing flagged: the coach is done, so show a calm all-clear instead of an
  // empty queue and a dead Start button.
  if (clips.length === 0) {
    return (
      <div className="grid min-h-[70vh] place-items-center px-5 py-12">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-500/15 ring-1 ring-green-500/30">
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-green-400" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="mt-6 text-2xl font-bold text-white">You're all caught up</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            No clips flagged for review this week. Every tag cleared confidence, so reels
            for {TEAM.name} {TEAM.ageGroup} are ready to send.
          </p>
          <p className="mt-6 font-mono text-xs uppercase tracking-widest text-slate-600">
            {TEAM.week} · {TEAM.season}
          </p>
        </div>
      </div>
    )
  }

  const avg = Math.round(clips.reduce((s, c) => s + c.confidence, 0) / clips.length)
  return (
    <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-green-400">{TEAM.week} · {TEAM.season}</p>
      <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Roster Tagging Review</h1>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-400">
        We tagged every clip from {TEAM.name} {TEAM.ageGroup} automatically. A few jersey numbers came back
        low confidence. Confirm the right players before highlight reels go out to parents.
      </p>

      {/* Hero stat */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-green-500/10 to-slate-900 p-6 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-slate-400">Flagged for review</p>
            <p className="mt-1 flex items-baseline gap-2">
              <span className="text-5xl font-bold tabular-nums text-white sm:text-6xl">{clips.length}</span>
              <span className="text-lg font-medium text-slate-400">clips</span>
            </p>
          </div>
          <button
            onClick={onStart}
            className="group inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-green-500/20 transition hover:bg-green-400 active:scale-[0.98]"
          >
            Start Review
            <svg viewBox="0 0 24 24" className="h-4 w-4 transition group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <MiniStat label="Avg confidence" value={`${avg}%`} />
          <MiniStat label="Reels queued" value="38" />
          <MiniStat label="Parents waiting" value="24" />
        </div>
      </div>

      {/* Preview list */}
      <div className="mt-8">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-slate-500">In the queue</p>
        <ul className="space-y-2">
          {clips.map((clip) => (
            <li
              key={clip.id}
              className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-3"
            >
              <VideoThumb tint={clip.tint} timestamp={clip.timestamp} number={clip.detectedNumber} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                  #{clip.detectedNumber} · {clip.matchedPlayer}
                </p>
                <p className="font-mono text-xs text-slate-500">{clip.id}</p>
              </div>
              <ConfidenceBadge value={clip.confidence} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/20 px-4 py-3">
      <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-bold tabular-nums text-white">{value}</p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Screen 2: Review queue (one clip at a time)                        */
/* ------------------------------------------------------------------ */

function ReviewQueue({ clips, index, decisions, onDecide, onBack, onNext, onFinish }) {
  const clip = clips[index]
  const current = decisions[clip.id] // existing decision for this clip, if any
  const decidedCount = Object.keys(decisions).length
  const allDecided = decidedCount === clips.length

  const [mode, setMode] = useState("idle") // idle | reassigning
  const [pick, setPick] = useState("")

  // When the clip changes, reset the panel and pre-fill any prior reassignment.
  const [seen, setSeen] = useState(clip.id)
  if (seen !== clip.id) {
    setSeen(clip.id)
    setMode("idle")
    setPick(current && current.action === "reassign" ? current.player : "")
  }

  const progress = Math.round((decidedCount / clips.length) * 100)

  function confirm() {
    onDecide({ clipId: clip.id, action: "confirm", player: clip.matchedPlayer })
  }
  function reassign() {
    if (!pick) return
    onDecide({ clipId: clip.id, action: "reassign", player: pick })
    setMode("idle")
  }

  // Keyboard shortcuts: C confirm, R reassign, Enter save, Esc cancel,
  // arrow keys to move between clips.
  useEffect(() => {
    function onKey(e) {
      if (e.target.tagName === "SELECT") {
        if (e.key === "Enter") { e.preventDefault(); reassign() }
        if (e.key === "Escape") { setMode("idle") }
        return
      }
      if (mode === "idle") {
        if (e.key === "c" || e.key === "C") { e.preventDefault(); confirm() }
        if (e.key === "r" || e.key === "R") { e.preventDefault(); setMode("reassigning") }
        if (e.key === "ArrowLeft") { e.preventDefault(); onBack() }
        if (e.key === "ArrowRight") { e.preventDefault(); onNext() }
      } else {
        if (e.key === "Enter") { e.preventDefault(); reassign() }
        if (e.key === "Escape") { e.preventDefault(); setMode("idle") }
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [mode, pick, clip.id])

  return (
    <div className="mx-auto max-w-2xl px-5 py-8 sm:px-8 sm:py-12">
      {/* Progress header with free back / next navigation */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            disabled={index === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 font-mono text-xs text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>
          <button
            onClick={onNext}
            disabled={index === clips.length - 1}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 font-mono text-xs text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
          >
            Next
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <p className="font-mono text-xs text-slate-500">
          Clip {index + 1}/{clips.length} · {decidedCount} verified
        </p>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-green-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Card */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#141a22]">
        <div className="p-4 sm:p-5">
          <VideoThumb key={clip.id} tint={clip.tint} timestamp={clip.timestamp} number={clip.detectedNumber} big />
        </div>

        <div className="space-y-5 px-5 pb-6 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-slate-500">AI detected</p>
              <div className="mt-2 flex items-center gap-3">
                <span className="grid h-14 w-14 flex-shrink-0 place-items-center rounded-xl bg-green-500 text-2xl font-bold text-slate-950">
                  {clip.detectedNumber}
                </span>
                <div>
                  <p className="text-lg font-bold leading-tight text-white">{clip.matchedPlayer}</p>
                  <p className="font-mono text-xs text-slate-500">Jersey #{clip.detectedNumber} · {clip.id}</p>
                </div>
              </div>
            </div>
            <ConfidenceBadge value={clip.confidence} />
          </div>

          {/* Prior decision banner: shows what the coach already chose here. */}
          {current && (
            <div
              className={`flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm ring-1 ${
                current.action === "confirm"
                  ? "bg-green-500/10 text-green-200 ring-green-500/25"
                  : "bg-amber-500/10 text-amber-200 ring-amber-500/25"
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>
                {current.action === "confirm"
                  ? "You confirmed this tag."
                  : `You reassigned this to ${current.player}.`}{" "}
                <span className="text-slate-400">You can change it below.</span>
              </span>
            </div>
          )}

          {mode === "idle" ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                onClick={confirm}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold transition active:scale-[0.98] ${
                  current && current.action === "confirm"
                    ? "bg-green-500 text-slate-950 ring-2 ring-green-300"
                    : "bg-green-500 text-slate-950 hover:bg-green-400"
                }`}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {current && current.action === "confirm" ? "Confirmed" : "Confirm"}
                <kbd className="ml-0.5 rounded bg-black/20 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-950/70">C</kbd>
              </button>
              <button
                onClick={() => setMode("reassigning")}
                className={`inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10 active:scale-[0.98] ${
                  current && current.action === "reassign"
                    ? "border-amber-400/50 bg-amber-500/10"
                    : "border-white/15 bg-white/5"
                }`}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M16 3l5 5-5 5M21 8H9a5 5 0 000 10h1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {current && current.action === "reassign" ? "Change player" : "Reassign"}
                <kbd className="ml-0.5 rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-300">R</kbd>
              </button>
            </div>
          ) : (
            <div className="space-y-3 rounded-xl border border-white/10 bg-black/20 p-4">
              <label className="font-mono text-xs uppercase tracking-widest text-slate-400">
                Pick the correct player
              </label>
              <select
                value={pick}
                onChange={(e) => setPick(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-slate-900 px-3.5 py-3 text-sm text-white outline-none ring-green-500/40 focus:ring-2"
              >
                <option value="" disabled>
                  Select from roster…
                </option>
                {ROSTER.map((p) => (
                  <option key={p.number} value={p.name}>
                    #{p.number} · {p.name}
                  </option>
                ))}
              </select>
              <div className="flex gap-3">
                <button
                  onClick={reassign}
                  disabled={!pick}
                  className="flex-1 rounded-xl bg-green-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-green-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Save
                </button>
                <button
                  onClick={() => setMode("idle")}
                  className="rounded-xl border border-white/15 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Finish button appears once every clip has a decision. */}
      {allDecided ? (
        <button
          onClick={onFinish}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-green-500/20 transition hover:bg-green-400 active:scale-[0.99]"
        >
          See summary
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      ) : (
        <p className="mt-4 text-center font-mono text-[11px] text-slate-600">
          C confirm · R reassign · arrows to move · Enter saves · Esc cancels
        </p>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Screen 3: Completion                                               */
/* ------------------------------------------------------------------ */

function Complete({ clips, decisions, onSend, sent, onRestart, onBackToReview }) {
  // Keep the log in clip order for a stable, scannable list.
  const log = clips.map((c) => decisions[c.id]).filter(Boolean)
  const confirmed = log.filter((d) => d.action === "confirm").length
  const reassigned = log.filter((d) => d.action === "reassign").length

  if (sent) {
    return (
      <div className="grid min-h-[70vh] place-items-center px-5 py-12">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-green-500/15 ring-1 ring-green-500/30">
            <svg viewBox="0 0 24 24" className="h-10 w-10 text-green-400" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="mt-6 text-2xl font-bold text-white">Reels sent</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            38 highlight reels are on their way to parents at {TEAM.name}. Every flagged tag was verified by you.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 font-mono text-xs text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
            Delivery started · {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
          <div>
            <button
              onClick={onRestart}
              className="mt-8 text-sm font-medium text-slate-400 underline-offset-4 hover:text-white hover:underline"
            >
              Back to dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-8 sm:px-8 sm:py-12">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-green-400">Review complete</p>
        <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">All clips verified</h1>
        <p className="mt-2 text-sm text-slate-400">
          You reviewed {log.length} flagged {log.length === 1 ? "clip" : "clips"}. Here is the summary.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-6 text-center">
          <p className="text-4xl font-bold tabular-nums text-green-300">{confirmed}</p>
          <p className="mt-1 font-mono text-xs uppercase tracking-widest text-green-400/80">Confirmed</p>
        </div>
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-6 text-center">
          <p className="text-4xl font-bold tabular-nums text-amber-300">{reassigned}</p>
          <p className="mt-1 font-mono text-xs uppercase tracking-widest text-amber-400/80">Reassigned</p>
        </div>
      </div>

      {/* Decision log */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-white/5">
        <div className="border-b border-white/5 bg-white/[0.02] px-4 py-2.5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Decision log</p>
        </div>
        <ul className="divide-y divide-white/5">
          {log.map((d) => (
            <li key={d.clipId} className="flex items-center gap-3 px-4 py-3">
              <span
                className={`h-2 w-2 rounded-full ${d.action === "confirm" ? "bg-green-400" : "bg-amber-400"}`}
              />
              <span className="font-mono text-xs text-slate-500">{d.clipId}</span>
              <span className="ml-auto text-sm font-medium text-white">{d.player}</span>
              <span
                className={`rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide ${
                  d.action === "confirm" ? "bg-green-500/15 text-green-300" : "bg-amber-500/15 text-amber-300"
                }`}
              >
                {d.action === "confirm" ? "kept" : "fixed"}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onSend}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-green-500/20 transition hover:bg-green-400 active:scale-[0.99]"
      >
        Send Reels to Parents
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button
        onClick={onBackToReview}
        className="mx-auto mt-4 block text-sm font-medium text-slate-400 underline-offset-4 hover:text-white hover:underline"
      >
        Back to review a clip
      </button>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Root: owns the flow state machine                                  */
/* ------------------------------------------------------------------ */

export default function App() {
  const [step, setStep] = useState("dashboard") // dashboard | review | done
  const [index, setIndex] = useState(0)
  const [decisions, setDecisions] = useState({}) // clipId -> { clipId, action, player }
  const [sent, setSent] = useState(false)

  function handleDecide(decision) {
    const next = { ...decisions, [decision.clipId]: decision }
    setDecisions(next)

    if (Object.keys(next).length === FLAGGED_CLIPS.length) {
      // Everything is decided: jump to the summary.
      setStep("done")
    } else if (index + 1 < FLAGGED_CLIPS.length) {
      setIndex(index + 1)
    } else {
      // On the last clip with gaps earlier: go to the first undecided one.
      const gap = FLAGGED_CLIPS.findIndex((c) => !next[c.id])
      if (gap !== -1) setIndex(gap)
    }
  }

  const goBack = () => setIndex((i) => Math.max(0, i - 1))
  const goNext = () => setIndex((i) => Math.min(FLAGGED_CLIPS.length - 1, i + 1))

  function restart() {
    setStep("dashboard")
    setIndex(0)
    setDecisions({})
    setSent(false)
  }

  return (
    <Shell step={step}>
      {step === "dashboard" && (
        <Dashboard clips={FLAGGED_CLIPS} onStart={() => setStep("review")} />
      )}
      {step === "review" && (
        <ReviewQueue
          clips={FLAGGED_CLIPS}
          index={index}
          decisions={decisions}
          onDecide={handleDecide}
          onBack={goBack}
          onNext={goNext}
          onFinish={() => setStep("done")}
        />
      )}
      {step === "done" && (
        <Complete
          clips={FLAGGED_CLIPS}
          decisions={decisions}
          sent={sent}
          onSend={() => setSent(true)}
          onRestart={restart}
          onBackToReview={() => setStep("review")}
        />
      )}
    </Shell>
  )
}

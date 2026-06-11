'use client';
import { useState } from 'react';
import Link from 'next/link';
import { COURSES, allTopics, globalTopicKey, courseBySlug } from '@/lib/courses';
import { useStore, computeWorth, computeStreak, fmtLPA, fmtINR } from '@/lib/store';

function buildMaps() {
  const worth = {}, title = {}, course = {};
  for (const c of COURSES) for (const t of allTopics(c)) {
    const k = globalTopicKey(c.slug, t.slug);
    worth[k] = t.worth; title[k] = t.title; course[k] = c.short;
  }
  return { worth, title, course };
}

export default function LogPage() {
  const { state, ready, addLog } = useStore();
  const [note, setNote] = useState('');
  const [tip, setTip] = useState(null);
  const [loading, setLoading] = useState(false);
  const maps = buildMaps();

  const worth = computeWorth(state, maps.worth);
  const streak = computeStreak(state);

  // worth timeline: finished topics in chronological order, cumulative worth
  const timeline = Object.entries(state.done || {})
    .sort((a, b) => new Date(a[1]) - new Date(b[1]));
  let running = state.baseWorth || 300000;
  const steps = timeline.map(([k, ts]) => {
    running += maps.worth[k] || 0;
    return { key: k, ts, title: maps.title[k] || k, course: maps.course[k] || '', worth: running };
  });

  const addEntry = async () => {
    if (!note.trim()) return;
    addLog(note.trim(), state.quiz?.courseSlug || null);
    setNote('');
  };

  const getDailyTip = async () => {
    setLoading(true); setTip(null);
    try {
      const r = await fetch('/api/coach', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'daily',
          course: courseBySlug(state.quiz?.courseSlug || COURSES[0].slug)?.title,
          doneCount: Object.keys(state.done || {}).length,
          target: state.targetWorth, base: state.baseWorth, streak,
        }),
      });
      const j = await r.json();
      setTip(j.text || null);
    } catch {}
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="font-display font-bold text-3xl">My journey</h1>
      <p className="text-mut mt-1">Log a little every day. Each finished step lifts your market worth — keep the streak alive.</p>

      {/* worth + streak */}
      <div className="grid sm:grid-cols-3 gap-4 mt-6">
        <Big label="Market worth" val={ready ? fmtLPA(worth) : '—'} sub={ready ? `${fmtINR(worth)}/yr` : ''} />
        <Big label="Streak" val={`${streak} 🔥`} sub="days in a row" />
        <Big label="Steps finished" val={`${Object.keys(state.done || {}).length}`} sub="across all courses" />
      </div>

      {/* daily log */}
      <div className="mt-7 rounded-2xl card-grad border border-line/70 p-5">
        <div className="font-semibold">Today’s log</div>
        <p className="text-mut text-sm mt-0.5">What did you study or build today? (keeps your streak + reminds future-you)</p>
        <div className="mt-3 flex gap-2">
          <input value={note} onChange={(e) => setNote(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addEntry()}
            placeholder="e.g. Did 5 array problems, started SQL joins"
            className="flex-1 bg-card border border-line rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand" />
          <button onClick={addEntry} className="px-4 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold">Log it</button>
        </div>
        <button onClick={getDailyTip} className="mt-3 text-sm text-brand hover:underline">🤖 What should I do today?</button>
        {loading && <p className="text-mut text-sm mt-2 animate-pulse">Planning your day…</p>}
        {!loading && tip && <div className="mt-2 text-sm whitespace-pre-wrap leading-relaxed rounded-xl bg-ink/60 border border-line/60 p-3">{tip}</div>}
        {!loading && tip === null && note === '' && (
          <p className="text-[12px] text-mut mt-2">Tip: AI daily guidance needs the Grok key on the server. Your worth timeline + streak work regardless.</p>
        )}
      </div>

      {/* worth timeline */}
      <h2 className="font-display font-bold text-xl mt-9">Your worth timeline</h2>
      {steps.length === 0 ? (
        <div className="mt-3 rounded-2xl border border-line/70 bg-card p-6 text-center text-mut">
          No steps yet. <Link href="/courses" className="text-brand">Open a course</Link> and finish your first page to start the climb.
        </div>
      ) : (
        <div className="mt-4 relative pl-6">
          <div className="absolute left-2 top-1 bottom-1 w-px bg-line" />
          <Node first label={`Started at ${fmtLPA(state.baseWorth || 300000)}`} sub="your baseline" />
          {steps.map((s) => (
            <Node key={s.key + s.ts}
              label={<><span className="text-green font-semibold">You’re worth {fmtLPA(s.worth)}</span> now</>}
              sub={`${s.title} · ${s.course} · ${new Date(s.ts).toLocaleDateString()}`} />
          ))}
          <Node goal label={`Goal: ${fmtLPA(state.targetWorth || 1200000)}`} sub={worth >= (state.targetWorth || 1200000) ? 'reached 🎯' : `${fmtINR((state.targetWorth || 1200000) - worth)}/yr to go`} />
        </div>
      )}

      {/* log history */}
      {(state.log || []).length > 0 && (
        <>
          <h2 className="font-display font-bold text-xl mt-9">Log history</h2>
          <div className="mt-3 space-y-2">
            {state.log.slice(0, 30).map((l, i) => (
              <div key={i} className="rounded-xl border border-line/60 bg-card px-4 py-2.5 text-sm flex justify-between gap-3">
                <span>{l.note}</span>
                <span className="text-mut text-xs shrink-0">{new Date(l.date).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Big({ label, val, sub }) {
  return <div className="rounded-2xl card-grad border border-line/70 p-5">
    <div className="text-xs text-mut uppercase tracking-wider">{label}</div>
    <div className="font-display font-bold text-3xl mt-1">{val}</div>
    <div className="text-mut text-sm">{sub}</div>
  </div>;
}
function Node({ label, sub, first, goal }) {
  return (
    <div className="relative mb-4">
      <div className={`absolute -left-[18px] top-1 w-3.5 h-3.5 rounded-full border-2 ${goal ? 'bg-gold border-gold' : first ? 'bg-ink border-mut' : 'bg-green border-green'}`} />
      <div className="text-sm">{label}</div>
      <div className="text-xs text-mut">{sub}</div>
    </div>
  );
}

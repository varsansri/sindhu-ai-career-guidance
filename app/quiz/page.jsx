'use client';
import { useState } from 'react';
import Link from 'next/link';
import { COURSES, courseBySlug } from '@/lib/courses';
import { useStore, fmtLPA, fmtINR } from '@/lib/store';
import Icon from '@/components/Icon';

const LEVELS = [
  ['none', 'Just graduated, no real skills yet', 250000],
  ['beginner', 'Know basics / did some tutorials', 350000],
  ['projects', 'Built a couple of projects', 500000],
  ['intern', 'Internship or freelance experience', 700000],
];
const TARGETS = [
  ['first', 'A first job — just get hired', 500000],
  ['solid', '₹6–12 LPA — a solid career start', 900000],
  ['high', '₹12+ LPA — high-demand, top pay', 1500000],
];
const INTEREST = COURSES.map((c) => [c.slug, c.short, c.icon]);
const TIME = [['low', '~30 min/day'], ['mid', '1–2 hrs/day'], ['high', '3+ hrs/day']];

export default function Quiz() {
  const { update, addLog } = useStore();
  const [a, setA] = useState({ level: 'none', target: 'solid', interest: COURSES[0].slug, time: 'mid', dream: '' });
  const [result, setResult] = useState(null);
  const [aiPlan, setAiPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setA((s) => ({ ...s, [k]: v }));

  const compute = async () => {
    const base = LEVELS.find((l) => l[0] === a.level)[2];
    const target = TARGETS.find((t) => t[0] === a.target)[2];
    const course = courseBySlug(a.interest);
    const gap = Math.max(0, target - base);
    const res = { base, target, gap, courseSlug: course.slug, courseTitle: course.title };
    setResult(res);
    update({ baseWorth: base, targetWorth: target, quiz: { ...a, ...res, at: new Date().toISOString() } });
    addLog('Completed the skill-gap assessment', course.slug);

    // optional AI plan
    setLoading(true);
    try {
      const r = await fetch('/api/coach', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: 'plan', answers: a, base, target, course: course.title }),
      });
      const j = await r.json();
      if (j.text) setAiPlan(j.text);
    } catch {}
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-display font-bold text-3xl">Find your skill gap</h1>
      <p className="text-mut mt-1">Five quick questions. We’ll set your starting worth, your goal, and the fastest path between them.</p>

      <div className="mt-7 space-y-6">
        <Field label="Where are you right now?">
          {LEVELS.map(([v, label]) => <Opt key={v} on={a.level === v} onClick={() => set('level', v)}>{label}</Opt>)}
        </Field>
        <Field label="What salary are you aiming for?">
          {TARGETS.map(([v, label]) => <Opt key={v} on={a.target === v} onClick={() => set('target', v)}>{label}</Opt>)}
        </Field>
        <Field label="Which field pulls you most?">
          {INTEREST.map(([v, label, ic]) => <Opt key={v} on={a.interest === v} onClick={() => set('interest', v)}><span className="inline-flex items-center gap-1.5"><Icon name={ic} size={16} />{label}</span></Opt>)}
        </Field>
        <Field label="How much time can you give daily?">
          {TIME.map(([v, label]) => <Opt key={v} on={a.time === v} onClick={() => set('time', v)}>{label}</Opt>)}
        </Field>
        <Field label="In one line — your dream role (optional)">
          <input value={a.dream} onChange={(e) => set('dream', e.target.value)}
            placeholder="e.g. ML engineer at a product company"
            className="w-full bg-card border border-line rounded-xl px-4 py-3 text-sm outline-none focus:border-brand" />
        </Field>

        <button onClick={compute} className="px-6 py-3 rounded-xl bg-brand text-ink font-semibold glow hover:brightness-110 transition">
          Show my gap & plan →
        </button>
      </div>

      {result && (
        <div className="mt-10 rounded-2xl card-grad border border-line/70 glow p-6">
          <h2 className="font-display font-bold text-xl">Your skill gap</h2>
          <div className="grid grid-cols-3 gap-3 mt-4 text-center">
            <Stat label="Worth now" val={fmtLPA(result.base)} />
            <Stat label="The gap" val={fmtINR(result.gap)} accent />
            <Stat label="Your goal" val={fmtLPA(result.target)} />
          </div>
          <p className="text-mut text-sm mt-4">
            Closing this gap means learning the right, in-demand skills — not everything. Your recommended path:
          </p>
          <Link href={`/courses/${result.courseSlug}`}
            className="mt-3 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-green text-ink font-bold hover:brightness-110 transition">
            Start: {result.courseTitle} →
          </Link>

          <div className="mt-6 border-t border-line/60 pt-5">
            <div className="text-sm font-semibold text-brand inline-flex items-center gap-2"><Icon name="spark" size={17} /> Your AI coach plan</div>
            {loading && <p className="text-mut text-sm mt-2 animate-pulse">Thinking through your fastest path…</p>}
            {!loading && aiPlan && <div className="text-sm mt-2 whitespace-pre-wrap leading-relaxed">{aiPlan}</div>}
            {!loading && !aiPlan && (
              <p className="text-mut text-sm mt-2">
                AI coach isn’t configured yet (add the Grok key on the server). Meanwhile, your course path above is ready —
                finish a page a day and watch your worth climb.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return <div><div className="text-sm font-semibold mb-2">{label}</div><div className="flex flex-wrap gap-2">{children}</div></div>;
}
function Opt({ on, onClick, children }) {
  return <button onClick={onClick}
    className={`px-3.5 py-2 rounded-xl text-sm border transition ${on ? 'bg-brand/20 border-brand text-white' : 'bg-card border-line text-mut hover:text-white'}`}>{children}</button>;
}
function Stat({ label, val, accent }) {
  return <div className="rounded-xl bg-ink/60 border border-line/60 p-3">
    <div className={`font-display font-bold text-xl ${accent ? 'text-gold' : ''}`}>{val}</div>
    <div className="text-[11px] text-mut uppercase tracking-wider mt-0.5">{label}</div>
  </div>;
}

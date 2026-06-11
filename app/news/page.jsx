'use client';
import { useEffect, useState } from 'react';
import { COURSES } from '@/lib/courses';
import { useStore } from '@/lib/store';
import { useCopilot } from '@/components/CopilotContext';

const TAG_COLOR = {
  Hiring: 'text-green bg-green/15', Skill: 'text-brand bg-brand/15', Tool: 'text-brand2 bg-brand2/15',
  Salary: 'text-gold bg-gold/15', Opportunity: 'text-green bg-green/15',
};

export default function NewsPage() {
  const { state } = useStore();
  const { setPageContext } = useCopilot();
  const defaultField = COURSES.find((c) => c.slug === state?.quiz?.courseSlug)?.title || COURSES[0].title;
  const [field, setField] = useState(defaultField);
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(false);
  const goal = state?.quiz?.dream || '';

  const load = async (f) => {
    setLoading(true); setItems(null);
    try {
      const r = await fetch('/api/news', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field: f, goal }),
      });
      const j = await r.json();
      setItems(j.items);
    } catch { setItems(null); }
    setLoading(false);
  };

  useEffect(() => { load(field); /* eslint-disable-next-line */ }, []);
  useEffect(() => () => setPageContext('', ''), [setPageContext]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center gap-2 text-gold text-sm font-semibold">📈 Trend radar</div>
      <h1 className="font-display font-bold text-3xl mt-1">What’s working right now</h1>
      <p className="text-mut mt-1">AI trend signals + opportunities for your goal. Tap any card and ask Bee (right →) what it means and how to use it.</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {COURSES.map((c) => (
          <button key={c.slug} onClick={() => { setField(c.title); load(c.title); }}
            className={`px-3 py-1.5 rounded-xl text-sm border transition ${field === c.title ? 'bg-brand/20 border-brand text-white' : 'bg-card border-line text-mut hover:text-white'}`}>
            {c.icon} {c.short}
          </button>
        ))}
      </div>

      {loading && <p className="text-mut mt-8 animate-pulse">Scanning the market for {field}…</p>}

      {!loading && items === null && (
        <div className="mt-8 rounded-2xl border border-line/70 bg-card p-6 text-mut">
          Trend feed needs the AI key. Add <code className="text-white">OPENAI_API_KEY</code> in Vercel → redeploy, and live trend briefings appear here.
        </div>
      )}

      {!loading && items && (
        <div className="mt-7 space-y-3">
          {items.map((it, i) => (
            <div key={i} className="rounded-2xl border border-line/70 bg-card p-5">
              <div className="flex items-center gap-2">
                <span className={`text-[11px] px-2 py-0.5 rounded-full ${TAG_COLOR[it.tag] || 'text-mut bg-ink'}`}>{it.tag}</span>
                <h3 className="font-semibold">{it.title}</h3>
              </div>
              <p className="text-sm text-mut mt-2">{it.summary}</p>
              <p className="text-sm mt-2"><span className="text-brand font-semibold">Why it matters: </span>{it.why}</p>
              {it.action && <p className="text-sm mt-1"><span className="text-green font-semibold">Do this: </span>{it.action}</p>}
              <button
                onClick={() => setPageContext(it.title, `${it.title}\n${it.summary}\nWhy it matters: ${it.why}\nSuggested action: ${it.action || ''}`)}
                className="mt-3 text-sm text-brand hover:underline">
                🐝 Ask Bee what this means →
              </button>
            </div>
          ))}
          <p className="text-[12px] text-mut pt-2">These are AI-composed trend briefings (signals & patterns), not a live news wire — use them as direction, then verify specifics.</p>
        </div>
      )}
    </div>
  );
}

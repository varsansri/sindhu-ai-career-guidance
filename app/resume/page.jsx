'use client';
import { useState } from 'react';
import { COURSES } from '@/lib/courses';
import { useStore } from '@/lib/store';

export default function ResumePage() {
  const { state } = useStore();
  const [resume, setResume] = useState('');
  const [field, setField] = useState(COURSES.find((c) => c.slug === state?.quiz?.courseSlug)?.title || COURSES[0].title);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!/\.(txt|md)$/i.test(f.name)) { setErr('Please paste your resume text, or upload a .txt file (PDF text → copy & paste).'); return; }
    setErr('');
    const reader = new FileReader();
    reader.onload = () => setResume(String(reader.result || '').slice(0, 8000));
    reader.readAsText(f);
  };

  const analyse = async () => {
    if (resume.trim().length < 40) { setErr('Paste a bit more of your resume / background first.'); return; }
    setErr(''); setLoading(true); setResult(null);
    try {
      const r = await fetch('/api/resume', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, field, goal: state?.quiz?.dream || '' }),
      });
      const j = await r.json();
      if (!j.result) setErr('AI isn’t configured yet — add OPENAI_API_KEY in Vercel and redeploy.');
      setResult(j.result);
    } catch { setErr('Something went wrong. Try again.'); }
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-display font-bold text-3xl">Resume check + success proof</h1>
      <p className="text-mut mt-1">Paste your resume / background. The AI shows where you stand, what’s missing, and the real paths that worked for people breaking into your field.</p>

      <div className="mt-6">
        <div className="text-sm font-semibold mb-2">Target field</div>
        <div className="flex flex-wrap gap-2">
          {COURSES.map((c) => (
            <button key={c.slug} onClick={() => setField(c.title)}
              className={`px-3 py-1.5 rounded-xl text-sm border transition ${field === c.title ? 'bg-brand/20 border-brand text-white' : 'bg-card border-line text-mut hover:text-white'}`}>
              {c.icon} {c.short}
            </button>
          ))}
        </div>
      </div>

      <textarea value={resume} onChange={(e) => setResume(e.target.value)}
        placeholder="Paste your resume text here — education, projects, skills, internships, links…"
        className="mt-5 w-full h-44 bg-card border border-line rounded-xl px-4 py-3 text-sm outline-none focus:border-brand resize-y" />
      <div className="mt-2 flex items-center justify-between gap-3 flex-wrap">
        <label className="text-sm text-mut cursor-pointer hover:text-white">
          📎 upload .txt
          <input type="file" accept=".txt,.md" onChange={onFile} className="hidden" />
        </label>
        <button onClick={analyse} disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-brand text-white font-semibold disabled:opacity-50">
          {loading ? 'Analysing…' : 'Analyse my resume →'}
        </button>
      </div>
      {err && <p className="text-gold text-sm mt-2">{err}</p>}

      {result && (
        <div className="mt-8 space-y-5">
          <div className="rounded-2xl card-grad border border-line/70 p-5">
            <div className="text-xs text-brand font-semibold uppercase tracking-wider">Where you stand</div>
            <p className="mt-2">{result.verdict}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Box title="💪 Strengths" color="text-green" items={result.strengths} />
            <Box title="🧩 Gaps to close" color="text-gold" items={result.gaps} />
          </div>

          <div className="rounded-2xl bg-card border border-line/70 p-5">
            <div className="text-sm font-semibold text-brand">✅ Next 2 weeks</div>
            <ol className="mt-2 space-y-2">
              {(result.next || []).map((s, i) => (
                <li key={i} className="flex gap-3"><span className="shrink-0 w-6 h-6 rounded-full bg-brand/20 text-brand text-xs grid place-items-center font-bold">{i + 1}</span><span className="text-sm">{s}</span></li>
              ))}
            </ol>
          </div>

          <div>
            <h2 className="font-display font-bold text-xl">Proof: paths that actually worked</h2>
            <p className="text-mut text-sm mt-1">What people in {field} did to break in — and the one thing that made it click.</p>
            <div className="grid gap-4 mt-4">
              {(result.stories || []).map((s, i) => (
                <div key={i} className="rounded-2xl border border-line/70 card-grad p-5">
                  <div className="font-semibold">{s.profile}</div>
                  <p className="text-sm mt-2"><span className="text-mut">What they did: </span>{s.did}</p>
                  <p className="text-sm mt-1"><span className="text-green font-semibold">What made it work: </span>{s.worked}</p>
                  {s.timeline && <div className="text-xs text-mut mt-2">⏳ {s.timeline}</div>}
                </div>
              ))}
            </div>
            <p className="text-[12px] text-mut mt-3">Stories are representative success patterns (illustrative, not specific named individuals) — use them as proof of what works.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function Box({ title, color, items }) {
  return (
    <div className="rounded-2xl bg-card border border-line/70 p-5">
      <div className={`text-sm font-semibold ${color}`}>{title}</div>
      <ul className="mt-2 space-y-1.5">
        {(items || []).map((it, i) => <li key={i} className="flex gap-2 text-sm"><span className="text-mut">•</span><span>{it}</span></li>)}
      </ul>
    </div>
  );
}

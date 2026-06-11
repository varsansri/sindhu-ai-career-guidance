'use client';
import { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { COURSES, courseBySlug, allTopics, globalTopicKey } from '@/lib/courses';
import { useStore, fmtINR, fmtLPA, computeWorth } from '@/lib/store';
import { useCopilot } from '@/components/CopilotContext';

function worthMap() {
  const m = {};
  for (const c of COURSES) for (const t of allTopics(c)) m[globalTopicKey(c.slug, t.slug)] = t.worth;
  return m;
}

export default function CoursePage() {
  const { slug } = useParams();
  const router = useRouter();
  const course = courseBySlug(slug);
  const { state, ready, finishTopic, unfinishTopic, addLog } = useStore();

  const topics = useMemo(() => (course ? allTopics(course) : []), [course]);
  const [openUnits, setOpenUnits] = useState({});
  const [activeSlug, setActiveSlug] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [celebrate, setCelebrate] = useState(null);

  useEffect(() => {
    if (course) { setActiveSlug(course.units[0].topics[0].slug); setOpenUnits({ 0: true }); }
  }, [slug]);

  const { setPageContext } = useCopilot();
  useEffect(() => {
    if (!course || !activeSlug) return;
    const t = allTopics(course).find((x) => x.slug === activeSlug);
    if (t) setPageContext(t.title, `Topic: ${t.title}\n${t.intro}\nConcepts: ${t.concepts.join(', ')}\nSteps: ${t.steps.join(' ')}`);
    return () => setPageContext('', '');
  }, [slug, activeSlug]);

  if (!course) {
    return <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <p className="text-mut">Course not found.</p>
      <Link href="/courses" className="text-brand">← All courses</Link>
    </div>;
  }

  const done = state.done || {};
  const active = topics.find((t) => t.slug === activeSlug) || topics[0];
  const activeKey = globalTopicKey(course.slug, active.slug);
  const isDone = !!done[activeKey];
  const idx = topics.findIndex((t) => t.slug === active.slug);
  const finishedCount = topics.filter((t) => done[globalTopicKey(course.slug, t.slug)]).length;
  const wm = worthMap();
  const worth = computeWorth(state, wm);

  const goTo = (s) => { setActiveSlug(s); setSidebarOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleFinish = () => {
    if (isDone) return;
    const before = computeWorth(state, wm);
    finishTopic(activeKey, active.worth);
    addLog(`Finished “${active.title}” in ${course.short}`, course.slug);
    setCelebrate({ before, after: before + active.worth, title: active.title });
  };

  const Sidebar = (
    <aside className="thin-scroll lg:sticky lg:top-14 lg:self-start lg:max-h-[calc(100vh-3.5rem)] overflow-y-auto pr-1">
      <Link href="/courses" className="text-mut text-sm hover:text-white">← All courses</Link>
      <div className="mt-3 flex items-center gap-2">
        <span className="text-2xl">{course.icon}</span>
        <h2 className="font-display font-bold leading-tight">{course.title}</h2>
      </div>
      <div className="mt-1 text-xs text-mut">{finishedCount}/{topics.length} done · target {fmtLPA(course.salary.target)}</div>
      <div className="mt-4 space-y-1.5">
        {course.units.map((u, ui) => {
          const open = !!openUnits[ui];
          const uDone = u.topics.filter((t) => done[globalTopicKey(course.slug, t.slug)]).length;
          return (
            <div key={ui} className="rounded-xl border border-line/60 bg-card/60 overflow-hidden">
              <button onClick={() => setOpenUnits((o) => ({ ...o, [ui]: !o[ui] }))}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-left">
                <span className={`transition-transform text-mut ${open ? 'rotate-90' : ''}`}>▸</span>
                <span className="font-semibold text-sm flex-1">{u.title}</span>
                <span className="text-[11px] text-mut">{uDone}/{u.topics.length}</span>
              </button>
              <div className={`fold ${open ? 'open' : ''}`}>
                <div>
                  <ul className="pb-2">
                    {u.topics.map((t) => {
                      const tk = globalTopicKey(course.slug, t.slug);
                      const tDone = !!done[tk];
                      const tActive = t.slug === active.slug;
                      return (
                        <li key={t.slug}>
                          <button onClick={() => goTo(t.slug)}
                            className={`w-full text-left pl-9 pr-3 py-2 text-sm flex items-center gap-2 transition-colors ${tActive ? 'bg-brand/20 text-white' : 'text-mut hover:text-white hover:bg-card'}`}>
                            <span className={`shrink-0 w-4 ${tDone ? 'text-green' : 'text-line'}`}>{tDone ? '✓' : '○'}</span>
                            <span className="flex-1">{t.title}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* mobile worth + sidebar toggle */}
      <div className="lg:hidden flex items-center justify-between mb-4">
        <button onClick={() => setSidebarOpen((o) => !o)} className="px-3 py-2 rounded-lg border border-line text-sm">
          ☰ {course.short} units
        </button>
        <div className="text-sm text-mut">Worth <span className="text-white font-semibold">{ready ? fmtLPA(worth) : '—'}</span></div>
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-8">
        <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block`}>{Sidebar}</div>

        {/* content */}
        <article className="min-w-0">
          <div className="text-xs text-brand font-semibold uppercase tracking-wider">{active.unit}</div>
          <h1 className="font-display font-bold text-3xl mt-1">{active.title}</h1>
          <div className="flex gap-3 text-xs text-mut mt-2">
            <span>⏱ {active.read} min read</span>
            <span className="text-green">+{fmtINR(active.worth)}/yr on finish</span>
            <span>page {idx + 1} of {topics.length}</span>
          </div>

          <p className="mt-5 text-[15px] leading-relaxed">{active.intro}</p>

          <Section title="🧠 Concepts to know">
            <ul className="space-y-1.5">
              {active.concepts.map((c) => <li key={c} className="flex gap-2"><span className="text-brand">•</span><span>{c}</span></li>)}
            </ul>
          </Section>

          <Section title="✅ Do this, step by step">
            <ol className="space-y-2">
              {active.steps.map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-brand/20 text-brand text-xs grid place-items-center font-bold">{i + 1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </Section>

          <Section title="🔗 Go here (don’t just ask AI)">
            <div className="flex flex-wrap gap-2">
              {active.resources.map((r) => (
                <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer"
                  className="text-sm px-3 py-1.5 rounded-lg border border-line bg-card hover:border-brand/60 transition">
                  {r.label} ↗
                </a>
              ))}
            </div>
          </Section>

          {/* Finish bar */}
          <div className="mt-8 rounded-2xl border border-line/70 card-grad p-5 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="font-semibold">{isDone ? 'Page completed ✓' : 'Done reading & doing this?'}</div>
              <div className="text-mut text-sm">{isDone ? 'Counted toward your worth + streak.' : `Click finish to add +${fmtINR(active.worth)}/yr to your worth.`}</div>
            </div>
            {isDone
              ? <button onClick={() => unfinishTopic(activeKey)} className="px-4 py-2 rounded-xl border border-line text-sm text-mut hover:text-white">Undo</button>
              : <button onClick={handleFinish} className="px-5 py-2.5 rounded-xl bg-green text-ink font-bold hover:brightness-110 transition">Finish this page →</button>}
          </div>

          {/* prev / next */}
          <div className="mt-6 flex justify-between">
            <button disabled={idx === 0} onClick={() => goTo(topics[idx - 1].slug)}
              className="px-4 py-2 rounded-lg border border-line text-sm disabled:opacity-30">← Prev</button>
            <button disabled={idx === topics.length - 1} onClick={() => goTo(topics[idx + 1].slug)}
              className="px-4 py-2 rounded-lg border border-line text-sm disabled:opacity-30">Next →</button>
          </div>
        </article>
      </div>

      {/* Celebrate / worth timeline modal */}
      {celebrate && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" onClick={() => setCelebrate(null)}>
          <div className="rounded-2xl card-grad border border-line glow p-6 max-w-sm w-full text-center" onClick={(e) => e.stopPropagation()}>
            <div className="text-5xl">🎉</div>
            <div className="font-display font-bold text-xl mt-2">Worth unlocked</div>
            <p className="text-mut text-sm mt-1">You finished “{celebrate.title}”.</p>
            <div className="mt-4 flex items-center justify-center gap-3 text-2xl font-display font-bold">
              <span className="text-mut">{fmtLPA(celebrate.before)}</span>
              <span className="text-green">→</span>
              <span className="text-green">{fmtLPA(celebrate.after)}</span>
            </div>
            <div className="text-xs text-mut mt-1">{finishedCount}/{topics.length} pages in {course.short}</div>
            <div className="mt-5 flex gap-2">
              <button onClick={() => setCelebrate(null)} className="flex-1 px-4 py-2 rounded-xl border border-line text-sm">Keep going</button>
              <Link href="/log" className="flex-1 px-4 py-2 rounded-xl bg-brand text-white text-sm font-semibold">See my journey →</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mt-6">
      <h3 className="font-semibold text-brand">{title}</h3>
      <div className="mt-2 text-[15px] leading-relaxed">{children}</div>
    </div>
  );
}

'use client';
import Link from 'next/link';
import { COURSES, allTopics, topicCount, courseWorth, globalTopicKey } from '@/lib/courses';
import { useStore, fmtLPA } from '@/lib/store';

export default function CoursesPage() {
  const { state, ready } = useStore();
  const done = state.done || {};

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display font-bold text-3xl">Courses</h1>
      <p className="text-mut mt-1">Trend-based, guideline-style paths. Open a course, fold out its units, and finish pages to climb your worth.</p>

      <div className="grid sm:grid-cols-2 gap-5 mt-7">
        {COURSES.map((c) => {
          const topics = allTopics(c);
          const finished = ready ? topics.filter((t) => done[globalTopicKey(c.slug, t.slug)]).length : 0;
          const pct = Math.round((finished / topics.length) * 100);
          return (
            <Link key={c.slug} href={`/courses/${c.slug}`}
              className="rounded-2xl border border-line/70 card-grad p-6 hover:border-brand/60 transition glow">
              <div className="flex items-start gap-4">
                <div className="text-4xl">{c.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-display font-bold text-xl">{c.title}</h2>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-gold/15 text-gold">{c.trend}</span>
                  </div>
                  <p className="text-mut text-sm mt-1">{c.blurb}</p>
                </div>
              </div>
              <div className="flex gap-4 text-xs text-mut mt-4">
                <span>{c.units.length} units</span>
                <span>{topicCount(c)} pages</span>
                <span className="text-green">target {fmtLPA(c.salary.target)}</span>
              </div>
              {ready && finished > 0 && (
                <div className="mt-3">
                  <div className="h-1.5 rounded-full bg-ink overflow-hidden">
                    <div className="h-full" style={{ width: `${pct}%`, background: c.accent }} />
                  </div>
                  <div className="text-xs text-mut mt-1">{finished}/{topics.length} done</div>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

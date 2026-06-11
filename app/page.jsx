'use client';
import Link from 'next/link';
import { COURSES, allTopics, topicCount, courseWorth, globalTopicKey } from '@/lib/courses';
import { useStore, computeWorth, computeStreak, fmtLPA, fmtINR } from '@/lib/store';

function worthMap() {
  const m = {};
  for (const c of COURSES) for (const t of allTopics(c)) m[globalTopicKey(c.slug, t.slug)] = t.worth;
  return m;
}

export default function Home() {
  const { state, ready } = useStore();
  const wm = worthMap();
  const worth = computeWorth(state, wm);
  const streak = computeStreak(state);
  const doneCount = Object.keys(state.done || {}).length;
  const started = ready && (state.quiz || doneCount > 0);

  return (
    <div className="mx-auto max-w-6xl px-4">
      {/* Trend banner */}
      <div className="mt-5 rounded-xl border border-line/70 card-grad px-4 py-2.5 text-[13px] sm:text-sm flex items-center gap-2 flex-wrap">
        <span className="text-gold font-semibold">📈 Trend-based</span>
        <span className="text-mut">career guidance for college-out students — the exact skills you need to earn the salary you expect.</span>
      </div>

      {/* Hero */}
      <section className="mt-8 sm:mt-12 grid lg:grid-cols-[1.3fr_1fr] gap-8 items-center">
        <div>
          <h1 className="font-display font-bold leading-[1.05] text-4xl sm:text-5xl">
            Just finished college?<br />
            <span className="text-brand">Find the gap</span> between<br />
            where you are and the <span className="text-gold">salary</span> you want.
          </h1>
          <p className="mt-4 text-mut max-w-xl">
            Not another course dump. A guided, trend-aware path — read this, build that, go here —
            so you stop endlessly asking AI and start moving. Finish steps, watch your market worth climb.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/quiz" className="px-5 py-3 rounded-xl bg-brand text-white font-semibold glow hover:brightness-110 transition">
              {started ? 'Continue my plan →' : 'Find my skill gap →'}
            </Link>
            <Link href="/courses" className="px-5 py-3 rounded-xl border border-line text-white font-semibold hover:bg-card transition">
              Browse the courses
            </Link>
          </div>
        </div>

        {/* Worth card */}
        <div className="rounded-2xl card-grad border border-line/70 glow p-5">
          <div className="text-mut text-xs uppercase tracking-wider">Your current market worth</div>
          <div className="font-display font-bold text-4xl mt-1">{ready ? fmtINR(worth) : '—'}<span className="text-mut text-base font-normal">/yr</span></div>
          <div className="text-green text-sm mt-1">{ready ? fmtLPA(worth) : ''}</div>
          <div className="mt-4 h-2 rounded-full bg-ink overflow-hidden">
            <div className="h-full bg-gradient-to-r from-brand to-brand2"
              style={{ width: `${ready ? Math.min(100, ((worth - (state.baseWorth || 0)) / ((state.targetWorth || 1) - (state.baseWorth || 1))) * 100) : 0}%` }} />
          </div>
          <div className="flex justify-between text-xs text-mut mt-1.5">
            <span>start {fmtLPA(state.baseWorth || 300000)}</span>
            <span>goal {fmtLPA(state.targetWorth || 1200000)}</span>
          </div>
          <div className="mt-4 flex gap-4 text-sm">
            <div><span className="font-bold text-gold">{streak}</span> <span className="text-mut">day streak 🔥</span></div>
            <div><span className="font-bold">{doneCount}</span> <span className="text-mut">steps done</span></div>
          </div>
        </div>
      </section>

      {/* Salary categories / consultancy */}
      <section className="mt-14">
        <h2 className="font-display font-bold text-2xl">Pick your salary path</h2>
        <p className="text-mut text-sm mt-1">What pay do you want — and what’s the realistic way to get there?</p>
        <div className="grid sm:grid-cols-3 gap-4 mt-5">
          {[
            ['₹3–6 LPA', 'First job', 'Land your first role fast with one solid skill + a real project.'],
            ['₹6–12 LPA', 'Level up', 'Specialise (DSA, ML, full-stack, cloud) and ship proof recruiters trust.'],
            ['₹12+ LPA', 'High demand', 'Trend skills (AI/LLMs, cloud, data engineering) where companies overpay.'],
          ].map(([band, tag, desc]) => (
            <Link key={band} href="/consultancy" className="rounded-2xl border border-line/70 bg-card p-5 hover:border-brand/60 transition group">
              <div className="text-xs text-brand font-semibold">{tag}</div>
              <div className="font-display font-bold text-2xl mt-1">{band}</div>
              <p className="text-mut text-sm mt-2">{desc}</p>
              <div className="text-brand text-sm mt-3 group-hover:translate-x-1 transition">See the path →</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Courses that worked */}
      <section className="mt-14">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display font-bold text-2xl">Guided courses that actually work</h2>
            <p className="text-mut text-sm mt-1">Open one → units fold out → finish each page to grow your worth.</p>
          </div>
          <Link href="/courses" className="text-brand text-sm hidden sm:block">All courses →</Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mt-5">
          {COURSES.map((c) => (
            <Link key={c.slug} href={`/courses/${c.slug}`}
              className="rounded-2xl border border-line/70 bg-card p-5 hover:border-brand/60 transition flex gap-4">
              <div className="text-3xl">{c.icon}</div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{c.short}</h3>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-gold/15 text-gold">{c.trend}</span>
                </div>
                <p className="text-mut text-sm mt-1 line-clamp-2">{c.blurb}</p>
                <div className="text-xs text-mut mt-2 flex gap-3">
                  <span>{topicCount(c)} pages</span>
                  <span className="text-green">up to +{fmtLPA(courseWorth(c))}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

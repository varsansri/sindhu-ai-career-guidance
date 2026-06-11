'use client';
import { useState } from 'react';
import Link from 'next/link';
import { COURSES } from '@/lib/courses';
import { fmtLPA } from '@/lib/store';
import Icon from '@/components/Icon';

const BANDS = [
  {
    id: 'first', label: '₹3–6 LPA', tag: 'Get hired first',
    ways: ['Master ONE skill end-to-end (web dev is fastest to show).', 'Ship 2 real, deployed projects.', 'Apply to 30+ junior roles + 2 freelance gigs.'],
    gap: 'Usually a “proof” gap — you may know things, but nothing is visible. Fix it with public projects.',
    courses: ['web-app-development', 'computer-science'], weeks: '6–10 weeks',
  },
  {
    id: 'solid', label: '₹6–12 LPA', tag: 'Solid career start',
    ways: ['Go deep in DSA or one specialisation.', 'Add a back-end / data / cloud skill on top.', 'Get 1 certification + a strong GitHub.'],
    gap: 'A “depth” gap — you can do basics but not yet interview-grade. Close it with DSA + a specialisation.',
    courses: ['computer-science', 'data-science-ai'], weeks: '3–5 months',
  },
  {
    id: 'high', label: '₹12+ LPA', tag: 'High-demand pay',
    ways: ['Pick a scarce, trend skill: AI/LLMs, data engineering, cloud/DevOps.', 'Build something impressive others can use.', 'Get a recognised cloud/ML credential.'],
    gap: 'A “scarcity” gap — common skills pay average. Learn what few do but many companies need.',
    courses: ['data-science-ai', 'cloud-devops'], weeks: '4–7 months',
  },
];

export default function Consultancy() {
  const [active, setActive] = useState('solid');
  const band = BANDS.find((b) => b.id === active);
  const courses = band.courses.map((s) => COURSES.find((c) => c.slug === s));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="font-display font-bold text-3xl">Salary paths</h1>
      <p className="text-mut mt-1">Pick the pay you want. We’ll show the realistic gap, the ways across it, and the courses that already work.</p>

      <div className="flex flex-wrap gap-2 mt-6">
        {BANDS.map((b) => (
          <button key={b.id} onClick={() => setActive(b.id)}
            className={`px-4 py-2.5 rounded-xl border transition ${active === b.id ? 'bg-brand/20 border-brand text-white' : 'bg-card border-line text-mut hover:text-white'}`}>
            <span className="font-display font-bold">{b.label}</span> <span className="text-xs">· {b.tag}</span>
          </button>
        ))}
      </div>

      <div className="mt-7 grid md:grid-cols-2 gap-5">
        <div className="rounded-2xl card-grad border border-line/70 p-6">
          <div className="text-xs text-brand font-semibold uppercase tracking-wider">The career gap</div>
          <p className="mt-2 leading-relaxed">{band.gap}</p>
          <div className="mt-4 text-xs text-mut">Typical time to close: <span className="text-white font-semibold">{band.weeks}</span></div>
        </div>
        <div className="rounded-2xl bg-card border border-line/70 p-6">
          <div className="text-xs text-green font-semibold uppercase tracking-wider">Ways to get there</div>
          <ul className="mt-3 space-y-2.5">
            {band.ways.map((w, i) => (
              <li key={i} className="flex gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-green/15 text-green text-xs grid place-items-center font-bold">{i + 1}</span>
                <span className="text-sm">{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <h2 className="font-display font-bold text-xl mt-9">Courses that work for {band.label}</h2>
      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        {courses.map((c) => (
          <Link key={c.slug} href={`/courses/${c.slug}`}
            className="rounded-2xl border border-line/70 bg-card p-5 hover:border-brand/60 transition flex gap-4">
            <div className="shrink-0 w-11 h-11 rounded-xl grid place-items-center bg-brand/15" style={{ color: c.accent }}><Icon name={c.icon} size={24} /></div>
            <div>
              <h3 className="font-semibold">{c.title}</h3>
              <p className="text-mut text-sm mt-1 line-clamp-2">{c.blurb}</p>
              <div className="text-green text-xs mt-2">reaches {fmtLPA(c.salary.target)}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-9 rounded-2xl card-grad border border-line/70 p-6 text-center">
        <p className="text-mut">Not sure which band is realistic for you right now?</p>
        <Link href="/quiz" className="mt-3 inline-block px-5 py-3 rounded-xl bg-brand text-ink font-semibold">Find my skill gap →</Link>
      </div>
    </div>
  );
}

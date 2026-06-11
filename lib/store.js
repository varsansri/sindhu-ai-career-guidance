'use client';
import { useEffect, useState, useCallback } from 'react';

const KEY = 'sacg_v1';
const DEFAULT = {
  baseWorth: 300000,      // set by the quiz (current market worth)
  targetWorth: 1200000,   // set by the quiz (desired salary)
  done: {},               // { "course/topic": ISO timestamp }
  log: [],                // [{ date, note, courseSlug }]
  quiz: null,             // raw quiz answers + result
  lastVisit: null,
};

function read() {
  if (typeof window === 'undefined') return { ...DEFAULT };
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : { ...DEFAULT };
  } catch { return { ...DEFAULT }; }
}
function write(state) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(state));
  window.dispatchEvent(new Event('sacg-change'));
}

export function useStore() {
  const [state, setState] = useState(DEFAULT);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(read());
    setReady(true);
    const on = () => setState(read());
    window.addEventListener('sacg-change', on);
    window.addEventListener('storage', on);
    return () => { window.removeEventListener('sacg-change', on); window.removeEventListener('storage', on); };
  }, []);

  const update = useCallback((patch) => {
    const next = { ...read(), ...(typeof patch === 'function' ? patch(read()) : patch) };
    write(next);
    setState(next);
  }, []);

  const finishTopic = useCallback((key, worth) => {
    const s = read();
    if (s.done[key]) return s;
    const next = { ...s, done: { ...s.done, [key]: new Date().toISOString() }, lastVisit: new Date().toISOString() };
    write(next); setState(next); return next;
  }, []);

  const unfinishTopic = useCallback((key) => {
    const s = read(); const done = { ...s.done }; delete done[key];
    const next = { ...s, done }; write(next); setState(next);
  }, []);

  const addLog = useCallback((note, courseSlug) => {
    const s = read();
    const next = { ...s, log: [{ date: new Date().toISOString(), note, courseSlug }, ...s.log].slice(0, 200) };
    write(next); setState(next);
  }, []);

  return { state, ready, update, finishTopic, unfinishTopic, addLog };
}

// Worth = base + sum of finished topic worths (capped at target won't apply; we let it grow).
export function computeWorth(state, coursesWorthMap) {
  let w = state.baseWorth || DEFAULT.baseWorth;
  for (const key of Object.keys(state.done || {})) {
    w += coursesWorthMap[key] || 0;
  }
  return w;
}

// Streak = number of distinct consecutive days (ending today) that have a finish or a log.
export function computeStreak(state) {
  const days = new Set();
  for (const ts of Object.values(state.done || {})) days.add(ts.slice(0, 10));
  for (const l of state.log || []) days.add(l.date.slice(0, 10));
  if (!days.size) return 0;
  let streak = 0;
  const d = new Date();
  for (;;) {
    const key = d.toISOString().slice(0, 10);
    if (days.has(key)) { streak++; d.setDate(d.getDate() - 1); }
    else break;
  }
  return streak;
}

export const fmtINR = (n) =>
  '₹' + Math.round(n).toLocaleString('en-IN');
export const fmtLPA = (n) => (n / 100000).toFixed(1) + ' LPA';

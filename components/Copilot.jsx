'use client';
import { useState, useRef, useEffect } from 'react';
import { useCopilot } from './CopilotContext';
import { useStore } from '@/lib/store';
import Icon from './Icon';

export default function Copilot() {
  const { ctx } = useCopilot();
  const { state } = useStore();
  const goal = state?.quiz?.dream || state?.quiz?.courseTitle || '';
  const [open, setOpen] = useState(false);        // mobile drawer
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, loading]);

  const send = async (text) => {
    const q = (text ?? input).trim();
    if (!q || loading) return;
    const next = [...msgs, { role: 'user', content: q }];
    setMsgs(next); setInput(''); setLoading(true);
    try {
      const r = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next, context: ctx.content ? `${ctx.title}\n${ctx.content}` : '', goal }),
      });
      const j = await r.json();
      setMsgs((m) => [...m, { role: 'assistant', content: j.text || (j.reason === 'no-key'
        ? 'I’m almost ready — add OPENAI_API_KEY in Vercel and I’ll explain anything on your screen.'
        : 'Hmm, I couldn’t answer that just now. Try again?') }]);
    } catch {
      setMsgs((m) => [...m, { role: 'assistant', content: 'Network hiccup — try again.' }]);
    }
    setLoading(false);
  };

  const quick = ctx.title
    ? [`Explain this simpler`, `How does this help my salary?`, `Quiz me on this`]
    : [`What should I learn first?`, `What pays the most right now?`, `Review my plan`];

  const Panel = (
    <div className="flex flex-col h-full bg-panel">
      <div className="px-4 py-3 border-b border-line/60 flex items-center gap-2">
        <span className="text-brand"><Icon name="bee" size={22} /></span>
        <div className="min-w-0">
          <div className="font-semibold text-sm leading-none">Bee — your AI co-pilot</div>
          <div className="text-[11px] text-mut truncate mt-0.5">{ctx.title ? `Watching: ${ctx.title}` : 'Ask me anything as you browse'}</div>
        </div>
        <button onClick={() => setOpen(false)} className="lg:hidden ml-auto text-mut px-1"><Icon name="close" size={18} /></button>
      </div>

      <div className="flex-1 overflow-y-auto thin-scroll px-3 py-3 space-y-3">
        {msgs.length === 0 && (
          <div className="text-sm text-mut">
            Hi! I can see what you’re reading and help you understand it deeper —
            {ctx.title ? <> right now that’s <span className="text-white">“{ctx.title}”</span>.</> : <> open a course or the news and ask away.</>}
          </div>
        )}
        {msgs.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : ''}>
            <div className={`inline-block max-w-[88%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap leading-relaxed ${m.role === 'user' ? 'bg-brand text-ink' : 'bg-card border border-line/60'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && <div className="text-sm text-mut animate-pulse">Bee is thinking…</div>}
        <div ref={endRef} />
      </div>

      <div className="px-3 pb-2 flex flex-wrap gap-1.5">
        {quick.map((q) => (
          <button key={q} onClick={() => send(q)} disabled={loading}
            className="text-[11px] px-2.5 py-1 rounded-full border border-line text-mut hover:text-white hover:border-brand/60 transition disabled:opacity-50">{q}</button>
        ))}
      </div>
      <div className="p-3 border-t border-line/60 flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Ask Bee about this…"
          className="flex-1 bg-card border border-line rounded-xl px-3 py-2 text-sm outline-none focus:border-brand" />
        <button onClick={() => send()} disabled={loading} className="px-3 py-2 rounded-xl bg-brand text-ink disabled:opacity-50 grid place-items-center"><Icon name="send" size={18} /></button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: fixed right rail */}
      <div className="hidden lg:flex fixed top-14 right-0 bottom-0 w-[340px] border-l border-line/60 z-30">{Panel}</div>

      {/* Mobile: floating bee + drawer */}
      <button onClick={() => setOpen(true)} aria-label="Open AI co-pilot"
        className="lg:hidden fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-brand text-ink grid place-items-center glow"><Icon name="bee" size={26} /></button>
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col">
          <div className="flex-1 bg-black/50" onClick={() => setOpen(false)} />
          <div className="h-[78vh] rounded-t-2xl overflow-hidden border-t border-line">{Panel}</div>
        </div>
      )}
    </>
  );
}

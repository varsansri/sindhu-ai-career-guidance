// Grok (xAI) career-coach endpoint. Key stays server-side (Vercel env: XAI_API_KEY).
// Gracefully returns { text: null } when no key is set, so the app still works.
export const runtime = 'edge';

const XAI_URL = 'https://api.x.ai/v1/chat/completions';
const MODEL = process.env.XAI_MODEL || 'grok-2-latest';

const fmtL = (n) => (Number(n || 0) / 100000).toFixed(1) + ' LPA';

function buildPrompt(body) {
  if (body.kind === 'plan') {
    const a = body.answers || {};
    return `You are a sharp, encouraging career coach for fresh college graduates in India.
The student: current level "${a.level}", aiming for ${fmtL(body.target)}, interested in ${body.course},
can study ${a.time}/day${a.dream ? `, dream role: "${a.dream}"` : ''}. Current worth ~${fmtL(body.base)}.
Give a punchy, trend-aware action plan to close the gap. Format:
- 1 line of honest reality.
- "Next 7 days:" 3 concrete tasks.
- "Next 30 days:" 3 milestones.
- "The trend edge:" 1 in-demand skill that pays more right now.
Keep it under 150 words, no fluff, India job-market context.`;
  }
  // daily
  return `You are a daily career coach. Student is doing the "${body.course}" path, finished ${body.doneCount} steps,
streak ${body.streak} days, worth ~${fmtL(body.base)} heading to ${fmtL(body.target)}.
Give TODAY's micro-plan: 2-3 specific actions (what to read/watch/build, where), under 90 words,
so they don't have to keep asking AI from scratch. End with one motivating line tied to their salary goal.`;
}

export async function POST(req) {
  const key = process.env.XAI_API_KEY;
  let body = {};
  try { body = await req.json(); } catch {}
  if (!key) return Response.json({ text: null, reason: 'no-key' });

  try {
    const r = await fetch(XAI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.7,
        messages: [
          { role: 'system', content: 'You are a concise, motivating career coach. Use plain text, short lines, no markdown headers.' },
          { role: 'user', content: buildPrompt(body) },
        ],
      }),
    });
    if (!r.ok) return Response.json({ text: null, reason: `xai-${r.status}` });
    const j = await r.json();
    const text = j?.choices?.[0]?.message?.content?.trim() || null;
    return Response.json({ text });
  } catch (e) {
    return Response.json({ text: null, reason: 'error' });
  }
}

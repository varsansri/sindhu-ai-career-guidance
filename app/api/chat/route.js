// Page-aware co-pilot chat. Sees what the user is currently looking at (context) and helps
// them understand it deeper. Multi-turn.
import { callAI } from '@/lib/aiProvider';
export const runtime = 'edge';

export async function POST(req) {
  let body = {};
  try { body = await req.json(); } catch {}
  const { messages = [], context = '', goal = '' } = body;

  const system = `You are "Bee", an on-screen AI study co-pilot inside a career-guidance app for fresh college graduates in India.
You are watching the same screen as the user and help them understand it deeper, simply, and practically.
${goal ? `The user's career goal: ${goal}.` : ''}
${context ? `WHAT THE USER IS CURRENTLY LOOKING AT:\n"""${String(context).slice(0, 4000)}"""` : 'The user is browsing the app.'}
Rules: be concise and warm, use short lines, plain text (no markdown headers). Explain like a smart senior, give concrete next steps and real resources/links when useful, and always tie advice back to getting hired / their salary goal. If they paste or ask about news or a topic on screen, explain the whole thing clearly in simple terms.`;

  const trimmed = messages.slice(-12).map((m) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: String(m.content || '').slice(0, 2000) }));
  const { text, reason } = await callAI([{ role: 'system', content: system }, ...trimmed], { temperature: 0.6, max_tokens: 700 });
  return Response.json({ text, reason: reason || null });
}

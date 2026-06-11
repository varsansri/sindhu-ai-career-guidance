// AI trend/news briefings tailored to the user's goal field. Returns structured items.
// Note: these are AI-composed trend briefings (not a live news wire) — framed as trends/signals.
import { callAI } from '@/lib/aiProvider';
export const runtime = 'edge';

export async function POST(req) {
  let body = {};
  try { body = await req.json(); } catch {}
  const { field = 'tech careers', goal = '' } = body;

  const system = 'You output ONLY valid JSON. No prose outside JSON.';
  const user = `Generate 6 current, high-signal career TREND briefings for someone breaking into "${field}"${goal ? ` aiming for "${goal}"` : ''} in the Indian job market.
Each should reflect what is genuinely in demand and paying now, and what opportunity it creates for a fresher.
Return JSON: { "items": [ { "title": "punchy headline", "tag": "one of: Hiring | Skill | Tool | Salary | Opportunity", "summary": "2 sentences on the trend", "why": "1 sentence: why it matters for THEIR goal", "action": "1 concrete thing to do this week" } ] }
Keep it realistic, specific (name actual tools/skills/companies where apt), and India-relevant.`;

  const { text } = await callAI([{ role: 'system', content: system }, { role: 'user', content: user }], { temperature: 0.7, max_tokens: 1100, json: true });
  if (!text) return Response.json({ items: null });
  try {
    const parsed = JSON.parse(text);
    return Response.json({ items: Array.isArray(parsed.items) ? parsed.items.slice(0, 8) : null });
  } catch {
    return Response.json({ items: null });
  }
}

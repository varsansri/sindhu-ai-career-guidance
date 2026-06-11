// Resume analysis + "success proof": representative success paths in the chosen field showing
// what those people actually did and what made it work. (Representative patterns, not named real people.)
import { callAI } from '@/lib/aiProvider';
export const runtime = 'edge';

export async function POST(req) {
  let body = {};
  try { body = await req.json(); } catch {}
  const { resume = '', field = 'tech', goal = '' } = body;
  if (!resume.trim()) return Response.json({ result: null, reason: 'empty' });

  const system = 'You output ONLY valid JSON. No prose outside JSON.';
  const user = `A fresh graduate wants to break into "${field}"${goal ? ` (dream: "${goal}")` : ''}. Here is their resume / background:
"""${String(resume).slice(0, 6000)}"""

Analyse it and return JSON:
{
  "verdict": "1-2 honest sentences on where they stand",
  "strengths": ["2-4 real strengths from the resume"],
  "gaps": ["2-4 specific missing things blocking the goal"],
  "next": ["3 concrete actions to do in the next 2 weeks"],
  "stories": [
    { "profile": "short label e.g. 'Tier-3 college grad → Data Analyst'", "did": "what they actually did to break in (specific)", "worked": "the ONE thing that made it click", "timeline": "rough time it took" }
  ]
}
Give 3 "stories" — realistic, representative success PATHS in ${field} for Indian freshers (illustrative patterns of what works, not invented named individuals). Make them concrete and motivating, focused on what genuinely works.`;

  const { text } = await callAI([{ role: 'system', content: system }, { role: 'user', content: user }], { temperature: 0.6, max_tokens: 1200, json: true });
  if (!text) return Response.json({ result: null });
  try { return Response.json({ result: JSON.parse(text) }); }
  catch { return Response.json({ result: null }); }
}

// Shared AI caller. Works with OpenAI (OPENAI_API_KEY) or Grok/xAI (XAI_API_KEY).
// Edge-safe (no node deps). Returns null when no key / on error so the UI degrades gracefully.

export function provider() {
  if (process.env.OPENAI_API_KEY)
    return { key: process.env.OPENAI_API_KEY, url: 'https://api.openai.com/v1/chat/completions', model: process.env.OPENAI_MODEL || 'gpt-4o-mini' };
  if (process.env.XAI_API_KEY)
    return { key: process.env.XAI_API_KEY, url: 'https://api.x.ai/v1/chat/completions', model: process.env.XAI_MODEL || 'grok-2-latest' };
  return null;
}

export async function callAI(messages, opts = {}) {
  const p = provider();
  if (!p) return { text: null, reason: 'no-key' };
  try {
    const r = await fetch(p.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${p.key}` },
      body: JSON.stringify({
        model: p.model,
        temperature: opts.temperature ?? 0.7,
        max_tokens: opts.max_tokens ?? 800,
        ...(opts.json ? { response_format: { type: 'json_object' } } : {}),
        messages,
      }),
    });
    if (!r.ok) return { text: null, reason: `ai-${r.status}` };
    const j = await r.json();
    return { text: j?.choices?.[0]?.message?.content?.trim() || null };
  } catch {
    return { text: null, reason: 'error' };
  }
}

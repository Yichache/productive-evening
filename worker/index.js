// Cloudflare Worker: AI Insights Proxy for Evening Portal
// Deploy: wrangler deploy
// Set secret: wrangler secret put ANTHROPIC_API_KEY

const SYSTEM_PROMPT = `You are an evening routine coach analyzing a user's daily logs and Kolb's improvement cycles.

The user tracks their evening routine with:
- Daily logs: date, energy level (1-3), day tags (what happened before the evening), activity performed, and a short reflection
- Kolb's cycles: iterative improvement loops for specific problems, each with Experience → Reflection → Abstraction → Experiment → Result

Your job is to:
1. Identify patterns across daily logs (recurring tags, energy correlations, activity preferences)
2. Suggest which Kolb's cycles to prioritize or what new cycles to open
3. Propose specific experiments based on behavioral science and the user's own history
4. Highlight pre-evening factors that consistently affect evening quality

Be concise, direct, and actionable. Use the user's own data — don't give generic advice. If there's not enough data yet, say so honestly.`;

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return jsonResponse({ error: 'POST only' }, 405);
    }

    // Rate limiting: 1 call per day per IP
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const rateLimitKey = `rate:${ip}:${new Date().toISOString().slice(0, 10)}`;
    const cached = await env.RATE_LIMIT?.get(rateLimitKey);
    if (cached) {
      return jsonResponse({ error: 'Rate limit: 1 insight per day. Try again tomorrow.' }, 429);
    }

    try {
      const { logs, cycles } = await request.json();

      if (!logs || logs.length === 0) {
        return jsonResponse({ analysis: 'Not enough data yet. Complete a few evening sessions first, then come back for insights.' });
      }

      const userMessage = `Here are my recent evening logs and Kolb's cycles. Please analyze and give me insights.

## Daily Logs (most recent first)
${JSON.stringify(logs.slice(-14), null, 2)}

## Kolb's Cycles
${JSON.stringify(cycles, null, 2)}

Give me:
1. Key patterns you see in my logs
2. Pre-evening factors that seem to affect my energy
3. Suggestions for my active Kolb's cycles (or new cycles to start)
4. One specific experiment to try this week`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userMessage }],
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        return jsonResponse({ error: `API error: ${response.status}` }, 502);
      }

      const data = await response.json();
      const analysis = data.content?.[0]?.text || 'No analysis returned.';

      // Set rate limit (expires at end of day)
      if (env.RATE_LIMIT) {
        await env.RATE_LIMIT.put(rateLimitKey, '1', { expirationTtl: 86400 });
      }

      return jsonResponse({ analysis });
    } catch (err) {
      return jsonResponse({ error: 'Internal error: ' + err.message }, 500);
    }
  },
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

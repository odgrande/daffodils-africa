const https = require('https');

function groqRequest(apiKey, messages) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: messages,
      max_tokens: 250,
      temperature: 0.65,
    });
    const options = {
      hostname: 'api.groq.com',
      path: '/openai/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };
    const req = https.request(options, (r) => {
      let data = '';
      r.on('data', c => data += c);
      r.on('end', () => {
        try { resolve({ status: r.statusCode, body: JSON.parse(data) }); }
        catch(e) { reject(new Error('Parse error: ' + data.slice(0,100))); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GROQ_API_KEY;

  // DEBUG: show key status (first 8 chars only for security)
  if (!apiKey) {
    return res.status(200).json({
      reply: "⚠️ DEBUG: No API key found in environment. Go to Vercel → Settings → Environment Variables → check GROQ_API_KEY is set AND redeploy."
    });
  }

  let body = {};
  try { body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {}); } catch(e){}
  const { message, history = [] } = body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  const SYSTEM = `You are Daffy, the friendly assistant for Daffodils Africa — a Nigerian social enterprise implementing social impact projects across Africa.

STRICT RULE: ONLY answer questions about Daffodils Africa. For anything unrelated say: "I can only help with Daffodils Africa questions! Email daffodilsafrica@gmail.com or call +234 816 787 3722 💛"

ABOUT DAFFODILS AFRICA:
- Social enterprise: high-impact projects for individuals, organisations and government
- Services: Project Design, Community Development, Impact Campaigns, Monitoring & Evaluation
- Special: CSR Made Easy, Celebrate with Impact, Tourist with a Difference
- Academy: Launching Q4 2026 — 6 courses on social impact topics
- Impact: 3,000+ lives, 10 projects across Lagos, Taraba and Jos
- Contact: +234 816 787 3722 | daffodilsafrica@gmail.com | Lagos Nigeria
- Founder: Ifeoluwa Oyebisi | Social: @daffodils_africa

Keep replies warm, under 120 words. Always end with a clear action step.`;

  try {
    const messages = [
      { role: 'system', content: SYSTEM },
      ...history.slice(-6),
      { role: 'user', content: message }
    ];

    const result = await groqRequest(apiKey, messages);

    if (result.status !== 200) {
      // DEBUG: show actual Groq error so we can diagnose
      const errMsg = result.body?.error?.message || JSON.stringify(result.body).slice(0, 150);
      console.error('Groq error:', result.status, errMsg);
      return res.status(200).json({
        reply: `⚠️ DEBUG (${result.status}): ${errMsg} | Key starts: ${apiKey.slice(0,8)}...`
      });
    }

    const reply = result.body?.choices?.[0]?.message?.content?.trim();
    if (!reply) throw new Error('Empty reply');
    res.status(200).json({ reply });

  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(200).json({
      reply: `⚠️ DEBUG ERROR: ${err.message.slice(0,150)} | Key starts: ${apiKey ? apiKey.slice(0,8) : 'NONE'}...`
    });
  }
};

// Daffodils Africa — Daffy Chat
// Node 24 has fetch built-in — no https module needed

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const key = process.env.GROQ_API_KEY;
  const msg = (req.body && req.body.message) ? req.body.message : '';
  const hist = (req.body && req.body.history) ? req.body.history : [];

  if (!key) return res.json({ reply: "Please email daffodilsafrica@gmail.com or call +234 816 787 3722 💛" });
  if (!msg) return res.status(400).json({ error: 'No message' });

  const SYSTEM = `You are Daffy, the friendly assistant for Daffodils Africa — a Nigerian social enterprise implementing high-impact social projects across Africa. ONLY answer questions about Daffodils Africa. For anything unrelated say: "I can only help with Daffodils Africa questions! Email daffodilsafrica@gmail.com 💛". Keep replies under 120 words. Always end with an action step. Key info: Contact +234 816 787 3722 | daffodilsafrica@gmail.com | Lagos | Founder: Ifeoluwa Oyebisi | Services: Project Design, CSR, Community Dev, M&E | Academy launching Q4 2026 | 3000+ lives reached.`;

  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [{ role: 'system', content: SYSTEM }, ...hist.slice(-6), { role: 'user', content: msg }],
        max_tokens: 200,
        temperature: 0.7
      })
    });

    const d = await r.json();
    if (!r.ok) {
      console.error('Groq API error', r.status, JSON.stringify(d));
      return res.json({ reply: "Please email daffodilsafrica@gmail.com or call +234 816 787 3722 💛" });
    }
    res.json({ reply: d.choices[0].message.content.trim() });

  } catch(e) {
    console.error('Chat handler exception', e.message);
    res.json({ reply: "Please email daffodilsafrica@gmail.com or call +234 816 787 3722 💛" });
  }
};

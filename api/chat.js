// Daffodils Africa — Daffy Chat (OpenAI)

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const key = process.env.OPENAI_API_KEY;
  const msg = (req.body && req.body.message) ? req.body.message : '';
  const hist = (req.body && req.body.history) ? req.body.history : [];

  if (!key) return res.json({ reply: "Please email daffodilsafrica@gmail.com or call +234 816 787 3722 💛" });
  if (!msg) return res.status(400).json({ error: 'No message' });

  const SYSTEM = `You are Daffy, the friendly assistant for Daffodils Africa — a Nigerian social enterprise implementing high-impact social projects across Africa. ONLY answer questions about Daffodils Africa. For anything unrelated say: "I can only help with Daffodils Africa questions! Email daffodilsafrica@gmail.com 💛". Keep replies under 120 words. Always end with an action step. Key info: Contact +234 816 787 3722 | daffodilsafrica@gmail.com | Lagos | Founder: Ifeoluwa Oyebisi | Services: Project Design, CSR, Community Dev, M&E | Academy launching Q4 2026 | 3000+ lives reached.`;

  try {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + key
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: SYSTEM }].concat(hist.slice(-6)).concat([{ role: 'user', content: msg }]),
        max_tokens: 200,
        temperature: 0.7
      })
    });

    const d = await r.json();
    if (!r.ok) {
      console.error('OpenAI error', r.status, JSON.stringify(d));
      return res.json({ reply: "Please email daffodilsafrica@gmail.com or call +234 816 787 3722 💛" });
    }
    const reply = d.choices && d.choices[0] && d.choices[0].message && d.choices[0].message.content;
    res.json({ reply: reply ? reply.trim() : "Please email daffodilsafrica@gmail.com or call +234 816 787 3722 💛" });

  } catch(e) {
    console.error('Chat handler exception', e.message);
    res.json({ reply: "Please email daffodilsafrica@gmail.com or call +234 816 787 3722 💛" });
  }
};

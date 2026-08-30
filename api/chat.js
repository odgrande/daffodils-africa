// Daffodils Africa — Daffy Chat (native Gemini API)

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const key = process.env.GEMINI_API_KEY;
  const msg = (req.body && req.body.message) ? req.body.message : '';
  const hist = (req.body && req.body.history) ? req.body.history : [];

  if (!key) return res.json({ reply: "Please email daffodilsafrica@gmail.com or call +234 816 787 3722 💛" });
  if (!msg) return res.status(400).json({ error: 'No message' });

  const SYSTEM = `You are Daffy, the friendly assistant for Daffodils Africa — a Nigerian social enterprise implementing high-impact social projects across Africa. ONLY answer questions about Daffodils Africa. For anything unrelated say: "I can only help with Daffodils Africa questions! Email daffodilsafrica@gmail.com 💛". Keep replies under 120 words. Always end with an action step. Key info: Contact +234 816 787 3722 | daffodilsafrica@gmail.com | Lagos | Founder: Ifeoluwa Oyebisi | Services: Project Design, CSR, Community Dev, M&E | Academy launching Q4 2026 | 3000+ lives reached.`;

  // Convert OpenAI-style history to Gemini format (user/model roles)
  const contents = hist.slice(-6).map(function(m) {
    return { role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] };
  });
  contents.push({ role: 'user', parts: [{ text: msg }] });

  try {
    const r = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=' + key,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM }] },
          contents: contents,
          generationConfig: {
            maxOutputTokens: 300,
            temperature: 0.7,
            thinkingConfig: { thinkingBudget: 0 }
          }
        })
      }
    );

    const d = await r.json();
    if (!r.ok) {
      console.error('Gemini API error', r.status, JSON.stringify(d));
      return res.json({ reply: "Please email daffodilsafrica@gmail.com or call +234 816 787 3722 💛" });
    }
    // Filter out thought parts, keep only the final answer text
    const parts = d.candidates && d.candidates[0] && d.candidates[0].content && d.candidates[0].content.parts;
    const replyPart = parts && parts.find(function(p) { return !p.thought && p.text; });
    const reply = replyPart ? replyPart.text : (parts && parts[0] && parts[0].text);
    res.json({ reply: reply ? reply.trim() : "Please email daffodilsafrica@gmail.com or call +234 816 787 3722 💛" });

  } catch(e) {
    console.error('Chat handler exception', e.message);
    res.json({ reply: "Please email daffodilsafrica@gmail.com or call +234 816 787 3722 💛" });
  }
};

// Daffodils Africa — Daffy Chat API
// Set GROQ_API_KEY in Vercel → Settings → Environment Variables (ALL environments)

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return res.status(200).json({
      reply: "Hi! I'm Daffy 💛 Our team will be in touch shortly. Email daffodilsafrica@gmail.com or call +234 816 787 3722 for immediate help!"
    });
  }

  let body = {};
  try { body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {}); } catch(e) {}
  const { message, history = [] } = body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  const SYSTEM = `You are Daffy, the friendly assistant for Daffodils Africa — a Nigerian social enterprise implementing social impact projects across Africa.

STRICT RULE: ONLY answer questions about Daffodils Africa. If asked about anything unrelated, say: "I can only help with Daffodils Africa questions! Please email daffodilsafrica@gmail.com or call +234 816 787 3722 for anything else. 💛"

ABOUT DAFFODILS AFRICA:
- Social enterprise: high-impact social projects for individuals, organisations and government
- Services: Project Design, Community Development, Impact Campaigns, Monitoring & Evaluation
- Special offerings: CSR Made Easy, Celebrate with Impact, Tourist with a Difference
- Daffodils Africa Academy: Launching Q4 2026 — social impact, CSR, M&E, fundraising, community dev, youth leadership
- Impact: 3,000+ lives, 10 projects, 3 states (Lagos, Taraba, Jos)
- Projects: Digital Literacy STEAM Club, IWD Women Empowerment Ajo, Education Support Taraba & Lagos, Aged Food Support, GLOW Foundation, JOS Maternity, Business Support, Vision Eyecare Project
- Contact: +234 816 787 3722 | daffodilsafrica@gmail.com | Lagos Nigeria
- Social: @daffodils_africa on all platforms
- Founder: Ifeoluwa Oyebisi | Team: Darasimi, Odunayo, Hephzibah

Keep replies warm, under 120 words. Always end with an action step.`;

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: SYSTEM },
          ...history.slice(-6),
          { role: 'user', content: message }
        ],
        max_tokens: 250,
        temperature: 0.65,
      }),
    });

    if (!groqRes.ok) {
      const err = await groqRes.text();
      console.error('Groq error:', groqRes.status, err);
      return res.status(200).json({
        reply: "I'm having a moment — please email daffodilsafrica@gmail.com or call +234 816 787 3722! 💛"
      });
    }

    const data = await groqRes.json();
    res.status(200).json({ reply: data.choices[0].message.content.trim() });

  } catch (err) {
    console.error(err);
    res.status(200).json({
      reply: "Connection issue — email daffodilsafrica@gmail.com or call +234 816 787 3722 💛"
    });
  }
};

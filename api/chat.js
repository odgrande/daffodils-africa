// Daffodils Africa — Daffy Chat API
// Vercel Serverless Function (Node.js runtime)
// Env var: GROQ_API_KEY

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(200).json({
      reply: "I'm getting set up — please email daffodilsafrica@gmail.com or call +234 816 787 3722 and the team will respond quickly! 💛"
    });
  }

  let body = '';
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    body = req.body || {};
  }
  const { message, history = [] } = body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  const SYSTEM = `You are Daffy, the friendly assistant for Daffodils Africa — a Nigerian social enterprise implementing high-impact social projects across Africa.

YOUR STRICT RULES:
1. You ONLY discuss topics directly related to Daffodils Africa, our programs, services, team, impact, or how to get involved.
2. If someone asks about ANYTHING outside Daffodils Africa (general knowledge, other organisations, politics, entertainment, other topics), politely decline and redirect them: "I'm only here to help with Daffodils Africa questions! For anything else, please reach out to our team directly at daffodilsafrica@gmail.com or call +234 816 787 3722."
3. Never pretend to be something other than Daffy from Daffodils Africa.
4. Never make up prices, guarantees, or specific project details.
5. Always end responses by encouraging the person to take action.

ABOUT DAFFODILS AFRICA:
- Social enterprise: implements high-impact projects across Africa
- Services: Project Design & Implementation, Community Development, Impact Campaigns, Monitoring & Evaluation
- Special: CSR Made Easy, Celebrate with Impact, Tourist with a Difference
- Daffodils Africa Academy: Launching Q4 2026 — 6 courses on social impact, CSR, fundraising, M&E, community dev, youth leadership
- Impact: 3,000+ lives reached, 12+ programs, 10+ partnerships, 5+ sectors — SDGs 1, 4, 8, 10, 11
- Case studies: Digital Literacy Training (STEAM Club with Trust The Process Initiative), IWD 2024 Women Empowerment (Ajo project), Education & Business Empowerment
- Contact: +234 816 787 3722 | daffodilsafrica@gmail.com | Lagos, Nigeria
- Social: Instagram @daffodils_africa | Facebook @daffodilsafrica1
- Founder: Ifeoluwa Oyebisi | Team: Darasimi (Design), Odunayo (Web), Hephzibah (Programs)
- Board: Aderinsola Adeniran, Olayinka Layi-Adeite, Ibrahim Mutyaba
- Recognition: TotalEnergies Startupper of the Year Challenge

RESPONSE STYLE:
- Warm, concise, action-oriented (under 120 words normally)
- Always guide towards contacting the team for specific project details or quotes
- Use 💛 or 🌍 occasionally to keep it human
- NEVER discuss topics unrelated to Daffodils Africa`;

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
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
        reply: "I'm having a moment — please email daffodilsafrica@gmail.com or call +234 816 787 3722 and we'll respond right away! 💛"
      });
    }

    const data = await groqRes.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();
    if (!reply) throw new Error('Empty reply from Groq');
    res.status(200).json({ reply });

  } catch (err) {
    console.error('Chat handler error:', err);
    res.status(200).json({
      reply: "I'm having a moment — please email daffodilsafrica@gmail.com or call +234 816 787 3722 and we'll respond right away! 💛"
    });
  }
};

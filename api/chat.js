// Groq AI Chatbot API endpoint for Daffodils Africa
// Deploy on Vercel — set GROQ_API_KEY in Vercel Environment Variables

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message, history = [] } = req.body || {};
  if (!message) return res.status(400).json({ error: 'Message required' });

  const SYSTEM = `You are Daffy, the friendly AI assistant for Daffodils Africa — a Nigerian social enterprise implementing high-impact social projects across Africa.

ABOUT DAFFODILS AFRICA:
- Mission: Implement measurable social impact projects that transform communities and empower people across Africa
- Services: Project Design & Implementation, Community Development Programs, Impact Campaigns & Outreach, Monitoring & Evaluation
- Special offerings: CSR Made Easy (for corporates), Celebrate with Impact (birthday/anniversary projects), Tourist with a Difference
- Academy: Launching Q4 2026 — 6 courses in social impact, community dev, CSR, fundraising, M&E, youth leadership
- Impact: 3,000+ lives reached, 12+ programs, 10+ partnerships, 5+ sectors
- SDG Focus: SDGs 1, 4, 8, 10, 11
- Contact: +234 816 787 3722 | daffodilsafrica@gmail.com | Lagos, Nigeria
- Social: Instagram @daffodils_africa | Facebook @daffodilsafrica1
- Website: daffodilsafrica.com

HOW TO RESPOND:
- Be warm, helpful, and concise (under 120 words unless detail is needed)
- Always guide users to take action: contact us, start a project, volunteer, donate
- For pricing or project specifics, say "our team will give you a personalised quote" and direct to the contact page or email
- Never make up specific numbers or promises you can't back up
- Speak with energy — impact work is exciting!
- If asked something unrelated to Daffodils Africa, gently redirect`;

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: SYSTEM },
          ...history.slice(-6), // last 3 exchanges
          { role: 'user', content: message }
        ],
        max_tokens: 250,
        temperature: 0.7,
      }),
    });

    const data = await groqRes.json();
    if (!groqRes.ok) throw new Error(data.error?.message || 'Groq error');

    res.json({ reply: data.choices[0].message.content.trim() });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({
      reply: "I'm having a quick moment — please email us at daffodilsafrica@gmail.com or call +234 816 787 3722 and we'll respond right away! 💛"
    });
  }
};

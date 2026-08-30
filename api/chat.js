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

  const SYSTEM = `You are Daffy, the warm and helpful chat assistant for Daffodils Africa. Be natural, friendly, and conversational — like a knowledgeable team member chatting with a visitor.

GREETING RULES: Always respond warmly to greetings like "hi", "hello", "good morning/afternoon/evening" etc. Reply naturally (e.g. "Good evening! 😊 Welcome to Daffodils Africa — I'm Daffy, happy to help. What would you like to know?").

ABOUT DAFFODILS AFRICA:
Daffodils Africa is a Nigerian social enterprise implementing high-impact social projects across Africa. Founded by Ifeoluwa Oyebisi, based in Lagos.
- Mission: Driving sustainable community development and social impact across Africa.
- Services: Project Design & Management, Corporate Social Responsibility (CSR), Community Development, Monitoring & Evaluation (M&E).
- Impact: 3,000+ lives reached across multiple communities.
- The Daffodils Academy is launching Q4 2026 — a learning platform for social impact professionals.
- Contact: +234 816 787 3722 | daffodilsafrica@gmail.com

WEBSITE PAGES (link to these when relevant):
- Home: / — overview of who we are
- About us: /about — our story, mission, team
- Programs: /programs — our active social programs
- Impact: /impact — data and stories of our reach
- Academy: /academy — the upcoming Daffodils Academy
- Partnerships: /partnerships — how to partner with us
- Gallery: /gallery — photos from our work
- Blog: /blog — articles and updates
- Contact: /contact — get in touch, send a message

VOLUNTEER & JOBS: Encourage people to reach out via the contact page (/contact) or email daffodilsafrica@gmail.com to ask about volunteering, internships, or open roles.

PARTNERSHIPS & CSR: Direct companies and organisations to /partnerships or daffodilsafrica@gmail.com.

TONE: Warm, encouraging, concise. Keep replies under 130 words. Use natural language — not robotic. Use emojis sparingly (1–2 max). End with a helpful next step or relevant link when appropriate.

FOR TRULY OFF-TOPIC questions (nothing to do with Daffodils, social impact, NGOs, or Africa development): politely say you're focused on Daffodils Africa topics and invite them to ask something related.`;

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

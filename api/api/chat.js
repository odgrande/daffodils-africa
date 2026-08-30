// Daffodils Africa — Daffy Chat API
// Uses built-in https module (works on ALL Node.js versions)

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

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch(e) {
          reject(new Error('JSON parse error: ' + data));
        }
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
  if (!apiKey) {
    console.error('GROQ_API_KEY not set');
    return res.status(200).json({
      reply: "Hi! I'm Daffy 💛 Please email daffodilsafrica@gmail.com or call +234 816 787 3722 — the team responds quickly!"
    });
  }

  let body = {};
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  } catch(e) {}

  const { message, history = [] } = body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  const SYSTEM = `You are Daffy, the friendly assistant for Daffodils Africa — a Nigerian social enterprise implementing social impact projects across Africa.

STRICT RULE: ONLY answer questions about Daffodils Africa. If asked about anything else, say: "I can only help with Daffodils Africa questions! Email daffodilsafrica@gmail.com or call +234 816 787 3722 for anything else 💛"

ABOUT DAFFODILS AFRICA:
- Social enterprise: high-impact projects for individuals, organisations and government
- Services: Project Design, Community Development, Impact Campaigns, Monitoring & Evaluation  
- Special: CSR Made Easy, Celebrate with Impact, Tourist with a Difference
- Academy: Launching Q4 2026 — social impact, CSR, M&E, fundraising, community dev, youth leadership
- Impact: 3,000+ lives, 10 projects, Lagos, Taraba and Jos
- Projects: Digital Literacy STEAM Club, IWD Women Empowerment, Education Support, Food Support for Elderly, JOS Maternity, Business Support, Vision Eyecare, DaffodilsXGLOW
- Contact: +234 816 787 3722 | daffodilsafrica@gmail.com | Lagos Nigeria
- Social: @daffodils_africa on all platforms
- Founder: Ifeoluwa Oyebisi

Keep replies warm, under 120 words. Always end with a clear action step.`;

  try {
    const messages = [
      { role: 'system', content: SYSTEM },
      ...history.slice(-6),
      { role: 'user', content: message }
    ];

    const result = await groqRequest(apiKey, messages);

    if (result.status !== 200) {
      console.error('Groq API error:', result.status, JSON.stringify(result.body));
      return res.status(200).json({
        reply: "I'm having a quick moment — please email daffodilsafrica@gmail.com or call +234 816 787 3722! 💛"
      });
    }

    const reply = result.body?.choices?.[0]?.message?.content?.trim();
    if (!reply) throw new Error('Empty reply from Groq');

    res.status(200).json({ reply });

  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(200).json({
      reply: "I'm having a quick moment — please email daffodilsafrica@gmail.com or call +234 816 787 3722! 💛"
    });
  }
};

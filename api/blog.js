// Daffodils Africa — AI Blog Generator API
// Generates blog post drafts about social impact topics

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(200).json({ error: 'API not configured' });

  let body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
  const { topic, type = 'article' } = body;
  if (!topic) return res.status(400).json({ error: 'Topic required' });

  const SYSTEM = `You are a professional content writer for Daffodils Africa, a Nigerian social enterprise implementing high-impact social projects across Africa. You write compelling, informative blog posts on social impact, community development, CSR, youth empowerment, and Africa's development landscape.

Write in a warm, authoritative, action-inspiring voice. Use African context and examples where relevant. Structure posts clearly with an intro, 2-4 key sections, and a strong call to action linking back to Daffodils Africa.

Format your response as JSON with these fields:
{
  "title": "Full post title",
  "subtitle": "One-line subtitle",
  "category": "Category tag",
  "readTime": "X min read",
  "intro": "Opening paragraph (hook the reader)",
  "sections": [
    { "heading": "Section heading", "body": "Section content (2-3 paragraphs)" }
  ],
  "cta": "Final call-to-action paragraph mentioning Daffodils Africa",
  "tags": ["tag1", "tag2", "tag3"]
}

Return ONLY valid JSON. No markdown code fences.`;

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
          { role: 'user', content: `Write a ${type} about: "${topic}". Make it relevant to Africa, social impact, and Daffodils Africa's work.` }
        ],
        max_tokens: 1500,
        temperature: 0.75,
        response_format: { type: 'json_object' }
      }),
    });

    if (!groqRes.ok) throw new Error(`Groq ${groqRes.status}`);
    const data = await groqRes.json();
    const raw = data?.choices?.[0]?.message?.content;
    const post = JSON.parse(raw);
    res.status(200).json({ post });

  } catch (err) {
    console.error('Blog gen error:', err);
    res.status(500).json({ error: 'Generation failed. Try again.' });
  }
};

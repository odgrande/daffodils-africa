const https = require('https');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    return res.json({ 
      status: 'NO_KEY',
      message: 'GROQ_API_KEY environment variable is not set'
    });
  }

  // Test a minimal Groq request
  const body = JSON.stringify({
    model: 'llama-3.1-8b-instant',
    messages: [{ role: 'user', content: 'Say OK' }],
    max_tokens: 5
  });

  return new Promise((resolve) => {
    const options = {
      hostname: 'api.groq.com',
      path: '/openai/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req2 = https.request(options, (r) => {
      let data = '';
      r.on('data', c => data += c);
      r.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (r.statusCode === 200) {
            res.json({ status: 'OK', groq_status: r.statusCode, reply: parsed.choices?.[0]?.message?.content });
          } else {
            res.json({ status: 'GROQ_ERROR', groq_status: r.statusCode, error: parsed.error || parsed });
          }
        } catch(e) {
          res.json({ status: 'PARSE_ERROR', raw: data.slice(0, 200) });
        }
        resolve();
      });
    });
    req2.on('error', (e) => { res.json({ status: 'NETWORK_ERROR', error: e.message }); resolve(); });
    req2.write(body);
    req2.end();
  });
};

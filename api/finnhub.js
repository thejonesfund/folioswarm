const https = require('https');

module.exports = function handler(req, res) {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) {
    return res.status(500).json({ error: 'API key not configured on server' });
  }

  const { endpoint, ...rest } = req.query;
  if (!endpoint) {
    return res.status(400).json({ error: 'Missing endpoint param' });
  }

  const qs = new URLSearchParams({ ...rest, token: key }).toString();
  const url = `https://finnhub.io/api/v1${endpoint}?${qs}`;

  https.get(url, (upstream) => {
    let data = '';
    upstream.on('data', chunk => data += chunk);
    upstream.on('end', () => {
      try {
        res.status(upstream.statusCode).json(JSON.parse(data));
      } catch (e) {
        res.status(500).json({ error: 'Failed to parse Finnhub response' });
      }
    });
  }).on('error', () => {
    res.status(500).json({ error: 'Failed to reach Finnhub' });
  });
};

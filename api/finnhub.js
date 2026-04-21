export default async function handler(req, res) {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) {
    return res.status(500).json({ error: 'API key not configured on server' });
  }

  // Frontend sends: /api/finnhub?endpoint=/quote&symbol=AAPL
  const { endpoint, ...rest } = req.query;
  if (!endpoint) {
    return res.status(400).json({ error: 'Missing endpoint param' });
  }

  const qs = new URLSearchParams({ ...rest, token: key }).toString();
  const url = `https://finnhub.io/api/v1${endpoint}?${qs}`;

  try {
    const upstream = await fetch(url);
    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (e) {
    res.status(500).json({ error: 'Failed to reach Finnhub' });
  }
}

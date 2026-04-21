export default async function handler(req, res) {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const { endpoint, ...rest } = req.query;
  if (!endpoint) {
    return res.status(400).json({ error: 'Missing endpoint' });
  }

  const qs = new URLSearchParams({ ...rest, token: key }).toString();
  const url = `https://finnhub.io/api/v1${endpoint}?${qs}`;

  const upstream = await fetch(url);
  const data = await upstream.json();
  res.status(upstream.status).json(data);
}

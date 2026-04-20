export default async function handler(req, res) {
  const { ticker } = req.query;

  if (!ticker) {
    return res.status(400).json({ error: "Missing ticker" });
  }

  try {
    const url = `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${process.env.FINHUB_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({ error: "Finnhub error" });
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}

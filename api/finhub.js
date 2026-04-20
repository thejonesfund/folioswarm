export default async function handler(req, res) {
  const { ticker } = req.query;

  if (!ticker) {
    return res.status(400).json({ error: "Missing ticker" });
  }

  try {
    const response = await fetch(
      `https://api.finhub.io/your-endpoint?ticker=${ticker}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FINHUB_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: "Finhub error" });
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: `Tu es un assistant client professionnel.\nClient: ${message}\nAssistant:`
      })
    });

    const data = await response.json();

    // 🔍 EXTRACTION SÛRE DU TEXTE
    const output =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      "❌ Aucune réponse de l'IA";

    return res.status(200).json({ reply: output });

  } catch (error) {
    return res.status(500).json({ reply: "❌ Erreur serveur" });
  }
}


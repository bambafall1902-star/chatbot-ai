export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Tu es un assistant client professionnel." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    // 👇 AFFICHER L'ERREUR OPENAI
    if (data.error) {
      return res.status(500).json({
        reply: "❌ OpenAI error: " + data.error.message
      });
    }

    return res.status(200).json({
      reply: data.choices[0].message.content
    });

  } catch (error) {
    return res.status(500).json({
      reply: "❌ Server error"
    });
  }
}

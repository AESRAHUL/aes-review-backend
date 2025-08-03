const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");
require("dotenv").config();

const app = express();

// ✅ Enable CORS for all origins (like GitHub Pages)
app.use(cors());

// Parse JSON request body
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST route to generate AI-based review
app.post("/generate-review", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // or gpt-4 if you're not on gpt-4o plan
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that writes customer reviews.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const review = completion.choices[0].message.content;
    res.json({ review });
  } catch (error) {
    console.error("Error generating review:", error);
    res.status(500).json({ error: "Failed to generate review" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

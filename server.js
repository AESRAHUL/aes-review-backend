const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { OpenAI } = require("openai");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/generate-review", async (req, res) => {
  try {
    const { name, service, language } = req.body;

    if (!name || !service || !language) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Dynamically generate prompt based on language
    let prompt = "";

    if (language === "english") {
      prompt = `Write a 5-star Google review in English for a home appliance service. Customer name is ${name}, service was ${service}. The review should sound natural and appreciative. Do not include a title.`;
    } else if (language === "hindi") {
      prompt = `एक 5-स्टार गूगल रिव्यू हिंदी में लिखिए। ग्राहक का नाम ${name} है और सर्विस थी ${service} की। रिव्यू नेचुरल और संतुष्ट ग्राहक जैसा हो। शीर्षक न दें।`;
    } else {
      return res.status(400).json({ error: "Unsupported language" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
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

app.get("/", (req, res) => {
  res.send("AES Review Generator Backend Running...");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const OpenAI = require('openai');

const app = express();
const port = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(bodyParser.json());

app.post('/generate-review', async (req, res) => {
  const { service, name, rating, date, technician, language } = req.body;

  try {
    const prompt = language === 'hindi' ?
      `कृपया एक ग्राहक समीक्षा लिखें जो ${service} सेवा के लिए हो। ग्राहक का नाम ${name}, रेटिंग ${rating} स्टार है, सेवा की तारीख ${date} है, और तकनीशियन का नाम ${technician} है। समीक्षा संक्षिप्त और सकारात्मक होनी चाहिए।` :
      `Write a customer review for ${service} service. Customer name is ${name}, rating is ${rating} stars, service date was ${date}, and technician was ${technician}. Keep the review short and positive.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: "system", content: "You are a helpful assistant that writes customer reviews." },
        { role: "user", content: prompt }
      ]
    });

    const review = completion.choices[0].message.content;

    // Save review log for analytics
    fs.appendFileSync("reviews.log", JSON.stringify({ service, name, rating, date, technician, review, timestamp: new Date().toISOString() }) + "\n");

    res.json({ review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'AI generation failed' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

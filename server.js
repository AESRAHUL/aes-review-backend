import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/generate-review', async (req, res) => {
  const { appliance } = req.body;

  try {
    const prompt = `Write a 1-2 line positive Google review for a home appliance repair service that fixed a ${appliance}. Make it sound natural and appreciative.`;

    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    const review = response.data.choices[0].message.content.trim();
    res.json({ review });
  } catch (error) {
    console.error('Error generating review:', error.message);
    res.status(500).json({ error: 'Failed to generate review.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

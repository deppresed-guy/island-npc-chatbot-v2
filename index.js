import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Island NPC Chatbot is running!');
});

app.post('/ask', async (req, res) => {
  const userMessage = req.body.message;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "openchat/openchat-7b", // bisa diganti ke model lain yg kamu suka
      messages: [
        {
          role: "system",
          content: "You are a smart, elegant, educational NPC living on a peaceful tropical island. Keep responses concise and use emojis only when it suits the context."
        },
        {
          role: "user",
          content: userMessage
        }
      ]
    })
  });

  const data = await response.json();
  const botMessage = data.choices?.[0]?.message?.content || "Sorry, I don't know how to respond to that.";
  res.json({ message: botMessage });
});

app.listen(port, () => {
  console.log(`AI NPC Chatbot server running on port ${port}`);
});

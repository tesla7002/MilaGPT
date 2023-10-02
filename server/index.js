const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
const fs = require('fs');
const app = express();
app.use(cors());
app.use(express.json());

const configRaw = fs.readFileSync('config.json');
const config = JSON.parse(configRaw);

const configuration = new Configuration({
  apiKey: config.apiKey,
});
const openai = new OpenAIApi(configuration);

// Store chatbot message history
let chatHistory = [];

app.post('/chatbot', async (req, res) => {
  const question = req.body.question;
  
  try {    
    chatHistory.push({ role: 'user', content: question });

    const chatCompletion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo-0613',
      messages: chatHistory,
      temperature: 0.11,
    });

    const answer = chatCompletion.data.choices[0].message.content;

    // Add chatbot message to chat history
    chatHistory.push({ role: 'assistant', content: answer });

    res.header('Access-Control-Allow-Origin', '*');
    res.status(200).json({ response: answer });
  } catch (error) {
    console.error('OpenAI API request failed:', error);
    res.status(500).json({ error: 'Failed to process the request' });
  }
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

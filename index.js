require('dotenv').config();
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const openai = require('openai');

const app = express();
const port = process.env.PORT || 3000;
const chatgpt = new openai.OpenAIApi(process.env.OPENAI_API_KEY);

app.use(express.urlencoded({ extended: false }));

app.post('/sms', async (req, res) => {
  const message = req.body.Body;
  const response = await chatgpt.Completion.create({
    engine: 'davinci',
    prompt: message,
    max_tokens: 50,
  });

  const twiml = new MessagingResponse();
  twiml.message(response.choices[0].text);

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

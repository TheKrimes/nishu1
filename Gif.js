const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const TOKEN = process.env.DISCORD_BOT_TOKEN;
const GIPHY_API_KEY = process.env.GIPHY_API_KEY;

console.log(`Token being used: ${TOKEN}`); // Add this line for debugging

client.once('ready', () => {
console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
if (message.author.bot) return;

  //Gif Code:
if (message.content.toLowerCase().includes('gif')) {
const query = message.content.toLowerCase().replace('gif', '').trim();
const gifUrl = await fetchGif(query || 'random');
if (gifUrl) {
await message.channel.send(gifUrl);
await message.delete();
} else {
await message.channel.send("Couldn't find a GIF for that!");
}
}
});

async function fetchGif(query) {
try {
const response = await axios.get(`https://api.giphy.com/v1/gifs/search`, {
params: {
api_key: GIPHY_API_KEY,
q: query,
limit: 1
}
});
const data = response.data;
if (data.data.length > 0) {
return data.data[0].images.original.url;
} else {
return null;
}
} catch (error) {
console.error('Error fetching GIF:', error);
return null;
}
}

client.login(TOKEN);

//Automod Code
const automod = require('./automod');

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', (message) => {
  automod(client, message);
});

client.login(process.env.DISCORD_BOT_TOKEN);

//Voice Code
const { Configuration, OpenAIApi } = require('openai');
const fs = require('fs');
const util = require('util');
const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

console.log('voice.js script started...');

async function convertTextToSpeech(text) {
  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-002', // Model name might change based on OpenAI's latest API
      prompt: `Convert this text to speech: ${text}`,
      max_tokens: 100,
    });

    const audioContent = response.data.choices[0].text;
    const filePath = __dirname + '/output.mp3'; // Use absolute path
    await util.promisify(fs.writeFile)(filePath, audioContent, 'binary');
    console.log('Audio content written to file:', filePath);
    return filePath;
  } catch (error) {
    console.error('Error during text-to-speech conversion:', error);
  }
}

client.once('ready', () => {
  console.log('Nishu is online!');
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;
  console.log('Message received:', message.content);
  const responseText = `Hello Nishu, kaise ho?`;
  console.log('Generating dynamic response:', responseText);
  try {
    const filePath = await convertTextToSpeech(responseText);
    console.log('File path:', filePath);
    if (message.channel) {
      console.log('Sending message to channel:', message.channel.id);
      await message.channel.send({
        files: [{
          attachment: filePath,
          name: 'response.mp3'
        }]
      });
    } else {
      console.log('Channel not found!');
    }
  } catch (err) {
    console.error('Error sending message:', err);
  }
});

console.log('Attempting to login...');
client.login(process.env.DISCORD_BOT_TOKEN).then(() => {

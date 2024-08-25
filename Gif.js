import { Client, GatewayIntentBits } from 'discord.js';
import axios from 'axios';
import fs from 'fs';
import util from 'util';
import { OpenAIApi } from 'openai';

console.log(openai);

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

//Voice Code
const configuration = new OpenAIApi.Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const myOpenAI = new OpenAIApi(configuration);

console.log("Voice script started...");

async function convertTextToSpeech(text) {
try {
const response = await openai.createCompletion({
model: "text-davinci-002", // Ensure you are using the correct model
prompt: `Convert the following text to speech in Hindi with a female voice: ${text}`,
max_tokens: 100,
});

const speechContent = response.data.choices[0].text;

// Assuming 'speechContent' needs to be converted to an audio file
const filePath = __dirname + "/output.mp3"; // Use absolute path
await util.promisify(fs.writeFile)(filePath, speechContent, "binary");
console.log("Audio content written to file:", filePath);
return filePath;
} catch (error) {
console.error("Error during text-to-speech conversion:", error);
}
}

client.once("ready", () => {
console.log("Nishu is online!");
});

client.on("messageCreate", async (message) => {
if (message.author.bot) return;

if (message.content.toLowerCase().startsWith("speak ")) {
const text = message.content.slice("speak ".length);
console.log("Message received:", text);

try {
const filePath = await convertTextToSpeech(text);
console.log("Generated audio file path:", filePath);

if (filePath) {
await message.channel.send({
files: [
{
attachment: filePath,
name: "response.mp3",
},
],
});
} else {
console.log("Could not generate audio file.");
}
        } catch (err) {
            console.error("Error sending audio message:", err);
        }
    }
});

console.log("Attempting to login...");
client.login(process.env.DISCORD_BOT_TOKEN)
.then(() => {
console.log("Login successful!");
})
.catch((err) => {
console.error("Login error:", err);
});

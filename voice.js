const fs = require('fs');
const util = require('util');
const { Client, Intents } = require('discord.js');
const textToSpeech = require('@google-cloud/text-to-speech');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const ttsClient = new textToSpeech.TextToSpeechClient();

const responses = [
"Namaste, kaise ho tum log?",
"Hello, kya chal raha hai?",
"Hi, sab theek hai na?",
"Hey, kya haal hai?",
"What's up, sab badhiya?"
];

async function convertTextToSpeech(text) {
const request = {
input: { text: text },
voice: { languageCode: 'hi-IN', ssmlGender: 'FEMALE' },
audioConfig: { audioEncoding: 'MP3' },
};

const [response] = await ttsClient.synthesizeSpeech(request);
const writeFile = util.promisify(fs.writeFile);
const filePath = 'output.mp3';
await writeFile(filePath, response.audioContent, 'binary');
console.log('Audio content written to file:', filePath);
return filePath;
}

client.once('ready', () => {
console.log('Nishu is online!');
});

client.on('messageCreate', async message => {
if (message.author.bot) return;  // bot ke messages ko ignore karo

console.log('Message received:', message.content);

setInterval(async () => {
const randomResponse = responses[Math.floor(Math.random() * responses.length)];
console.log('Generating random response:', randomResponse);

const filePath = await convertTextToSpeech(randomResponse);
console.log('File path:', filePath);

if (message.channel) {
console.log('Sending message to channel:', message.channel.id);
message.channel.send({
files: [{
attachment: filePath,
name: 'NishuVoiceNote.mp3'
}],
}).catch(err => console.error('Error sending message:', err));
} else {
console.log('Channel not found!');
}
}, 30);  // yahan par time interval set kar sakte ho (milliseconds mein)
});

client.login('DISCORD_BOT_TOKEN');

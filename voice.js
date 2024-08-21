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

setInterval(async () => {
const randomResponse = responses[Math.floor(Math.random() * responses.length)];

const filePath = await convertTextToSpeech(randomResponse);

if (message.channel) {
message.channel.send({
files: [{
attachment: filePath,
name: 'response.mp3'
}],
});
} else {
console.log('Channel not found!');
}
}, 60000);  // yahan par time interval set kar sakte ho (milliseconds mein)
});

client.login('DISCORD_BOT_TOKEN');

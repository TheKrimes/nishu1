const fs = require('fs');
const util = require('util');
const { Client, Intents } = require('discord.js');
const textToSpeech = require('@google-cloud/text-to-speech');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const ttsClient = new textToSpeech.TextToSpeechClient();

async function convertTextToSpeech(text) {
try {
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
} catch (error) {
console.error('Error during text-to-speech conversion:', error);
}
}

client.once('ready', () => {
console.log('Nishu is online!');
});

client.on('messageCreate', async message => {
if (message.author.bot) return;  // bot ke messages ko ignore karo

console.log('Message received:', message.content);

setInterval(async () => {
// Generated response dynamically based on some logic
const dynamicResponse = `Hello ${message.author.username}, kaise ho?`; // example dynamic response
console.log('Generating dynamic response:', dynamicResponse);

const filePath = await convertTextToSpeech(dynamicResponse);
console.log('File path:', filePath);

if (message.channel) {
console.log('Sending message to channel:', message.channel.id);
message.channel.send({
files: [{
attachment: filePath,
name: 'response.mp3'
}],
}).catch(err => console.error('Error sending message:', err));
} else {
console.log('Channel not found!');
}
}, 60000);  // yahan par time interval set kar sakte ho (milliseconds mein)
});

client.login(process.env.DISCORD_BOT_TOKEN);

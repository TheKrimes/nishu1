require('dotenv').config();
const fs = require('fs');
const util = require('util');
const { Client, Intents } = require('discord.js');
const textToSpeech = require('@google-cloud/text-to-speech');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const ttsClient = new textToSpeech.TextToSpeechClient();

console.log('voice.js script started...');

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
    if (message.author.bot) return;

    console.log('Message received:', message.content);
    const responseText = `Hello ${message.author.username}, kaise ho?`;
    console.log('Generating dynamic response:', responseText);

    const filePath = await convertTextToSpeech(responseText);
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
});

console.log('Attempting to login...');
client.login(process.env.DISCORD_BOT_TOKEN).then(() => {
    console.log('Login successful!');
}).catch(err => {
    console.error('Login error:', err);
});

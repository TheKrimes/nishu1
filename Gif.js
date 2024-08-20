const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const TOKEN = 'MTI3NDczMjIzMjc2NjEzMjM2Nw.GCEX1b.6ngnNMUKjkDT4XZxQQQ1CwmF_5s_0Wg2gAXt1M';
const GIPHY_API_KEY = '5KCGeVEcQtaJFHCX12NNIpTuJXsWINCc';

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

  client.on('messageCreate', async (message) => {
      if (message.author.bot) return;

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

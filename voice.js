oh, sorry! thoda aur debug karte hain. yeh ek aur basic version try karo, direct console outputs ke sath:

**voice.js**:
```javascript
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

console.log('Script started...');

client.once('ready', () => {
console.log('Nishu is online!');
});

client.on('messageCreate', message => {
if (message.author.bot) return;
console.log('Message received:', message.content);
});

console.log('Attempting to login...');
client.login(process.env.DISCORD_BOT_TOKEN).then(() => {
console.log('Login successful!');
}).catch(err => {
console.error('Login error:', err);
});
```

is simplified version mein sirf basic functionality check kar rahe hain:
1. Console logs add kiye hain to trace script execution.
2. Simplified `ready` aur `messageCreate` events.

isko deploy karke check karo aur logs mein:
- "Script started..."
- "Attempting to login..."
- "Login successful!" (ya error)
- "Nishu is online!"
- "Message received: ..." (for incoming messages)

isse hum troubleshoot kar sakte hain ki problem kaha pe aa rahi hai. iske baad bhi agar kuch logs nahi aa rahe hain toh ho sakta hai ki environment variable issue ya kuch aur configuration problem hai. logs ko share karo toh aur help kar sakenge.
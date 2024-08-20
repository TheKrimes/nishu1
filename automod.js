const config = require('./config.json');

module.exports = (client, message) => {
  if (message.author.bot) return;

  // Bad Words Filter
  const words = message.content.split(' ');
  const foundBadWords = words.filter(word => config.badWords.includes(word.toLowerCase()));

  if (foundBadWords.length > 0) {
    message.delete();
    message.channel.send(`${message.author}, ${config.warnMessage}`);
  }

  // Spam Detection
  if (!client.lastMessageTime) client.lastMessageTime = {};
  if (!client.lastMessageTime[message.author.id]) client.lastMessageTime[message.author.id] = 0;

  const timeDifference = message.createdTimestamp - client.lastMessageTime[message.author.id];
  if (timeDifference < config.spamThreshold) {
    message.delete();
    message.channel.send(`${message.author}, ${config.warnMessage}`);
  }

  client.lastMessageTime[message.author.id] = message.createdTimestamp;
};

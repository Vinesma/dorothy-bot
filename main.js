/**
 * A ping pong bot, whenever you send "ping", it replies "pong".
 */

// Import the discord.js module
const Discord = require('discord.js');

// Create an instance of a Discord client
const dorothyBot = new Discord.Client();

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
dorothyBot.on('ready', () => {
  console.log('I am ready!');
});

// Create an event listener for messages
dorothyBot.on('message', message => {
  // If the message is "ping"
  if (message.content.toLowerCase() === '!ping') {
    // Send "pong" to the same channel
    message.channel.send('Pong');
  }
});

// Log our bot in using the token from https://discordapp.com/developers/applications/me
dorothyBot.login(process.env.BOT_TOKEN);
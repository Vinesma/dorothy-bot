const Discord = require('discord.js'); //Using discord.js
const Commands = require('./commands/commands.js'); // command list

// Instance a Discord client
const dorothyBot = new Discord.Client();

// Ready event, fires when the bot is ready
dorothyBot.on('ready', () => {
  console.log('FINALLY THE DOROTHY RETURNS TO DISCORD!');
});

// Create an event listener for messages
dorothyBot.on('message', message => {
    //Check if the message is a command
    if (message.content.startsWith('!')) {
        cmd = message.content.substr(1);

        switch (cmd.toLowerCase()) {
            case 'ping':
                Commands.ping(message);
                break;
            case 'help':
            default:
                Commands.help(message);
                break;
        }
    }
});

// Bot login
dorothyBot.login(process.env.BOT_TOKEN);
//REMEMBER TO REMOVE THE TOKEN AND SET heroku scale worker=1 before deploy
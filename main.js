const Discord = require('discord.js');
const Commands = require('./commands/commands.js');

// Instance a Discord client
const dorothyBot = new Discord.Client();

// Ready event, fires when the bot is ready
dorothyBot.on('ready', () => {
    console.log('FINALLY THE DOROTHY RETURNS TO DISCORD!');
});

// Create an event listener for messages
dorothyBot.on('message', message => {
    // Check if the message is a command and not sent by a bot
    if (message.content.startsWith('!') && !message.author.bot) {
        // Remove '!' and split the arguments
        const args = message.content.substr(1).split(/ +/);
        // Shift the first item of args (the command) into cmd
        const cmd = args.shift().toLowerCase();
        switch (cmd) {
            case 'ping':
                Commands.ping(message);
                break;
            case 'youtube':
                Commands.youtube(message);
                Commands.cleanUp(message);
                break;
            case 'danbooru':
                Commands.danbooru(message);
                Commands.cleanUp(message);
                break;
            case 'clean':
                Commands.cleanUpBulk(message, args);
                break;
            case 'help':
            default:
                Commands.help(message);
                Commands.cleanUp(message);
                break;
        }
    }
});

// Bot login
dorothyBot.login(process.env.BOT_TOKEN);

// FOR DEVELOPMENT npm run dev AND heroku run local
// REMOVE THE TOKENS before commits
// SET heroku scale worker=1 after deploy
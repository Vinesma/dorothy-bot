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
    // Prevents msg loops
    if (message.author.id === dorothyBot.id) return;

    // Check if the message is a command
    if (message.content.startsWith('!')) {
        let cmd = message.content.substr(1); // Remove '!'
        
        switch (cmd.toLowerCase()) {
            case 'ping':
                Commands.ping(message);
                break;
            case 'youtube':                
                Commands.youtube(message);
                Commands.cleanUp(message);
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

// FOR DEV TESTING CHECKOUT test-branch AND RUN heroku scale worker=0 | heroku local
// REMOVE THE TOKENS before commits
// SET heroku scale worker=1 after deploy
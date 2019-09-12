const Discord = require('discord.js');
const fs = require('fs');

// Instance a Discord client
const dorothyBot = new Discord.Client();
// Retrieve the supported commands
dorothyBot.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    dorothyBot.commands.set(command.name, command);
}

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
        // Shift the first item of args (the command) into commandName
        const commandName = args.shift().toLowerCase();
        // Dynamically check if the command exists
        if(!dorothyBot.commands.has(commandName)) return;

        try {
            dorothyBot.commands.get(commandName).execute(message, args);
        }
        catch (error) {
            console.error(error);
            message.channel.send('There was an error executing that command!');
        }
    }
});

// Bot login
dorothyBot.login(process.env.BOT_TOKEN);

// FOR DEVELOPMENT npm run dev AND heroku run local
// REMOVE THE TOKENS before commits
// SET heroku scale worker=1 after deploy
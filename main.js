const Discord = require('discord.js');
const fs = require('fs');
const config = require('./config/config.js');

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
    // Read last session's data - !youtube
    fs.readFile('./storage/ytFetchOptions.json', (err, jsonData) => {
        if (!err) {
            try {
                console.log('\nTrying to read last session\'s data...');
                config.ytFetchOptions = JSON.parse(jsonData);
                console.log('!youtube - Success!');
            }
            catch (error) {
                console.error(`!youtube - Error parsing: ${error}`);
            }
        }
        else {
            console.error(`!youtube - Error reading data: ${err}`);
            console.error('Procceed with defaults.');
        }
    });
});

// Create an event listener for messages
dorothyBot.on('message', message => {
    // Check if the message is a command and not sent by a bot
    if (message.content.startsWith('!') && !message.author.bot) {
        // Remove '!' and split the arguments into an array
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
dorothyBot.login(process.env.BOT_TOKEN || 'NjE5NjQwNzQzMzQ2MDQ0OTU2.XXLyYw.SiBAReBCP3nFeWFhYXy5VgktXRQ');

// FOR DEVELOPMENT npm run dev AND heroku run local
// REMOVE THE TOKENS before commits
// TO DEPLOY npm run deploy
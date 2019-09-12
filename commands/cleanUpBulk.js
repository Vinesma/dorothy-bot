module.exports = {
    name: 'clean',
    description: 'Cleans up X amount of messages.',
    execute(msg, args) {
        const amount = parseInt(args[0]) + 1;
        if (isNaN(amount)) {
            msg.channel.send('You must send a valid number!');
        }
        else if(amount < 2 || amount > 100) {
            msg.channel.send('The number needs to be between 2 and 99.');
        }
        else {
            msg.channel.bulkDelete(amount, true).catch(err => {
                console.error(err);
                msg.channel.send('There was an error trying to prune this channel.');
            });
        }
    },
};
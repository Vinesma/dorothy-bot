module.exports = {
    name: 'help',
    description: 'Lists all available commands.',
    execute(msg, args) {
        const data = [];
        const { commands } = msg.client;

        if(!args.length) {
            data.push('List of available commands:');
            data.push(commands.map(cmd => `${cmd.name} > ${cmd.description}`).join('\n'));

            msg.channel.send(data, { split: true });
        }
    },
};
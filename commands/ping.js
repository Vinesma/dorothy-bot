module.exports = {
    name: 'ping',
    description: 'Returns \'Pong!\'',
    // eslint-disable-next-line no-unused-vars
    execute(msg, args) {
        msg.channel.send('Pong!');
    },
};
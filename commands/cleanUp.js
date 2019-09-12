module.exports = {
    name: 'cleanup',
    description: 'Deletes a message.',
    // eslint-disable-next-line no-unused-vars
    execute(msg, args) {
        msg.delete();
    },
};
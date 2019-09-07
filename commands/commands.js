commandList =
`List of valid commands:
!ping > Returns 'Pong!'
!help > Returns this help message.`

exports.help = (msg) => { //command list
    msg.channel.send(commandList);
}

exports.ping = (msg) => { //ping command
    msg.channel.send('Pong!');
}

exports.youtube = (msg) => {
    //WIP
}

exports.cleanUp = (msg) => { //deletes a message
    msg.delete();
}
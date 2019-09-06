commandList =
`List of valid commands:
!ping > Returns 'Pong!'
!help > Returns this help message.`

exports.ping = (msg) => { //ping command
    msg.channel.send('Pong!');
}

exports.help = (msg) => { //command list
    msg.channel.send(commandList);
}
const Config = require('./config.js');
const Video = require('./video.js');
const fetch = require('node-fetch');
const fs = require('fs');

const commandList =
`List of valid commands:
!ping > Returns 'Pong!'
!help > Returns this help message.`

let videoList = [];

exports.help = (msg) => { //command list
    msg.channel.send(commandList);
}

exports.ping = (msg) => { //ping command
    msg.channel.send('Pong!');
}

exports.youtube = (msg) => {
    Config.isCheckingYT = !Config.isCheckingYT;

    fetch(Config.ytAPI_LINK)
        .then(res => res.json())
        .then(data => {
            data.items.forEach(video => {
                let v = new Video(video.snippet.title, video.contentDetails.upload.videoId, Config.ytLink);
                videoList.push(v);
            });

            videoList.forEach(video =>{
                msg.channel.send(video.format());
            });

            fs.writeFile('./storage/videoList.json', JSON.stringify(videoList), (err) => console.log(err));
        });
}

exports.cleanUp = (msg) => { //deletes a message
    msg.delete();
}
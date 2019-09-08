const Config = require('./config.js');
const Video = require('./video.js');
const fetch = require('node-fetch');
const fs = require('fs');

const commandList =
`List of valid commands:
!ping > Returns 'Pong!'
!youtube > Turns youtube checking on
!help > Returns this help message.`

let videoList = [];
let oldVideoList = [];

exports.help = (msg) => { //command list
    msg.channel.send(commandList);
}

exports.ping = (msg) => { //ping command
    msg.channel.send('Pong!');   
}

exports.youtube = (msg) => { //youtube command
    if (Config.isCheckingYT === false) {
        msg.channel.send('I guess I can get those videos for you...');
        Config.timer = setInterval(() => {
            fetchVideos(msg);
        }, Config.intervalYT);
        Config.isCheckingYT = !Config.isCheckingYT;
    } else {
        msg.channel.send('Roger! No more looking for new videos.');
        clearInterval(Config.timer);
        Config.isCheckingYT = !Config.isCheckingYT;
    }
}

exports.cleanUp = (msg) => { //deletes a message
    msg.delete();
}

function filterVideos(a1){
    let tempArray = [];

    a1.forEach(video => {
        for (let i = 0; i < Config.filterList.length; i++) {
            if (video.title.toLowerCase().includes(Config.filterList[i])) {
                tempArray.push(video);
                continue;
            }
        }
    });

    return tempArray;
}

function recentVideos(a1, a2){
    let tempArray = [];
    let notRecent = false;
    
    a1.forEach(video => {
        for (let i = 0; i < a2.length; i++) {
            if (video.id === a2[i]) {
                notRecent = true;
                continue;
            } 
        }
        if (!notRecent) {
            tempArray.push(video);
        }
        notRecent = false;
    });

    return tempArray;
}

function fetchVideos(msg){
    fetch(Config.ytAPI_LINK)
        .then(res => res.json())
        .then(data => {
            data.items.forEach(video => { // List all videos
                let v = new Video(video.snippet.title, video.contentDetails.upload.videoId, Config.ytLink);
                videoList.push(v);
            });                       

            let ftVideos = filterVideos(videoList); // Filter videos by interests
            fs.readFile('./storage/videoList.json', (err, jsonData) => { // Read data from the previous fetch
                if (!err){
                    oldVideoList = JSON.parse(jsonData);
                    ftVideos = recentVideos(ftVideos, oldVideoList);
                } else {
                    console.log(`Error reading data: ${err}`);
                }
                if (ftVideos.length === 0) {
                    console.log('No new videos');
                } else {
                    ftVideos.forEach(video => { msg.channel.send(video.format()); }); // Send a msg with the videos
                }                
                let idList = []; // Create list with video IDs
                videoList.forEach(video => {
                    idList.push(video.id);
                });
                //Store idList in JSON file
                fs.writeFile('./storage/videoList.json', JSON.stringify(idList), (err) => console.log(err !== null ? 'File write error: '+err : 'Write successful'));
            });
        });
}
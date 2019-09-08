const Config = require('./config.js');
const Video = require('./video.js');
const booruImg = require('./booruImg.js');
const fetch = require('node-fetch');

const commandList =
`List of valid commands:
!ping > Returns 'Pong!'
!youtube > Turns youtube checking on/off
!danbooru > Turns danbooru checking on/off
!status > Returns the current status of bot activities
!help > Returns this help message.`;

let curDateYT = new Date().getTime(); // Time of deployment
let curDateDB = new Date().getTime();

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

exports.danbooru = (msg) => { //danbooru command
    if (Config.isCheckingDB === false) {
        msg.channel.send('Okay, I will observe danbooru for you...');
        Config.timerDB = setInterval(() => {
            fetchDB(msg);
        }, Config.intervalDB);
        Config.isCheckingDB = !Config.isCheckingDB;
    } else {
        msg.channel.send('No more booru checking!');
        clearInterval(Config.timerDB);
        Config.isCheckingDB = !Config.isCheckingDB;
    }
}

exports.cleanUp = (msg) => { //deletes a message
    msg.delete();
}

// FUNCTIONS

function fetchVideos(msg){
    fetch(Config.ytAPI_LINK)
        .then(res => res.json())
        .then(data => {
            let videoList = [];

            data.items.forEach(video => { // List all videos
                let datePosted = new Date(video.snippet.publishedAt).getTime();
                let v = new Video(video.contentDetails.upload.videoId, video.snippet.title, datePosted, Config.ytLink);
                videoList.push(v);
            });
            let ftVideos = Config.filterVideos(videoList, Config.filterList); // Filter videos by interests

            ftVideos = Config.recentElem(ftVideos, curDateYT);
            if (ftVideos.length === 0) {
                console.log("No new videos found...");
            } else {
                ftVideos.forEach(video => { msg.channel.send(video.format()); }); // Send a msg with the videos
            }
            curDateYT = new Date().getTime();
        });
}

function fetchDB(msg){
    fetch(Config.dbAPI_LINK)
        .then(res => res.json())
        .then(data => {
            let dbPostList = [];

            data.forEach(post => { // List all posts
                let datePosted = new Date(post.created_at).getTime();
                let p = new booruImg(post.id, datePosted, Config.dbLink, post.is_pending, post.is_flagged, post.tag_string_general, post.tag_string_character);
                dbPostList.push(p);
            });

            let ftPosts = Config.filterPosts(dbPostList, Config.filterListDB); // Filter posts out by tags

            ftPosts = Config.recentElem(ftPosts, curDateDB);
            if (ftPosts.length === 0) {
                console.log("No new booru posts found...");
            } else {
                ftPosts.forEach(post => { msg.channel.send(post.format()); }); // Send a msg with the posts
            }
            curDateDB = new Date().getTime();
        });
} 
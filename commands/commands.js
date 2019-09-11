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

let curDateYT = new Date().getTime() - Config.intervalYT; // Time of deployment
let curDateDB = new Date().getTime() - Config.intervalDB;

exports.help = (msg) => { //command list
    msg.channel.send(commandList);
}

exports.ping = (msg) => { //ping command
    msg.channel.send('Pong!');   
}

exports.youtube = (msg) => { //youtube command
    if (Config.isCheckingYT === false) {
        msg.channel.send('I guess I can get those videos for you...');
        fetchVideos(msg);
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
        fetchDB(msg);
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
            // List all videos
            data.items.forEach(video => {
                let datePosted = new Date(video.snippet.publishedAt).getTime();
                let v = new Video(video.contentDetails.upload.videoId, video.snippet.title, datePosted, Config.ytLink);
                videoList.push(v);
            });
            // Filter videos by interests
            let ftVideos = videoList.filter(e => Config.filterPositive(e.title, Config.filterList));
            // Check recency
            ftVideos = ftVideos.filter(e => Config.checkRecent(e.datePosted, curDateYT));
            // Send videos out
            if (ftVideos.length === 0) {
                console.log("No new videos found...");
            } else {
                msg.channel.send("@Vinesma"); // Tag me
                ftVideos.forEach(video => { msg.channel.send(video.format()); }); // Send a msg with the videos
                console.log(`Found and posted ${ftVideos.length} videos`);
            }
            // Get new time
            curDateYT = new Date().getTime();
        });
}

function fetchDB(msg){
    fetch(Config.dbAPI_LINK)
        .then(res => res.json())
        .then(data => {
            let dbPostList = [];
            // List all posts
            data.forEach(post => {
                let datePosted = new Date(post.created_at).getTime();
                let p = new booruImg(post.id, datePosted, Config.dbLink, post.is_pending, post.is_flagged, post.tag_string_general, post.tag_string_character);
                dbPostList.push(p);
            });
            // Filter posts out by tags
            let ftPosts = dbPostList.filter(e => Config.filterNegative(e.tag_string, Config.filterListDB));
            // Check recency 
            ftPosts = ftPosts.filter(e => Config.checkRecent(e.datePosted, curDateDB));
            // Send posts out
            if (ftPosts.length === 0) {
                console.log("No new booru posts found...");
            } else {
                ftPosts.forEach(post => { msg.channel.send(post.format()); }); // Send a msg with the posts
                console.log(`Found and posted ${ftPosts.length} posts`);
            }
            // Get new time
            curDateDB = new Date().getTime();
        });
}
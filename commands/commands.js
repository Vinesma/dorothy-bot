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
// Time of deployment
let curDateYT = new Date().getTime() - Config.intervalYT;
let curDateDB = new Date().getTime() - Config.intervalDB;

// command list
exports.help = (msg) => {
    msg.channel.send(commandList);
};
// ping command
exports.ping = (msg) => {
    msg.channel.send('Pong!');
};
// youtube command
exports.youtube = (msg) => {
    if (Config.isCheckingYT === false) {
        msg.channel.send('I guess I can get those videos for you...');
        fetchVideos(msg);
        Config.timer = setInterval(() => {
            fetchVideos(msg);
        }, Config.intervalYT);
        Config.isCheckingYT = !Config.isCheckingYT;
    }
    else {
        msg.channel.send('Roger! No more looking for new videos.');
        clearInterval(Config.timer);
        Config.isCheckingYT = !Config.isCheckingYT;
    }
};
// danbooru command
exports.danbooru = (msg) => {
    if (Config.isCheckingDB === false) {
        msg.channel.send('Okay, I will observe danbooru for you...');
        fetchDB(msg);
        Config.timerDB = setInterval(() => {
            fetchDB(msg);
        }, Config.intervalDB);
        Config.isCheckingDB = !Config.isCheckingDB;
    }
    else {
        msg.channel.send('No more booru checking!');
        clearInterval(Config.timerDB);
        Config.isCheckingDB = !Config.isCheckingDB;
    }
};
// returns bot status
exports.status = (msg) => {
    msg.channel.send(`BOT STATUS:
    Checking youtube:${Config.isCheckingYT}
    Last YT check:${curDateYT.toString()}
    Checking danbooru:${Config.isCheckingDB}
    Last DB check:${curDateDB.toString()}`);
};
// deletes a message
exports.cleanUp = (msg) => {
    msg.delete();
};
exports.cleanUpBulk = (msg, args) => {
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
};
// FUNCTIONS

function fetchVideos(msg) {
    fetch(Config.ytAPI_LINK)
        .then(res => res.json())
        .then(data => {
            const videoList = [];
            // List all videos
            data.items.forEach(video => {
                const datePosted = new Date(video.snippet.publishedAt).getTime();
                const v = new Video(video.contentDetails.upload.videoId, video.snippet.title, datePosted, Config.ytLink);
                videoList.push(v);
            });
            // Filter videos by interests
            let ftVideos = videoList.filter(e => Config.filterPositive(e.title, Config.filterList));
            // Check recency
            ftVideos = ftVideos.filter(e => Config.checkRecent(e.datePosted, curDateYT));
            // Send videos out
            if (ftVideos.length === 0) {
                console.log('No new videos found...');
            }
 else {
                // Tag me
                msg.channel.send('@Vinesma');
                // Send a msg with the videos
                ftVideos.forEach(video => { msg.channel.send(video.format()); });
                console.log(`Found and posted ${ftVideos.length} videos`);
            }
            // Get new time
            curDateYT = new Date().getTime();
        });
}

function fetchDB(msg) {
    fetch(Config.dbAPI_LINK)
        .then(res => res.json())
        .then(data => {
            const dbPostList = [];
            // List all posts
            data.forEach(post => {
                const datePosted = new Date(post.created_at).getTime();
                const p = new booruImg(post.id, datePosted, Config.dbLink, post.is_pending, post.is_flagged, post.tag_string_general, post.tag_string_character);
                dbPostList.push(p);
            });
            // Filter posts out by tags
            let ftPosts = dbPostList.filter(e => Config.filterNegative(e.tag_string, Config.filterListDB));
            // Check recency
            ftPosts = ftPosts.filter(e => Config.checkRecent(e.datePosted, curDateDB));
            // Send posts out
            if (ftPosts.length === 0) {
                console.log('No new booru posts found...');
            }
 else {
                // Send a msg with the posts
                ftPosts.forEach(post => { msg.channel.send(post.format()); });
                console.log(`Found and posted ${ftPosts.length} posts`);
            }
            // Get new time
            curDateDB = new Date().getTime();
        });
}
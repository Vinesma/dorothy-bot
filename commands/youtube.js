const config = require('../config/config.js');
const fetch = require('node-fetch');
const Video = require('../config/video.js');

module.exports = {
    name: 'youtube',
    description: 'Turns youtube checking on/off.',
    // eslint-disable-next-line no-unused-vars
    execute(msg, args) {
        if (config.isCheckingYT === false) {
            msg.channel.send('I guess I can get those videos for you...');
            fetchVideos(msg);
            config.timer = setInterval(() => { fetchVideos(msg); }, config.intervalYT);
            config.isCheckingYT = !config.isCheckingYT;
        }
        else {
            msg.channel.send('Roger! No more looking for new videos.');
            clearInterval(config.timer);
            config.isCheckingYT = !config.isCheckingYT;
        }
    },
};

function fetchVideos(msg) {
    fetch(config.ytAPI_LINK)
        .then(res => res.json())
        .then(data => {
            const videoList = [];
            // List all videos
            data.items.forEach(video => {
                const datePosted = new Date(video.snippet.publishedAt).getTime();
                const v = new Video(video.contentDetails.upload.videoId, video.snippet.title, datePosted, config.ytLink);
                videoList.push(v);
            });
            // Filter videos by interests
            let ftVideos = videoList.filter(e => config.filterPositive(e.title, config.filterList));
            // Check recency
            ftVideos = ftVideos.filter(e => config.checkRecent(e.datePosted, config.curDateYT));
            // Send videos out
            if (ftVideos.length === 0) {
                console.log('No new videos found...');
            }
            else {
                // Tag me
                msg.channel.send(`@${msg.author.username}`);
                // Send a msg with the videos
                ftVideos.forEach(video => { msg.channel.send(video.format()); });
                console.log(`Found and posted ${ftVideos.length} videos`);
            }
            // Get new time
            config.curDateYT = new Date().getTime();
        });
}
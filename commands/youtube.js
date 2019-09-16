const config = require('../config/config.js');
const Video = require('../config/video.js');
const fetch = require('node-fetch');
const fs = require('fs');
let ch;

module.exports = {
    name: 'youtube',
    description: 'Turns youtube checking on/off.',
    // eslint-disable-next-line no-unused-vars
    execute(msg, args) {
        typeof config.ytFetchOptions.channel === 'undefined' ? ch = msg.channel : ch = config.ytFetchOptions.channel ;
        if (config.ytFetchOptions.isChecking === false) {
            ch.send('I guess I can get those videos for you...');
            fetchVideos();
            config.ytTimerObj = setInterval(() => { fetchVideos(); }, config.ytTimer);
            config.ytFetchOptions.isChecking = !config.ytFetchOptions.isChecking;
            config.ytFetchOptions.channel = ch;
        }
        else {
            ch.send('Roger! No more looking for new videos.');
            clearInterval(config.ytTimerObj);
            config.ytFetchOptions.isChecking = !config.ytFetchOptions.isChecking;
            config.ytFetchOptions.channel = undefined;
        }
    },
};

function fetchVideos() {
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
            let ftVideos = videoList.filter(e => config.filterPositive(e.title, config.ytFilterList));
            // Check recency
            ftVideos = ftVideos.filter(e => config.checkRecent(e.datePosted, config.ytFetchOptions.lastCheckTS));
            // Send videos out
            if (ftVideos.length === 0) {
                console.log('No new videos found...');
            }
            else {
                // Tag me
                ch.send('@Vinesma');
                // Send a msg with the videos
                ftVideos.forEach(video => { ch.send(video.format()); });
                console.log(`Found and posted ${ftVideos.length} videos`);
            }
            // Get new time
            config.ytFetchOptions.lastCheckTS = new Date().getTime();
            fs.writeFile('./storage/ytFetchOptions.json', JSON.stringify(config.ytFetchOptions), (err) => {
                if (typeof err !== 'object') {
                    console.error(`!youtube - Error while saving config file: ${err}`);
                }
            });
        });
}
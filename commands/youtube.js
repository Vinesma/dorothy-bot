const config = require('../config/config.js');
const Video = require('../config/video.js');
const fetch = require('node-fetch');
const fs = require('fs');

module.exports = {
    name: 'youtube',
    description: 'Turns youtube checking on/off.',
    // eslint-disable-next-line no-unused-vars
    execute(msg, args) {
        if (config.ytFetchOptions.isChecking === false) {
            msg.channel.send('Looking for new videos!');
            fetchVideos(msg.channel);
            config.ytTimerObj = setInterval(() => { fetchVideos(msg.channel); }, config.ytTimer);
            config.ytFetchOptions.isChecking = !config.ytFetchOptions.isChecking;
        }
        else {
            msg.channel.send('No more looking for new videos.');
            clearInterval(config.ytTimerObj);
            config.ytFetchOptions.isChecking = !config.ytFetchOptions.isChecking;
            fs.unlink('./storage/ytLastChannel.json', (err) => {
                if (typeof err !== 'object') {
                    console.error(`!youtube:UNLINK - ${err}`);
                }
            });
        }
    },
    resume(ch) {
        ch.send('Resuming !youtube...');
        fetchVideos(ch);
        config.ytTimerObj = setInterval(() => { fetchVideos(ch); }, config.ytTimer);
        config.ytFetchOptions.isChecking = true;
    },
};

function fetchVideos(ch) {
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
                // Send a msg with the videos
                ftVideos.forEach(video => { ch.send(video.format()); });
                console.log(`Found and posted ${ftVideos.length} videos`);
            }
            // Get new time
            config.ytFetchOptions.lastCheckTS = new Date().getTime();
            const info = { channelId : ch.id, cmd : 'youtube' };
            fs.writeFile('./storage/ytLastChannel.json', JSON.stringify(info), (err) => {
                if (typeof err !== 'object') {
                    console.error(`!youtube:WRITE_FILE - ${err}`);
                }
            });
        });
}
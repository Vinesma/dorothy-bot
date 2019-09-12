const config = require('../config/config.js');
const fetch = require('node-fetch');
const booruImg = require('../config/booruImg.js');

module.exports = {
    name: 'danbooru',
    description: 'Turns danbooru checking on/off.',
    // eslint-disable-next-line no-unused-vars
    execute(msg, args) {
        if (config.isCheckingDB === false) {
            msg.channel.send('Okay, I will observe danbooru for you...');
            fetchDB(msg);
            config.timerDB = setInterval(() => {
                fetchDB(msg);
            }, config.intervalDB);
            config.isCheckingDB = !config.isCheckingDB;
        }
        else {
            msg.channel.send('No more booru checking!');
            clearInterval(config.timerDB);
            config.isCheckingDB = !config.isCheckingDB;
        }
    },
};

function fetchDB(msg) {
    fetch(config.dbAPI_LINK)
        .then(res => res.json())
        .then(data => {
            const dbPostList = [];
            // List all posts
            data.forEach(post => {
                const datePosted = new Date(post.created_at).getTime();
                const p = new booruImg(post.id, datePosted, config.dbLink, post.is_pending, post.is_flagged, post.tag_string_general, post.tag_string_character);
                dbPostList.push(p);
            });
            // Filter posts out by tags
            let ftPosts = dbPostList.filter(e => config.filterNegative(e.tag_string, config.filterListDB));
            // Check recency
            ftPosts = ftPosts.filter(e => config.checkRecent(e.datePosted, config.curDateDB));
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
            config.curDateDB = new Date().getTime();
        });
}
const config = require('../config/config.js');
const booruImg = require('../config/booruImg.js');
const fetch = require('node-fetch');

module.exports = {
    name: 'danbooru',
    description: 'Turns danbooru checking on/off.',
    execute(msg, args) {
        if (args.length >= 1 && args.length <= 2) {
            if (config.isCheckingDB === false) {
                msg.channel.send('Okay, I will observe danbooru for you...');
                args = config.formatDB(args);
                fetchDB(msg, args);
                config.timerDB = setInterval(() => { fetchDB(msg, args); }, config.intervalDB);
                config.isCheckingDB = !config.isCheckingDB;
            }
            else {
                msg.channel.send('No more booru checking!');
                clearInterval(config.timerDB);
                config.isCheckingDB = !config.isCheckingDB;
            }
        }
        else if (config.isCheckingDB === true) {
            msg.channel.send('No more booru checking!');
            clearInterval(config.timerDB);
            config.isCheckingDB = !config.isCheckingDB;
        }
        else {
            msg.channel.send('This command requires at least one argument but no more than 2');
        }
    },
};

function fetchDB(msg, args) {
    fetch(config.dbAPI_LINK + args.join('+'))
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
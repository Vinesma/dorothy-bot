// Youtube vars
const requests = 8; // How many requests to return?
const ytTOKEN = process.env.YT_TOKEN; // Set TOKEN

exports.filterList = ['dark souls', 'chilluminati', 'pokemon']; //lowercase

exports.isCheckingYT = false;
exports.timer = undefined;
exports.intervalYT = 3600000 * 2; //3600000 = hourly

exports.ytLink = "https://www.youtube.com/watch?v=";
exports.ytAPI_LINK = `https://www.googleapis.com/youtube/v3/activities?part=snippet%2CcontentDetails&channelId=UCQBs359lwzyVFtc22LzLjuw&maxResults=${requests}&key=${ytTOKEN}`;

// Danbooru vars
const dbRequests = 20; // How many requests to return?

exports.filterListDB = ['4koma', 'comic'];
exports.isCheckingDB = false;
exports.timerDB = undefined;
exports.intervalDB = 3600000 * 5;

exports.dbLink = "https://danbooru.donmai.us/posts/";
exports.dbAPI_LINK = `https://danbooru.donmai.us/posts.json?limit=${dbRequests}&tags=girls_und_panzer`;

// FUNCTIONS

exports.filterVideos = (a1, a2) => {
    let tempArray = [];

    a1.forEach(elem => {
        for (let i = 0; i < a2.length; i++) {
            if (elem.title.toLowerCase().includes(a2[i])) {
                tempArray.push(elem);
                continue;
            }
        }
    });

    return tempArray;
}

exports.filterPosts = (a1, a2) => {
    let tempArray = [];

    a1.forEach(elem => {
        tempArray.push(elem);
        for (let i = 0; i < a2.length; i++) {
            if (elem.tag_string.includes(a2[i])) {
                tempArray.pop(elem);
                continue;
            }
        }
    });

    return tempArray;
}

exports.recentElem = (a1, date) => {
    let tempArray = [];

    a1.forEach(elem => {
        if (elem.datePosted >= date) tempArray.push(elem);
    });

    return tempArray;
}
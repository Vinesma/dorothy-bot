// YOUTUBE VARS
// How many requests to return?
const requests = 8;
// Set TOKEN
const ytTOKEN = process.env.YT_TOKEN;
// Filters for youtube
exports.filterList = ['Dark Souls', 'Chilluminati', 'Pokemon', 'Open TTD'];
exports.isCheckingYT = false;
exports.timer = undefined;
// 3600000 = hourly
const setTimerYT = 3600000 * 3;
exports.intervalYT = setTimerYT;
exports.curDateYT = new Date().getTime() - setTimerYT;
exports.ytLink = 'https://www.youtube.com/watch?v=';
exports.ytAPI_LINK = `https://www.googleapis.com/youtube/v3/activities?part=snippet%2CcontentDetails&channelId=UCQBs359lwzyVFtc22LzLjuw&maxResults=${requests}&key=${ytTOKEN}`;

// DANBOORU VARS
// How many requests to return?
const dbRequests = 20;
exports.filterListDB = ['4koma', 'Comic'];
exports.isCheckingDB = false;
exports.timerDB = undefined;
// 3600000 = hourly
const setTimerDB = 3600000 * 6;
exports.intervalDB = setTimerDB;
exports.curDateDB = new Date().getTime() - setTimerDB;
exports.dbLink = 'https://danbooru.donmai.us/posts/';
exports.dbAPI_LINK = `https://danbooru.donmai.us/posts.json?limit=${dbRequests}&tags=`;

// FUNCTIONS
// Returns true in item checks
exports.filterPositive = (string, filterList) => {
    for (let i = 0; i < filterList.length; i++) {
        if(string.toLowerCase().includes(filterList[i].toLowerCase())) {
            return true;
        }
    }
    return false;
};
// Returns false in item checks
exports.filterNegative = (string, filterList) => {
    for (let i = 0; i < filterList.length; i++) {
        if(string.toLowerCase().includes(filterList[i].toLowerCase())) {
            return false;
        }
    }
    return true;
};

// Checks recency of elem
exports.checkRecent = (elemDate, checkDate) => {
    if (elemDate >= checkDate) {
        return true;
    }
    else {
        return false;
    }
};

// Formats danbooru arguments (for some reason .filter didn't work lmao)
exports.formatDB = (extArray) => {
    const tempArray = [];

    for (let i = 0; i < extArray.length; i++) {
        if (typeof extArray[i] === 'string') {
            tempArray.push('~' + extArray[i].toLowerCase());
        }
    }

    return tempArray;
};
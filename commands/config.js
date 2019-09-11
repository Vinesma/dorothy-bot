// Youtube vars
const requests = 8; // How many requests to return?
const ytTOKEN = process.env.YT_TOKEN; // Set TOKEN

exports.filterList = ['Dark Souls', 'Chilluminati', 'Pokemon'];

exports.isCheckingYT = false;
exports.timer = undefined;
exports.intervalYT = 3600000 * 3; //3600000 = hourly

exports.ytLink = "https://www.youtube.com/watch?v=";
exports.ytAPI_LINK = `https://www.googleapis.com/youtube/v3/activities?part=snippet%2CcontentDetails&channelId=UCQBs359lwzyVFtc22LzLjuw&maxResults=${requests}&key=${ytTOKEN}`;

// Danbooru vars
const dbRequests = 20; // How many requests to return?

exports.filterListDB = ['4koma', 'Comic'];
exports.isCheckingDB = false;
exports.timerDB = undefined;
exports.intervalDB = 3600000 * 6;

exports.dbLink = "https://danbooru.donmai.us/posts/";
exports.dbAPI_LINK = `https://danbooru.donmai.us/posts.json?limit=${dbRequests}&tags=girls_und_panzer`;

// FUNCTIONS

exports.filterPositive = (string, filterList) => { // Returns true in item checks
    for (let i = 0; i < filterList.length; i++) {
        if(string.toLowerCase().includes(filterList[i].toLowerCase())){
            return true;
        }
    }
    return false;
}

exports.filterNegative = (string, filterList) => { // Returns false in item checks
    for (let i = 0; i < filterList.length; i++) {
        if(string.toLowerCase().includes(filterList[i].toLowerCase())){
            return false;
        }    
    }
    return true;
}

exports.checkRecent = (elemDate, checkDate) => { // Checks recency of elem
    if (elemDate >= checkDate) {
        return true;
    } else {
        return false;
    }
}
// Youtube vars
const requests = 8; // How many requests to return?
const ytTOKEN = process.env.YT_TOKEN // Set TOKEN

exports.filterList = ['dark souls', 'chilluminati', 'pokemon'] //lowercase

exports.ytDate; // Date last checked youtube
exports.isCheckingYT = false;
exports.timer = false;
exports.intervalYT = 3600000 * 2; //3600000 = hourly

exports.ytLink = "https://www.youtube.com/watch?v=";
exports.ytAPI_LINK = `https://www.googleapis.com/youtube/v3/activities?part=snippet%2CcontentDetails&channelId=UCQBs359lwzyVFtc22LzLjuw&maxResults=${requests}&key=${ytTOKEN}`

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

exports.recentVideos = (a1, a2) => {
    let tempArray = [];
    let isRecent = true;
    
    a1.forEach(elem => {
        for (let i = 0; i < a2.length; i++) {
            if (elem.id === a2[i]) {
                isRecent = false;
                continue;
            } 
        }
        if (isRecent) {
            tempArray.push(elem);
        }
        isRecent = true;
    });

    return tempArray;
}
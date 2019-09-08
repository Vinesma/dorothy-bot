// Youtube vars
const requests = 12; // How many requests to return?
const ytTOKEN = process.env.YT_TOKEN // Set TOKEN

exports.filterList = ['dark souls', 'chilluminati', 'pokemon'] //lowercase

exports.isCheckingYT = false;
exports.timer = false;
exports.intervalYT = 7200000; //3600000 = hourly

exports.ytLink = "https://www.youtube.com/watch?v=";
exports.ytAPI_LINK = `https://www.googleapis.com/youtube/v3/activities?part=snippet%2CcontentDetails&channelId=UCQBs359lwzyVFtc22LzLjuw&maxResults=${requests}&key=${ytTOKEN}`
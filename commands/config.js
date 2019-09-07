// Youtube vars
const requests = 3; // How many requests to return?
const ytTOKEN = process.env.YT_TOKEN // Set TOKEN

exports.isCheckingYT = false;
exports.ytLink = "https://www.youtube.com/watch?v=";
exports.ytAPI_LINK = `https://www.googleapis.com/youtube/v3/activities?part=snippet%2CcontentDetails&channelId=UCQBs359lwzyVFtc22LzLjuw&maxResults=${requests}&key=${ytTOKEN}`
const { urlencoded } = require('express');
const { youtube } = require('../config.json');
//curl \
//  'https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=OPL&key=[YOUR_API_KEY]' \
//  --header 'Authorization: Bearer [YOUR_ACCESS_TOKEN]' \
//  --header 'Accept: application/json' \
//  --compressed

// 'https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=UCFUTYcj_6fwrw207-YAghLA&q=opl&key=[YOUR_API_KEY]' \
// --header 'Accept: application/json' \
// --compressed

module.exports = async (term) => {
    const url = new URL("https://youtube.googleapis.com/youtube/v3/search?");
    //console.log('termo recebido: ', term);
    const params = new URLSearchParams({
        maxResults: 3,
        part: "snippet",
        q: term,
        channelId: "UCFUTYcj_6fwrw207-YAghLA",
        key: youtube
    });
    //console.log(params)
    //console.log(url + encodeURIComponent(params));
    const headers = {
        headers: {
            Accept: "application/json"
        }
    };
    const response = await fetch(url + params, {headers});
    //console.log(await response.json());
    const videos = await response.json();
    //let videos = 'ok';
    //console.log(videos.items);
    return videos.items;
}
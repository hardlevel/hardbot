const { mobby } = require('../config.json');
const {stringify} = require('querystring');
//const crypto = require('crypto');
//const querystring = require('node:querystring'); 

async function gameDetails (title) {
    const baseUrl = new URL('https://api.mobygames.com/v1/games');
    const params = {
        title,
        platform:7,
        format:'normal',
        api_key:mobby
    };
    baseUrl.search = stringify(params);
    const options = {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }
    //console.log(baseUrl);
    //console.log(title);
    //console.log(options);

    try {
        const response = await fetch(baseUrl.href, options);
        const responseBody = await response.json();
        //console.log(responseBody);
        return responseBody;
    } catch (error) {
        console.log(error);
        return error.message
    }
}

async function gameCover (title) {
    const baseUrl = new URL('https://api.mobygames.com/v1/games');
    const params = {
        title,
        platform:7,
        format:'normal',
        api_key:mobby
    };
    baseUrl.search = stringify(params);
    const options = {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }
    //console.log(baseUrl);
    //console.log(title);
    //console.log(options);

    try {
        const response = await fetch(baseUrl.href, options);
        const responseBody = await response.json();
        //console.log(responseBody);
        return responseBody.games[0].sample_cover.image;
    } catch (error) {
        console.log(error);
        return error.message
    }
}

module.exports.mobby = { gameDetails, gameCover };

// const { moby } = require('./functions/mobby');
// (async() => {
//     try {
//         const result = await moby('delta force: black hawk down');
//         console.log(result.games[0].sample_cover.image);
//     } catch (error) {
//         console.error(error);
//     }
// })();
const { facebook_token, facebook_secret } = require('../config.json');
const crypto = require('crypto');
//const querystring = require('node:querystring'); 

module.exports = async (data) => {
    console.log('inicio!');
    console.log(data);

    let message = data;
    //const message = "teste " + new Date();

    const appsecret_proof = crypto.createHmac('sha256', facebook_secret).update(facebook_token).digest('hex');
    console.log(appsecret_proof);

    const baseUrl = "https://graph.facebook.com/"
    
    const params = {
        message,
        appsecret_proof,
        access_token: facebook_token
    }

    const options = {
        method: 'POST',
        body: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' }
    }

    try {
        const response = await fetch(baseUrl + "228412443934071/feed", options)
        console.log(await response.json());
        return response.json();
    } catch (error) {
        console.log(error);
        return error.message
    }
    //"https://graph.facebook.com/{group-id}/feed?limit=5&amp;access_token=EAACEdEos0..."
    try {
        const response = await fetch(baseUrl + "/feed")
    } catch (error) {
        return error.message
    }
}
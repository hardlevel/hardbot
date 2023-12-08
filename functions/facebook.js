const { facebook_token, facebook_secret } = require('../config.json');
const crypto = require('crypto');
//const querystring = require('node:querystring'); 

module.exports = async (message) => {
    const appsecret_proof = crypto.createHmac('sha256', facebook_secret).update(facebook_token).digest('hex');
    
    const baseUrl = "https://graph.facebook.com/"
    
    // const params = {
    //     message,
    //     appsecret_proof,
    //     access_token: facebook_token
    // }

    // const options = {
    //     method: 'POST',
    //     body: JSON.stringify(params),
    //     headers: { 'Content-Type': 'application/json' }
    // }

    // try {
    //     const response = await fetch(baseUrl + "228412443934071/feed", options)
    //     console.log(await response.json());
    //     return response.json();
    // } catch (error) {
    //     console.log(error);
    //     return error.message
    // }
    const results = [];

    const fetchData = async () => {
        try {
            url = baseUrl + "228412443934071/feed";
            console.log(url);
            const response = await fetch(url, {
                method: 'post',
                body: JSON.stringify({access_token: facebook_token, appsecret_proof, message}),
                headers: { "Content-Type": "application/json" }
            });
            const data = await response.json();
            console.log(data);
            results.push(data);
        } catch (error) {
            console.log(error);
            return error.message
        }
    }

    return fetchData().then(results => console.log(results)).catch(error => console.error(error));
}
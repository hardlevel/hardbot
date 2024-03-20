const { fb_group_token, fb_group_app, fb_group_id, fb_group_app_token, fb_group_secret } = require('../config.json');
const crypto = require('crypto');
//const querystring = require('node:querystring');

module.exports = async (message, image = null) => {
    console.log('inicio!');
		console.log(image);
    const appsecret_proof = crypto.createHmac('sha256', fb_group_secret).update(fb_group_token).digest('hex');

    const baseUrl = "https://graph.facebook.com/";
    const groups = fb_group_id.split(",");

    //appsecret_proof,
    const results = [];
		const body = {
			message,
			access_token: fb_group_token
		}
		if (image) {
			body.link = 'https://hdlvl.dev/s/discord';
			body.picture = image;
		}
    const fetchData = async () => {
        for (const group of groups) {
            try {
                console.log('enviando para grupo ', group);
                url = baseUrl + group + "/feed";
                console.log(url);
                const response = await fetch(url, {
                    method: 'post',
                    body: JSON.stringify(body),
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
    }

    return fetchData().then(results => console.log(results)).catch(error => console.error(error));
}
//const crypto = require('crypto');
//const querystring = require('node:querystring');
const { api_token } = require('../config.json');
const winston = require('winston');
module.exports = async (id) => {
    let token = encodeURIComponent(api_token);
    //console.log('id recebida para api: ', id);
    const baseUrl = `https://hdlvl.dev/api/ali/${token}/${id}`;

    const options = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    }

    try {
        const response = await fetch(baseUrl, options)
        //console.log(await response.json())
        return await response.json();
    } catch (error) {
        console.log(error);
				logger.error(error);
        return error.message;
    }
}
//const crypto = require('crypto');
//const querystring = require('node:querystring'); 
const { api_token } = require('../config.json');

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
        return await response.json();
    } catch (error) {
        console.log(error);
        return error.message
    }
}
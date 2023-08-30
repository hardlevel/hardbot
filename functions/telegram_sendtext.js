const { telegram_chatId, telegram_token } = require('../config.json');
//const crypto = require('crypto');
//const querystring = require('node:querystring'); 

module.exports = async (message) => {
    const baseUrl = `https://api.telegram.org/bot${telegram_token}/sendPhoto`;

    message.chat_id = telegram_chatId;
    
    const options = {
        method: 'POST',
        body: JSON.stringify(message),
        headers: { 'Content-Type': 'application/json' }
    }

    console.log(message);
    console.log(options);

    try {
        const response = await fetch(baseUrl, options)
        console.log(await response);
        return response;
    } catch (error) {
        console.log(error);
        return error.message
    }
}
// const params = {
//     text,
//     chat_id: telegram_chatId,
// }
const { telegram_token, telegram_groups } = require('../config.json');
const fs = require('fs');
// "telegram_groups":"-1001741523044,-1001365902217,-1001609175087"
// "telegram_groups":"-1001741523044,-1001365902217,-1001609175087"
// const groups = telegram_groups.split(",");
const groups = [telegram_groups];
const pinned = require('../data/pin.json');

module.exports = async (message) => {
  console.log(1);
  // await unPinAll('@hardlevel_teste');
  await proccessPins(pinned);

  groups.forEach(group => {
    message.chat_id = group;

    const options = {
      method: 'POST',
      body: JSON.stringify(message),
      headers: { 'Content-Type': 'application/json' },
    };
    const response = sendMessage(options);
  });
};

async function sendMessage(options) {
  try {
    const baseUrl = `https://api.telegram.org/bot${telegram_token}/sendMessage`;
    const response = await fetch(baseUrl, options);
    const responseBody = await response.json();
    const message_id = responseBody.result.message_id;
    const chat_id = responseBody.result.chat.id;
    const pinedMsg = await pinMessage(chat_id, message_id);
    console.log(pinedMsg);
    // console.log(responseBody);
    return responseBody;
  }
  catch (error) {
    console.log(error);
    return error.message;
  }
}

async function pinMessage(chat_id, message_id) {  
  try {
    const stored = await storeData(chat_id, message_id);
    const options = {
      method: 'POST',
      body: JSON.stringify({ chat_id, message_id }),
      headers: { 'Content-Type': 'application/json' }
    };
    const baseUrl = `https://api.telegram.org/bot${telegram_token}/pinChatMessage`;
    const response = await fetch(baseUrl, options);
    const responseBody = await response.json();
    // console.log(responseBody);
    return responseBody;
  }
  catch (error) {
    console.log(error);
    return error.message;
  }
}

async function unPinAll(chat_id) {
  console.log(4);
  try {    
    const options = {
      method: 'POST',
      body: JSON.stringify({ chat_id }),
      headers: { 'Content-Type': 'application/json' }
    };
    console.log(options);
    const baseUrl = `https://api.telegram.org/bot${telegram_token}/unpinAllChatMessages`;
    const response = await fetch(baseUrl, options);
    const responseBody = await response.json();
    console.log(responseBody);
    console.log(5);
    return responseBody;
  }
  catch (error) {
    console.log(error);
    return error.message;
  }
}

async function proccessPins(pinned) {
  console.log(2);
  console.log(pinned);
  for (let i = pinned.length - 1; i > -1; i--) {
    try {
      const pin = pinned[i];
      console.log(pin.msg);
      unPinMessage(pin.chat, pin.msg);
      pinned.splice(i, 1);
    } catch (error) {
      console.log(error.message);
    }
  }
  fs.writeFileSync('data/pin.json', JSON.stringify(pinned));
}

async function unPinMessage(chat_id, message_id) {
  console.log(3);
  try {
    const options = {
      method: 'POST',
      body: JSON.stringify({ chat_id, message_id }),
      headers: { 'Content-Type': 'application/json' }
    };
    console.log(options);
    const baseUrl = `https://api.telegram.org/bot${telegram_token}/unpinChatMessage`;
    const response = await fetch(baseUrl, options);
    const responseBody = await response.json();
    console.log(responseBody);
    return responseBody;
  }
  catch (error) {
    console.log(error);
    return error.message;
  }
}

async function storeData(chat, msg) {
  try {
    const dadosRequisicao = { chat, msg };
    let conteudoAtual = [];
    try {
      conteudoAtual = JSON.parse(fs.readFileSync('data/pin.json'));
    }
    catch (error) {
      console.log(error.message)
    }
    conteudoAtual.push(dadosRequisicao);
    fs.writeFileSync('data/pin.json', JSON.stringify(conteudoAtual, null, 2));
    console.log('Dados adicionados com sucesso ao arquivo JSON.');
  }
  catch (error) {
    console.error('Erro ao adicionar dados ao arquivo JSON:', error.message);
  }
}

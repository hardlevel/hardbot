const { client } = require('../index')
const alertForum = "Seu post em nosso forum não pode ser aprovado pois o título possui palavras não permitidas ou é curto demais, por favor leia as regras com atenção antes de enviar mensagens no server. \n Mensagens com titulos extremamente vagos que não detalham o problema não serão aprovados!"
const filter = ['ajuda','ajude','me ajuda','socorro','urgente']
const { MessageManager, EmbedBuilder } = require('discord.js')
const axios = require('axios');
const { urlencoded } = require('express');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

module.exports = (client) => {
    client.on('messageCreate', async message => {        
        //console.log(message)
        const author = message.author
        const content = message.content
        const channel = client.channels.cache.get(message.channelId);
        console.log(author.username + ' - ' + channel.name + ' - ' + content)
        if (author != '1063528592648192011'){
            console.log('mensagem não é do bot')
            //const regex = /https?:\/\/.*?aliexpress\.com\/item\/(\d+)\.html/i;
            //const regex = /https?:\/\/(?:.*?\.?aliexpress\.com\/(?:[^\/]+\/)?(?:[^\/]+\/)?(?:item\/)?([\w-]+)(?:\.html)?|(?:[^\/]+\.)?(?:[a-z]+\.)?aliexpress\.com\/(?:e|item)\/([\w-]+))/i;
            //const regex = /((http|ftp|https):\/\/)?(([\w.-]*)\.([\w]*))/i
            const regex = /((http|ftp|https):\/\/)?(([\w.-]*)\.aliexpress\.com([:\d]*)?)([\w.-\/]*)*/i;

            const match = content.match(regex);
        
            if (match) {
                //console.log(match.input)
                const url = match.input;
                try {
                    const productId = await getProductId(url)
                    const shortUrl = await getShotUrl(productId)
                    const metaData = await getOpenGraphData(productId)               
                    console.log('ID do produto: ' + productId);
                    console.log('URL Reduzida: ' + shortUrl);
                    console.log('Meta: ' + metaData.ogTitle)
                    await replyMsg(message, productId, shortUrl, metaData)                    
                } catch (err) {
                    console.log(err)
                }  
            }
        }
    });

    client.on('threadCreate', async (thread) => {
        //console.log(thread)
        let postMember = thread.ownerId
        let messageId = thread.id
        let channelId = thread.parentId
        if (thread.parent.type === 15){
            if (filter.some(substring=>thread.name.includes(substring))){
                client.users.send(postMember, alertForum);
                thread.delete()
            }
            var palavras = thread.name.split(" ");
            if (palavras.length <= 2) {
                client.users.send(postMember, alertForum);
                thread.delete()
            }
        }
    })
}

async function getProductId(url) {
    console.log('URL recebida para obter ID: ' + url)
    let finalUrl = ''
    if (url.includes('/item/')){
        const newUrl = new URL(url)
        const productPath = newUrl.pathname
        const regex = /\/item\/(\d+)\.html/
        const match = productPath.match(regex);
        const productId = match[1]
        console.log('ID do produto: ' + productId)
        return productId
    } else {
        finalUrl = url
        try{
            const response = await axios.get(finalUrl)
            const productUrl = new URL(response.request.res.responseUrl)
            // if (productUrl.includes('https://aliexpress.ru')){u
            //     productUrl = productUrl.replace('https://aliexpress.ru', 'https://pt.aliexpress.com')
            // }
            const productPath = productUrl.pathname
            console.log(productPath)
            console.log(productUrl)
            const regex = /\/item\/(\d+)\.html/
            const match = productPath.match(regex);
            const productId = match[1]
            console.log('ID do produto: ' + productId)
            return productId
        } catch(err) {
            console.log(err)
        }
    }
}

async function getShotUrl(id) {
    console.log('ID recebida para api: ' + id);
    //const apiUrl = 'http://127.0.0.1:8000/api/ali/' + id;
    const apiUrl = 'http://aliapi/api/ali/' + id;
    return new Promise((resolve, reject) => {
        axios.get(apiUrl)
        .then(function(response) {
            console.log("Resultado API: " + response.data.link[0].promotion_link);
            //console.log(response.status);
            //console.log(response.statusText);
            resolve(response.data.link[0].promotion_link);
        })
        .catch(function(error) {
            //console.error(error);
            reject(error);
        });
    });
}

// async function getOpenGraphData(id) {
//     const url = `https://pt.aliexpress.com/item/${id}.html`
//     const ogs = require('open-graph-scraper');
//     const options = { url: `https://pt.aliexpress.com/item/${id}.html`, redirect: "error" };

//     let result;
//     let attempts = 0;

//     while (attempts < 100 && (!result || !result.ogTitle)) {
//         try {
//             const { error, html, result: ogResult, response } = await ogs(options);

//             //console.log('error:', error);
//             //console.log('result:', ogResult);

//             result = ogResult;
//             attempts++;
//         } catch (error) {
//             console.error('Error:', error);
//             return null;
//         }
//     }

//     if (result && result.ogTitle) {
//         return result;
//     } else {
//         return null;
//     }
// }

async function getOpenGraphData(id) {
    const url = `https://pt.aliexpress.com/item/${id}.html`
    let ogData = null;

    while (!ogData) {
        console.log('Tentando resgatar informações...')
        try {
            console.log('começando...')
            const response = await fetch(url, { redirect: 'manual' });

            if (!response.ok) {
                throw new Error('Erro ao obter o conteúdo da URL.');
            }

            const html = await response.text();

        // Use o cheerio para carregar o HTML
            const $ = cheerio.load(html);

            ogData = {
                ogTitle: $('meta[property="og:title"]').attr('content'),
                ogDescription: $('meta[property="og:description"]').attr('content'),
                ogImage: $('meta[property="og:image"]').attr('content'),
                // Adicione outras tags OpenGraph que você precisa extrair
            };
        } catch (error) {
            console.error('Erro ao obter os dados do OpenGraph:', error.message);
        }
    }
    console.log(ogData)
    return ogData;
}

async function replyMsg(message, productId, shortUrl, metaData){
    //console.log(metaData)
    const productMessage = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(metaData.ogTitle.split('|')[1].trim())
        .setURL(shortUrl)
        .setAuthor({ name: 'Venão', iconURL: 'https:' + metaData.favicon, url: shortUrl })
        .setDescription(metaData.ogTitle)
        .setThumbnail(metaData.ogImage[0].url)
        .setImage(metaData.ogImage[0].url)
        .setTimestamp()
        .setFooter({ text: 'Aproveite esta oferta incrível!', iconURL: metaData.ogImage[0].url });    
    message.reply({embeds: [productMessage]})
        .then(msg => setTimeout(() => message.delete(), 3000))
        .then(sendToTelegram(shortUrl, metaData))
}

async function sendToTelegram(shortUrl, metaData){
    const url = 'https://api.telegram.org/bot';
    const apiToken = process.env.TELEGRAM_TOKEN;
    console.log('Url recebida para enviar para o telegram: ' + shortUrl)
    const chat_id = process.env.TELEGRAM_CHAT
    const caption = `Confira esse produto que foi compartilhado no Discord! Talvez seja do seu interesse! ${metaData.ogTitle} ${shortUrl}`
    const photo = metaData.ogImage[0].url.toString() + '?random=64'
    //tg.telegram.sendMessage(chatId, text)
    axios.post(`${url}${apiToken}/sendPhoto`,
    {
        chat_id,
        caption,
        photo
    })
}
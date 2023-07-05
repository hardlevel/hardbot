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
                    //console.log('Meta: ' + metaData.image)
                    await replyMsg(message, productId)                    
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
    const apiUrl = process.env.API_URL + id;
    //const apiUrl = 'http://aliapi/api/ali/' + id;
    try {
        const response = await axios.get(apiUrl);
        let data = ''
        if(response.data.erro){
            //console.log('O produto não suporta link de afiliado :(')
            data = { erro: "O produto não suporta link de afiliado :(" }
        } else {
            data = {
                title: response.data.title,
                link: response.data.link,
                price: response.data.price,
                image: response.data.image,
                discount: response.data.discount
            };
        }

        return data;
    } catch (error) {
        console.log(error);
    }
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

// async function getOpenGraphData(id) {
//     const url = `https://pt.aliexpress.com/item/${id}.html`
//     let ogData = null;

//     while (!ogData) {
//         console.log('Tentando resgatar informações...')
//         try {
//             console.log('começando...')
//             // const response = await fetch(url, { redirect: 'manual' });

//             // if (!response.ok) {
//             //     throw new Error('Erro ao obter o conteúdo da URL.');
//             // }
//             const response = await axios.get(url, { follow: false });

//             if (!response.status === 200) {
//                 throw new Error('Erro ao obter o conteúdo da URL.');
//             }

//             //const html = await response.text();
//             const html = await response.data;
            
//             // Use o cheerio para carregar o HTML
//             const $ = cheerio.load(html);
//             //console.log($)
//             ogData = {
//                 ogTitle: $('meta[property="og:title"]').attr('content'),
//                 ogDescription: $('meta[property="og:description"]').attr('content'),
//                 ogImage: $('meta[property="og:image"]').attr('content'),
//                 // Adicione outras tags OpenGraph que você precisa extrair
//             };
//         } catch (error) {
//             console.error('Erro ao obter os dados do OpenGraph:', error.message);
//         }
//     }
//     console.log(ogData)
//     return ogData;
// }

// async function getOpenGraphData(id) {
//     const url = `https://pt.aliexpress.com/item/${id}.html`;
//     const maxAttempts = 5;
//     const delay = 1000; // tempo de espera em milissegundos
//     let ogData = null;
//     let attempt = 1;

//     while (attempt <= maxAttempts && ogData === null) {
//         console.log('Tentativa: ' + attempt);

//         try {
//             const response = await axios.get(url, { maxRedirects: 0 });
    
//             if (response.status !== 200) {
//             throw new Error('Erro ao obter o conteúdo da URL.');
//             }
    
//             const html = response.data;
    
//             // Use o cheerio para carregar o HTML
//             const $ = cheerio.load(html);
    
//             ogData = {
//             ogTitle: $('meta[property="og:title"]').attr('content'),
//             ogDescription: $('meta[property="og:description"]').attr('content'),
//             ogImage: $('meta[property="og:image"]').attr('content'),
//             // Adicione outras tags OpenGraph que você precisa extrair
//             };
//         } catch (error) {
//             console.error('Erro ao obter os dados do OpenGraph:', error.message);
//         }
    
//         attempt++;
    
//         if (ogData === null && attempt <= maxAttempts) {
//             await new Promise((resolve) => setTimeout(resolve, delay));
//         }
//         }
    
//         console.log(ogData);
//         return ogData;
// }

// async function getOpenGraphData(id) {
//     const url = `https://pt.aliexpress.com/item/${id}.html`;
//     const maxAttempts = 50;
//     const delay = 1000; // Delay entre as tentativas (em milissegundos)
//     let ogData = null;
//     let attempt = 1;

//     while (attempt <= maxAttempts && (ogData === null || ogData === undefined || hasUndefinedValues(ogData))) {
//         console.log('Tentativa: ' + attempt);

//         try {
//             const response = await axios.get(url, { maxRedirects: 0 });

//             if (response.status !== 200) {
//                 throw new Error('Erro ao obter o conteúdo da URL.');
//             }

//             const html = response.data;

//             const $ = cheerio.load(html);

//             ogData = {
//                 ogTitle: $('meta[property="og:title"]').attr('content'),
//                 ogDescription: $('meta[property="og:description"]').attr('content'),
//                 ogImage: $('meta[property="og:image"]').attr('content'),
//                 // Adicione outras tags OpenGraph que você precisa extrair
//             };
//         } catch (error) {
//             console.error('Erro ao obter os dados do OpenGraph:', error.message);
//         }

//         attempt++;

//         if (!ogData && attempt <= maxAttempts) {
//             await new Promise((resolve) => setTimeout(resolve, delay));
//         }
//     }

//     console.log(ogData);
//     return ogData;
// }

// async function getProductInfo(id){
//     const apiUrl = 'http://aliapi/api/product/' + id;
//     //const apiUrl = 'http://127.0.0.1:8000/api/product/' + id;
//     return new Promise((resolve, reject) => {
//         axios.get(apiUrl)
//         .then(function(response) {
//             console.log("Resultado API: " + response.data);
//             //console.log(response.status);
//             //console.log(response.statusText);
//             resolve(response.data);
//         })
//         .catch(function(error) {
//             //console.error(error);
//             reject(error);
//         });
//     });
// }

async function replyMsg(message, productId, shortUrl, metaData){
    const data = await getShotUrl(productId);
    console.log('Retorno da API:' + data)
    if (data.erro == undefined){
        message.reply('Houve um erro ao tentar gerar o bot, contate o administrador, se você for o administrar, meu amigo, você tá lascada pra resolver essa buxa, boa sorte!')
        return
    }
    if (data.erro){
        message.reply('O produto não tem suporte a link de afiliado, use o link original: https://pt.aliexpress.com/item' + productId + '.html')
        return
    } else {
        console.log('URL Reduzida: ' + data.link)
        console.log(metaData)
        const productMessage = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(data.title)
            .setURL(data.link)
            .setAuthor({ name: 'Venão', iconURL: data.image, url: data.link })
            .setDescription(data.title)
            .setThumbnail(data.image)
            .setImage(data.image)
            .setTimestamp()
            .setFooter({ text: 'Aproveite esta oferta incrível!', iconURL: data.image });    
        message.reply({embeds: [productMessage]})
            .then(msg => setTimeout(() => message.delete(), 3000))
            .then(sendToTelegram(data))
    }
}

async function sendToTelegram(data){
    const url = 'https://api.telegram.org/bot';
    const apiToken = process.env.TELEGRAM_TOKEN;
    console.log('Url recebida para enviar para o telegram: ' + data.link)
    const chat_id = process.env.TELEGRAM_CHAT
    const caption = `Confira esse produto que foi compartilhado no Discord! Talvez seja do seu interesse! ${data.title} ${data.link}`
    const photo = data.image
    //tg.telegram.sendMessage(chatId, text)
    axios.post(`${url}${apiToken}/sendPhoto`,
    {
        chat_id,
        caption,
        photo
    })
}
const { client } = require('../index')
const alertForum = "Seu post em nosso forum não pode ser aprovado pois o título possui palavras não permitidas ou é curto demais, por favor leia as regras com atenção antes de enviar mensagens no server. \n Mensagens com titulos extremamente vagos que não detalham o problema não serão aprovados!"
const filter = ['ajuda','ajude','me ajuda','socorro','urgente']
const { MessageManager, EmbedBuilder } = require('discord.js')
const axios = require('axios');
const { Telegraf } = require('telegraf');
const { urlencoded } = require('express');

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
                //console.log('Padrão de url identificado ' + url)

                // let id;

                // let tipo;

                // if (match[1]) {
                //     id = match[1];
                //     tipo = 1; // URL padrão do AliExpress
                // } else if (match[2]) {
                //     id = match[2];
                //     tipo = 2; // URL encurtada
                // }

                //console.log("URL do AliExpress: ", new URL(match.input));
                // const aliUrl = new URL(match.input)
                // console.log(aliUrl.href)
                // const aliUrlResolved = resolveURL(aliUrl.href)
                
                // console.log(aliUrlResolved);


                //const myURL = new URL(resolveURL(aliUrl.href));

                //console.log(myURL)

                // const fullurl = 'https://pt.aliexpress.com/item/1005005440302897.html?pdp_ext_f=%7B%22ship_from%22:%22CN%22,%22sku_id%22:%2212000033090868674%22%7D&&scm=1007.28480.338741.0&scm_id=1007.28480.338741.0&scm-url=1007.28480.338741.0&pvid=8c4f2c60-e452-40a5-bc49-8730261f0a56&utparam=%257B%2522process_id%2522%253A%25221102%2522%252C%2522x_object_type%2522%253A%2522product%2522%252C%2522pvid%2522%253A%25228c4f2c60-e452-40a5-bc49-8730261f0a56%2522%252C%2522belongs%2522%253A%255B%257B%2522id%2522%253A%252232094161%2522%252C%2522type%2522%253A%2522dataset%2522%257D%255D%252C%2522pageSize%2522%253A%252210%2522%252C%2522language%2522%253A%2522pt%2522%252C%2522scm%2522%253A%25221007.28480.338741.0%2522%252C%2522countryId%2522%253A%2522BR%2522%252C%2522scene%2522%253A%2522SD-Waterfall%2522%252C%2522tpp_buckets%2522%253A%252221669%25230%2523265320%252384_21669%25234190%252319162%2523413_18480%25230%2523338741%25230_18480%25233885%252317679%252310%2522%252C%2522x_object_id%2522%253A%25221005005440302897%2522%257D&pdp_npi=3%40dis%21BRL%21R%24%20277%2C96%21R%24%20180%2C68%21%21%21%21%21%402101f49916873485585504554efbea%2112000033090868674%21gsd%21%21&spm=a2g0o.11810135fornew.waterfall.0&aecmd=true'
                // const myURL2 = new URL(fullurl)

                // console.log(myURL2)

                // console.log(url.toString(myURL2))

                //console.log("ID do item: ", id);
                //console.log("Tipo de url: ", tipo )

                // 1005005440302897
                //let productId = await getProductId(url)
                
                // let metaData = await getOpenGraphData(productId)
                //     .then((result) => {
                //         const originalTitle = result.ogTitle
                //         const title = originalTitle.split('|')[1].trim()
                //         return {
                //             'title': title,
                //             'image': result.ogImage[0].url,
                //             'url': result.ogUrl
                //         }
                //     });
                //console.log(metaData)

                //let shortUrl = await getShotUrl(productId)
                //console.log(shortUrl)

                //const apiUrl = `http://aliapi/api/ali/${id}/${tipo}`
                //const apiUrl = `http://aliapi/api/ali/${id}`
                //const apiUrl = `http://127.0.0.1:8000/api/ali/1005005440302897`
                //const apiUrl = `http://127.0.0.1:8000/api/ali/`
                //console.log(await sentToApi(finalUrl))
                //console.log(apiUrl)
                try {
                    const productId = await getProductId(url)
                    const shortUrl = await getShotUrl(productId)
                    const metaData = await getOpenGraphData(productId)               
                    console.log('ID do produto: ' + productId);
                    console.log('URL Reduzida: ' + shortUrl);
                    console.log('Meta: ' + metaData.ogTitle)
                    await replyMsg(message, productId, shortUrl, metaData)
                    //await sendToTelegram(shortUrl, metaData)
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

async function getProductId(shortURL) {
    console.log('URL recebida: ' + shortURL)
    try{
        const response = await axios.get(shortURL)
        const productUrl = new URL(response.request.res.responseUrl)
        const productPath = productUrl.pathname
        const regex = /\/item\/(\d+)\.html/
        const match = productPath.match(regex);
        const productId = match[1]
        console.log('ID do produto: ' + productId)
        return productId
    } catch(err) {
        console.log(err)
    }
}

async function getShotUrl(id) {
    console.log('ID recebida para api: ' + id);
    const apiUrl = 'http://127.0.0.1:8000/api/ali/' + id;

    return new Promise((resolve, reject) => {
        axios.get(apiUrl)
        .then(function(response) {
            console.log("Resultado API: " + response.data.link[0].promotion_link);
            console.log(response.status);
            console.log(response.statusText);
            resolve(response.data.link[0].promotion_link);
        })
        .catch(function(error) {
            console.error(error);
            reject(error);
        });
    });
}

// async function getOpenGraphData(id) {
//     const ogs = require('open-graph-scraper');
//     const options = { url: `https://pt.aliexpress.com/item/${id}.html` };

//     try {
//         const { error, html, result, response } = await ogs(options);
//         console.log('error:', error);
//         //console.log('html:', html);
//         console.log('result:', result);
//         //console.log('response:', response);
//         return result;
        
//     } catch (error) {
//         console.error('Error:', error);
//         return null;
//     }
// }

async function getOpenGraphData(id) {
    const ogs = require('open-graph-scraper');
    const options = { url: `https://pt.aliexpress.com/item/${id}.html` };

    let result;
    let attempts = 0;

    while (attempts < 5 && (!result || !result.ogTitle)) {
        try {
            const { error, html, result: ogResult, response } = await ogs(options);

            //console.log('error:', error);
            //console.log('result:', ogResult);

            result = ogResult;
            attempts++;
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    if (result && result.ogTitle) {
        return result;
    } else {
        return null;
    }
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
    //message.reply('Use este link para comprar o produto no Aliexpress: ' + short)
    //    .then(msg => setTimeout(() => message.delete(), 3000))
    message.reply({embeds: [productMessage]})
        .then(msg => setTimeout(() => message.delete(), 3000))
        .then(sendToTelegram(shortUrl, metaData))
}

async function sendToTelegram(shortUrl, metaData){
    const url = 'https://api.telegram.org/bot';
    const apiToken = process.env.TELEGRAM_TOKEN;
    console.log('Url recebida para enviar para o telegram: ' + shortUrl)
    //const tg = new Telegraf(process.env.TELEGRAM_TOKEN);
    const chat_id = process.env.TELEGRAM_CHAT
    const caption = `Confira esse produto que foi compartilhado no Discord! Talvez seja do seu interesse! ${metaData.ogTitle} ${shortUrl}`
    //console.log(metaData.ogImage[0].url)
    const photo = metaData.ogImage[0].url.toString() + '?random=64'
    // const photo = metaData.ogImage[0].url
    // console.log(photo)
    //tg.telegram.sendPhoto(chatId, photo, text)
    // tg.telegram.sendPhoto({
    //     chatId: chatId,
    //     caption: text,
    //     photo: photo,
    // })
    //tg.telegram.sendMessage(chatId, text)
    axios.post(`${url}${apiToken}/sendPhoto`,
    {
        chat_id,
        caption,
        photo
    })
}


// axios.get(`${apiUrl}/${url}`)
//         .then(response => {
//             //console.log(message)
//             //console.log("Resposta da API:", response.data);
//             const promotionLink = response.data.link[0].promotion_link;
//             //const title = response.data.title[0]
//             //const image = response.data.image[0]
//             console.log(response.data)
//             console.log("Valor de promotion_link:", promotionLink);
//             message.reply('Use este link para comprar o produto no Aliexpress: ' + promotionLink)
//                 .then(msg => setTimeout(() => message.delete(), 3000))
//             //message.delete()
//             const tg = new Telegraf(process.env.TELEGRAM_TOKEN);
//             //tg.telegram.sendMessage(process.env.TELEGRAM_CHAT, 'A galera do discord compartilhou essa oferta! Talvez você também ache interessante! ' + promotionLink);
//         })
//         .catch(error => {
//             console.error("Erro na solicitação da API:", error)
//             // Trate o erro conforme necessário
//         }); 

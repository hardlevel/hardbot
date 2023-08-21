const { client } = require('../index')
const alertForum = "Seu post em nosso forum não pode ser aprovado pois o título possui palavras não permitidas ou é curto demais, por favor leia as regras com atenção antes de enviar mensagens no server. \n Mensagens com titulos extremamente vagos que não detalham o problema não serão aprovados!"
const filter = ['ajuda', 'ajude', 'me ajuda', 'socorro', 'urgente']
const { MessageManager, EmbedBuilder, GuildMember, GuildMemberManager } = require('discord.js')
const axios = require('axios');
const { urlencoded } = require('express');
const fetch = require('node-fetch');

module.exports = (client) => {
    client.on('messageCreate', async message => {
        //console.log(message)
        const author = message.author
        const content = message.content
        const channel = client.channels.cache.get(message.channelId);
        const perguntaTxt = `pergunta: substantivo feminino
            palavra ou frase com que se faz uma interrogação.
            questão que se submete a alguém de quem se espera que a resolva.
            "as p. do vestibular foram muito difíceis"`
        if (author == true){
            //console.log('é mensagem de um bot')
            return;
        } else {
            //console.log('não é mensagem de bot')
            //console.log(author)
            if (content.includes('pergunta') && (content.includes('duvida') || content.includes('dúvida'))){
                message.reply(`De acordo com o dicionário, a definição de pergunta:\n\n${perguntaTxt}\n\nPor gentileza, não meta o louco`)
            }
            //console.log(message.member.roles.cache.has('1143207357862645830'))
            if (message.member.roles.cache.has('1143207357862645830')){
                //console.log('primeira mensagem')
                message.member.roles.remove('1143207357862645830')
                if (content.includes('?')){
                    message.reply('Essa é sua primeira mensagem no server, mas parece que aceitou as regras sem ler, se atente ao nome dessa sala e leia novamente as <#538757121538392075> e evite problemas!')
                }
            }
            const terms = [
                'tenho duvida', 
                'tenho dúvida', 
                'tenho uma dúvida', 
                'tenho uma duvida', 
                'tirar dúvida', 
                'tirar duvida',
                'tira duvida',
                'tira dúvida',
            ]
            if (message.channelId == '538756978420219905'){
                if(terms.some(term => content.includes(term))){
                    message.reply("Não use esse chat para tiruar duvidas de tutoriais ou solucionar problemas! Use as salas apropriadas para cada assunto! leia as <#538757121538392075>")
                }
                if(content.includes("sou novo")){
                    message.reply("Seja bem vindo ao nosso server, por favor certifique-se de ter lido atentamente as <#538757121538392075>, respeite o tema de cada sala")
                }
            }
            //console.log(author.username + ' - ' + channel.name + ' - ' + content)
            if (author != '1063528592648192011') {

                //console.log('mensagem não é do bot')
                //const regex = /https?:\/\/.*?aliexpress\.com\/item\/(\d+)\.html/i;
                //const regex = /https?:\/\/(?:.*?\.?aliexpress\.com\/(?:[^\/]+\/)?(?:[^\/]+\/)?(?:item\/)?([\w-]+)(?:\.html)?|(?:[^\/]+\.)?(?:[a-z]+\.)?aliexpress\.com\/(?:e|item)\/([\w-]+))/i;
                //const regex = /((http|ftp|https):\/\/)?(([\w.-]*)\.([\w]*))/i
                const regex = /((http|ftp|https):\/\/)?(([\w.-]*)\.aliexpress\.com([:\d]*)?)([\w.-\/]*)*/i;

                const match = content.match(regex);

                if (match) {
                    //console.log(match.input)
                    const url = match.input;
                    console.log('link do aliexpress encontrado! ', url);
                    (async function (){
                        console.log('url na função ', url);
                        //{
                            //getProductId(url)
                            //getShotUrl(productId)
                            //replyMsg(message, productId, data)
                                const productId = await getProductId(url);
                                const data = await getShortUrl(productId);
                                await replyMsg(message, productId, data);
                                //const productId = await getProductId(url)
                                //console.log('Meta: ' + metaData.image)                    
                        //    } catch (err) {
                        //        console.log(err)
                        //}
                    })()
                } else {
                    (async function(){
                        const searchTerm = /(https?:\/\/(?:www\.)?(?:amazon\.com(?:\.br)?|amzn\.[a-z]+)\/\S+)/i;
                        if (content.includes('amazon') || content.includes('amzn')) {
                            const urlMatches = content.match(searchTerm);
                            if (urlMatches && urlMatches.length > 0) {
                                const url = urlMatches[0];
                                console.log('link da amazon encontrado! ', url)
                                getAmazonId(url, message)
                            }
                        }
                    })()
                }
            }
        }
    });

    client.on('threadCreate', async (thread) => {
        //console.log(thread)
        let postMember = thread.ownerId
        let messageId = thread.id
        let channelId = thread.parentId
        if (thread.parent.type === 15) {
            if (filter.some(substring => thread.name.includes(substring))) {
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

async function replyMsg(message, productId, data) {
    //console.log(message, productId, data)
    if (data && data.erro) {
        message.reply('O produto não tem suporte a link de afiliado, use o link original: https://pt.aliexpress.com/item/' + productId + '.html')
        return
    } else {
        console.log('URL Reduzida: ' + data.link)
        //console.log(data)
        const productMessage = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(data.title)
            .setURL(data.link)
            .setAuthor({ name: 'HardLevel', iconURL: data.image, url: data.link })
            .setDescription(data.title)
            .setThumbnail(data.image)
            .addFields(
                { name: 'Preço', value: data.price, inline: true },
                { name: 'Categoria primária', value: data.category1 ? data.category1 : 'Games', inline: true },
                { name: 'Categoria secundária', value: data.category2 ? data.category2 : 'Games', inline: true, inline: true },
            )
            .setImage(data.image)
            .setTimestamp()
            .setFooter({ text: 'Aproveite esta oferta incrível!', iconURL: data.image });
        message.reply({ embeds: [productMessage] })
            .then(msg => setTimeout(() => message.delete(), 3000))
            .then(sendToTelegram(data))
    }
}

async function getAmazonId(url, message){
    fetch(url, { redirect: 'follow', method: 'GET' }).then(response => {
        let url = new URL(response.url)
        //let path = url.pathname
        let params = url.searchParams
        let id = params.get('pd_rd_i')
        console.log(id)
        getAmazonProduct(id, message)
    }).catch(error => console.log(error))
}

async function getAmazonProduct(id, message){
    //console.log(id, message)
    const apiUrl = process.env.API_URL + 'amz/' + id;
    //fetch(apiUrl).then(response => console.log(response.text()))
    axios.get(apiUrl)
        .then(response => {
            //console.log(response.data)
            data = {
                title: response.data.title,
                link: response.data.link,
                price: response.data.price,
                image: response.data.image
            };
            replyMsg(message, id, data)
        })
        .catch(err => console.log(err))
}

async function getProductId(url) {
    console.log('URL recebida para obter ID: ' + url)
    let finalUrl = ''
    if (url.includes('/item/')) {
        console.log('Url não reduzida identificada, capturando id...')
        const newUrl = new URL(url)
        const productPath = newUrl.pathname
        const regex = /\/item\/(\d+)\.html/
        const match = productPath.match(regex);
        const productId = match[1]
        console.log('ID do produto: ' + productId)
        return productId
    } else {
        console.log('URL reduzida identificada, tentando descobrir URL original...')
        finalUrl = url
        try {
            const res = await fetch(finalUrl, { redirect: 'follow', method: 'GET' });
            console.log('URL final identificada: ' + res.url)
            const productUrl = new URL(res.url)
            const productPath = productUrl.pathname
            console.log('Parte 1: ' + productPath)
            const regex = /\/item\/(\d+)\.html/
            const match = productPath.match(regex);
            const productId = match[1]
            console.log('ID do produto: ' + productId)
            return productId
        } catch (err) {
            console.log(err)
        }
    }
}


async function getShortUrl(id) {
    if (id == undefined) { console.log('ID não definida!') }
    console.log('ID recebida para api: ' + id);
    const apiUrl = process.env.API_URL + 'ali/' + id;
    //const apiUrl = 'http://aliapi/api/ali/' + id;
    try {
        const response = await axios.get(apiUrl);
        let data = ''
        if (response.data.erro) {
            //console.log('O produto não suporta link de afiliado :(')
            data = { erro: "O produto não suporta link de afiliado :(" }
        } else {
            console.log(response.data)
            data = {
                title: response.data.title,
                link: response.data.link,
                price: response.data.price,
                image: response.data.image,
                discount: response.data.discount,
                category1: response.data.category1,
                category2: response.data.category2
            };
        }
        console.log(data)
        return data;
    } catch (error) {
        console.log(error.response.data);
    }
}

async function sendToTelegram(data) {
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
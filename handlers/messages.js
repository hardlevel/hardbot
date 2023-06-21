const { client } = require('../index')
const alertForum = "Seu post em nosso forum não pode ser aprovado pois o título possui palavras não permitidas ou é curto demais, por favor leia as regras com atenção antes de enviar mensagens no server. \n Mensagens com titulos extremamente vagos que não detalham o problema não serão aprovados!"
const filter = ['ajuda','ajude','me ajuda','socorro','urgente']
const { MessageManager } = require('discord.js')
const axios = require('axios');
const { Telegraf } = require('telegraf')

module.exports = (client) => {
    client.on('messageCreate', async message => {        
        //console.log(message)
        const author = message.author
        const content = message.content
        console.log(author + ' - ' + content)
        if (author != '1063528592648192011'){
            console.log('mensagem não é do bot')
            //const regex = /https?:\/\/.*?aliexpress\.com\/item\/(\d+)\.html/i;
            //const regex = /https?:\/\/(?:.*?\.?aliexpress\.com\/(?:[^\/]+\/)?(?:[^\/]+\/)?(?:item\/)?([\w-]+)(?:\.html)?|(?:[^\/]+\.)?(?:[a-z]+\.)?aliexpress\.com\/(?:e|item)\/([\w-]+))/i;
            const regex = /((http|ftp|https):\/\/)?(([\w.-]*)\.([\w]*))/i

            const match = content.match(regex);
        
            if (match) {
                const url = encodeURIComponent(match[0]);
                console.log('Padrão de url identificado ' + url)

                // let id;

                // let tipo;

                // if (match[1]) {
                //     id = match[1];
                //     tipo = 1; // URL padrão do AliExpress
                // } else if (match[2]) {
                //     id = match[2];
                //     tipo = 2; // URL encurtada
                // }

                console.log("URL do AliExpress: ", url);
                //console.log("ID do item: ", id);
                //console.log("Tipo de url: ", tipo )

                //const apiUrl = `http://aliapi/api/ali/${id}/${tipo}`
                const apiUrl = `http://aliapi/api/ali/${url}`
                
                axios.get(apiUrl)
                    .then(response => {
                        //console.log(message)
                        //console.log("Resposta da API:", response.data);
                        const promotionLink = response.data.link[0].promotion_link;
                        //const title = response.data.title[0]
                        //const image = response.data.image[0]
                        console.log(response.data)
                        console.log("Valor de promotion_link:", promotionLink);
                        message.reply('Use este link para comprar o produto no Aliexpress: ' + promotionLink)
                            .then(msg => setTimeout(() => message.delete(), 3000))
                        //message.delete()
                        const tg = new Telegraf(process.env.TELEGRAM_TOKEN);
                        //tg.telegram.sendMessage(process.env.TELEGRAM_CHAT, 'A galera do discord compartilhou essa oferta! Talvez você também ache interessante! ' + promotionLink);
                    })
                    .catch(error => {
                        console.error("Erro na solicitação da API:", error)
                        // Trate o erro conforme necessário
                    });           
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
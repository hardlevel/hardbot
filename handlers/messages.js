const { client } = require('../index')
const alertForum = "Seu post em nosso forum não pode ser aprovado pois o título possui palavras não permitidas, por favor leia as regras com atenção antes de enviar mensagens no server. \n Mensagens com titulos extremamente vagos que não detalham o problema não serão aprovados!"
const filter = ['ajuda','ajude','me ajuda','socorro','urgente']
const { MessageManager } = require('discord.js')
const axios = require('axios');

module.exports = (client) => {
    client.on('messageCreate', async message => {
        //console.log(message)
        const author = message.author
        const content = message.content

        const regex = /https?:\/\/\w+\.aliexpress\.com\/item\/(\d+)\.html/i;
        const match = content.match(regex);
    
        if (match) {
            const url = match[0];
            const id = match[1];
            console.log("URL do AliExpress:", url);
            console.log("ID do item:", id);

            const apiUrl = `http://localhost:5000/api/ali/${id}`
            
            axios.get(apiUrl)
                .then(response => {
                    //console.log(message)
                    //console.log("Resposta da API:", response.data);
                    const promotionLink = response.data.link[0].promotion_link;
                    console.log("Valor de promotion_link:", promotionLink);
                    message.reply('Use este link para comprar o produto no Aliexpress: ' + promotionLink);
                    message.delete()
                    
                })
                .catch(error => {
                    console.error("Erro na solicitação da API:", error)
                    // Trate o erro conforme necessário
                });           
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
        }
    })
}
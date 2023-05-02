const {
    Client,
    Events,
    GatewayIntentBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Message,
    channelMention,
    MessageActionRow,
    MessageButton
} = require('discord.js');

async function startBot(client, regrasChannel, serverId, c, cron){
    //console.log(rulesButton)
    //const guild = client.guilds.cache;
    //console.log(guild)
    //console.log(module)
    regrasChannel = client.guilds.cache.get(serverId).channels.cache.find(channel => channel.name === 'regras');
    console.log(`Ready! Logged in as ${c.user.tag}`);

    const rulesChannel = client.guilds.cache.first().rulesChannelId
    const channel = client.channels.cache.get(rulesChannel)


    async function reactions() {
        const message = await channel.messages.fetch('538759078105841664')
        try {
            //remove todas as reações da primeira mensagem na sala de regras
            message.reactions.removeAll()
            console.log('todas reações removidas')


        } catch (error) {
            console.log(error)
        }
    }

    async function removeReactions() {
        const message = await channel.messages.fetch('727128017318707220');
        try {
            // Loop através de todas as reações na mensagem
            for (const reaction of message.reactions.cache.values()) {
                const emojiName = reaction.emoji.name.toLowerCase(); // Converte o nome da emoji para letras minúsculas

                // Verifica se a emoji é diferente de 'thumbsup' e 'white_check_mark'
                if (emojiName !== '✅' && emojiName !== '👍') {
                    // Obtém a lista de usuários que reagiram com a emoji
                    const users = await reaction.users.fetch();


                    //Remove a reação de todos os usuários, exceto se for a própria bot
                    users.forEach(async (user) => {
                        if (user.id !== client.user.id) {
                            await reaction.users.remove(user);
                        }
                    });
                    // Registra a remoção da reação no console
                    console.log(`Reação removida: ${emojiName}`);
                }
            }

            //Registro de conclusão da remoção das reações no console
            console.log('Todas as reações não desejadas foram removidas.');
        } catch (error) {
            console.error(`Ocorreu um erro ao remover as reações: ${error}`);
        }

        //message.edit({components:[rulesButton]})
    }

    async function addButton() {
        const channelId = client.guilds.cache.first().rulesChannelId
        const channel = client.channels.cache.get(rulesChannel)
        let messageId = ''

        const acceptMessageTemplate = `
                Antes de perguntar algo, consulte os canais ${channelMention('538757439655378944')} ${channelMention('699291742536597534')} ${channelMention('540970007165665293')} ${channelMention('538757509037686794')}
                Clique no botão abaixo para aceitar as`;

        try {
            //console.log(channelId)
            let counter = 0
            const messageList = await channel.messages.fetch().then(messages => {
                //console.log(`Received ${messages.size} messages`);
                //Iterate through the messages here with the variable "messages".
                messages.forEach(message => {
                    if (message.content.trim() == acceptMessageTemplate.trim()) {
                        counter++
                        messageId = message.id;
                    }
                })
            })

            if (counter == 0) {
                const message = channel.send(acceptMessageTemplate);
                messageId = message.id;
            } else {
                console.log(`A mensagem já existe ${channelId}`)
            }


            // Cria a ação de linha de mensagem com o botão do módulo


            // Edita a mensagem existente ou a mensagem recém-criada para adicionar o componente
            const message = await channel.messages.fetch(messageId); // Obtém a mensagem com a ID
            message.edit({
                components: [
                    {
                        "type": 1,
                        "components": [
                            {
                                "style": 1,
                                "label": `Eu li e aceito as regras`,
                                "custom_id": `accept_yes`,
                                "disabled": false,
                                "emoji": {
                                    "id": null,
                                    "name": `✅`
                                },
                                "type": 2
                            }

                        ]
                    }]
            }); // Edita a mensagem para adicionar o componente                
            console.log(`Mensagem criada/editada com ID: ${messageId}`);
        } catch (error) {
            console.error('Ocorreu um erro:', error);
        }
    }

    cron.schedule('0 8 * * *', () => {
        // Use uma API de gifs para obter uma gif de bom dia (neste exemplo, usamos a API do Giphy)
        fetch('https://api.giphy.com/v1/gifs/random?tag=bom%20dia&api_key=BOcS2Rlvdy2JapFW7gy36Kc2vwyI5xRe')
            .then(res => res.json())
            .then(data => {
                // Verifique se a resposta da API é válida
                if (data && data.data && data.data.images && data.data.images.original && data.data.images.original.url) {
                    const gifUrl = data.data.images.original.url;
                    // Enviar a gif para o canal do Discord
                    const channel = client.channels.cache.get(channelId);
                    if (channel && channel.isText()) {
                        channel.send(`Bom dia! Aqui está uma gif para você! ${gifUrl}`);
                    }
                }
            })
            .catch(error => {
                console.error('Erro ao obter a gif de bom dia:', error);
            });
    });

    reactions()
    removeReactions()
    addButton()
}

module.exports = { startBot }
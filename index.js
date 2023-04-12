require('dotenv').config();
const {
    Client,
    Events,
    GatewayIntentBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    channelMention,
    MessageActionRow,
    MessageButton
} = require('discord.js');

const util = require('util');
const { rulesButton, buttonRules } = require('./rules_button.js');
let regrasChannel = ''
const cron = require('node-cron');
const token = process.env.DISCORD_TOKEN
const noob = '740297286562873404'
const serverId = '538756064783499265'
const botId = '1063528592648192011'

const urlRegex = require('url-regex'); // Importar a biblioteca de análise de URLs
const axios = require('axios')

//const { addButtonToMessage } = require('rules_button'); // Importa a função do arquivo button.js

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
    ],
});

client.once(Events.ClientReady, c => {
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

            // Registro de conclusão da remoção das reações no console
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
    reactions()
    removeReactions()
    addButton()

	  cron.schedule('0 8 * * *', () => {
		// Use uma API de gifs para obter uma gif de bom dia (neste exemplo, usamos a API do Giphy)
		fetch('https://api.giphy.com/v1/gifs/random?tag=bom%20dia&api_key=SUA_CHAVE_DE_API_DO_GIPHY_AQUI')
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
});

// Faça o login do bot com o token
client.login(token);

Certifique-se de substituir SEU_TOKEN_DE_BOT_DO_DISCORD_AQUI pelo token do seu bot do Discord e ID_DO_CANAL_DO_DISCORD_AQUI pelo ID do canal onde você deseja que a gif de bom dia seja enviada. Além disso, você também precisará de uma chave de API do Giphy para obter as gifs de bom dia. Você pode obter uma chave de API gratuitamente registrando-se no site do Giphy (https://developers.giphy.com/).

});

client.on('messageCreate', async message => {
    const rulesTxt = `
    Olá ${message.author.name}, Por favor, leia e aceite as regras na sala ${regrasChannel} antes de enviar mensagens nas salas. 
    Se atente em mandar as mensagens nas salas corretas, o fórum também tem regras importantes
    , é necessário que você leia as regras para ajudar a manter o server organizado.
    Siga o canal nas redes sociais, outras plataformas e outros canais em https://linktr.ee/hardlevel
    `
    //if (message.member.user.id == botId) {
        //console.log(message)
        
    //}

    if ((message.member) && (message.member.user.bot == false)) {
        const member = message.member;
        const highestRole = member.roles.highest;
        
        const sala = client.channels.cache.get(message.channelId).name

        // Inicializa a variável de tentativas do usuário
        if (!message.member.noobTries) message.member.noobTries = 0;

        if (highestRole.name === 'noob') {
            try {
                if (message.member.noobTries >= 3) {
                    // Apaga a mensagem do usuário
                    message.delete();

                    // Menciona o usuário e envia o comando de warn
                    //message.channel.send(`<@${member.user.id}>`);
                    //message.channel.send(`<!warn> <@${member.user.id}> insistiu em mandar mensagens sem ler as regras.`);
                    member.timeout(1000_000);

                    // Reinicia o contador de tentativas do usuário
                    message.member.noobTries = 0;
                } else {
                    // Apaga a mensagem anterior do bot
                    const member = message.member;
                    /*const botMessages = message.channel.messages.cache.filter(msg => msg.author.id === client.user.id);
                    botMessages.forEach(msg => msg.delete());
                    message.delete();*/
                    // Envia uma mensagem solicitando que o usuário leia e aceite as regras
                    const reply = message.channel.send(`<@${member.user.id}>, vai com calma ai fera, você ainda é Noob nesse server, leia e aceite as ${regrasChannel} reagindo com :thumbsup: ou :white_check_mark: antes de mandar mensagens nas salas!`);
                    message.delete
                    const msgId = (await reply).id
                    await proccessBotMessage(reply.id, message.content, message.channelId, botId)
                    // Incrementa o contador de tentativas do usuário
                    message.member.noobTries++;

                    member.send(`
                    Por favor, leia e aceite as regras na sala ${regrasChannel} antes de enviar mensagens nas salas. 
                    Se atente em mandar as mensagens nas salas corretas, o fórum também tem regras importantes
                    , é necessário que você leia as regras para ajudar a manter o server organizado.
                    Siga o canal nas redes sociais, outras plataformas e outros canais em https://linktr.ee/hardlevel
                    `);
                }
            } catch (error) {
                console.error(`Ocorreu um erro ao tentar apagar a mensagem: ${error}`);
            }
        }

        console.log(`${message.author.tag} tem o cargo ${highestRole.name} sala ${client.channels.cache.get(message.channelId)} na sala ${sala}`);
        if (message.channel.id != '786263907207348244') {
            const content = message.content;
            const urls = content.match(urlRegex()); // Encontrar URLs na mensagem usando a regex

            if (urls) {
                // Se a mensagem contiver URLs, chamar a função de tratamento
                tratarUrls(urls, message);
            }
        }
    }
});

client.on(Events.MessageReactionAdd, async (reaction, user) => {
    //reaction.remove()

    let messageId = '538759078105841664'
    // async function getReactions(){
    //     let rulesMessage = await reaction.message.fetch(messageId)

    //     console.log(rulesMessage)
    // }
    let membroId = '727127442061393991'
    if (user.bot) return; // Ignora reações de bots

    // Verifica se a reação foi em uma mensagem nas regras
    
    if (reaction.message.channel.id !== regrasChannel.id) return;
    // Verifica se a reação é de um usuário com o cargo 'noob'
    const member = await reaction.message.guild.members.fetch(user.id);
    const noobRole = reaction.message.guild.roles.cache.find(role => role.name === 'noob');
    const membroRole = reaction.message.guild.roles.cache.find(role => role.id === membroId);
    if (!member.roles.cache.has(noobRole.id)) return;

    // Remove o cargo 'noob' e adiciona o cargo 'membro'
    await member.roles.remove(noobRole);
    await member.roles.add(membroRole);
});

// Função para apagar todas as mensagens do canal
async function deleteAllMessages(channel) {
    const messages = await channel.messages.fetch({ limit: 100 });
    if (messages.size > 0) {
        await channel.bulkDelete(messages);
        await deleteAllMessages(channel);
    }
}

// Agendando a tarefa para rodar todo domingo às 00h
cron.schedule('0 0 * * 0', async () => {
    const channel = client.channels.cache.get('1072497124597575751');
    if (channel) {
        console.log(`Deleting all messages in channel ${channel.name}`);
        await deleteAllMessages(channel);
        console.log(`All messages deleted from channel ${channel.name}`);
    } else {
        console.log(`Channel with ID ${channelId} not found`);
    }
});

client.on('interactionCreate', async (interaction) => {
    // Verificar se a interação é um clique de botão
    if (!interaction.isButton()) return;

    // Verificar se o ID do botão é igual ao que você definiu na etapa 4
    if (interaction.customId === 'accept_yes') {
        // Remover o cargo antigo do membro
        const membro = interaction.member;
        if (membro.roles.cache.some(role => role.name === 'noob')) {
            const cargoAntigo = membro.roles.cache.get('740297286562873404');
            await membro.roles.remove(cargoAntigo);

            // Adicionar o novo cargo ao membro
            const novoCargo = interaction.guild.roles.cache.get('727127442061393991');
            await membro.roles.add(novoCargo);

            // Enviar uma resposta para o botão informando que a ação foi realizada com sucesso
            await interaction.reply({ content: 'Seja bem vindo ao server oficial HardLevel! Não se esqueça de seguir os canais adicionais e redes sociais aqui https://linktr.ee/hardlevel', ephemeral: true });
        } else {
            await interaction.reply({ content: 'Você já aceitou as regras anteriormente! Não se esqueça de seguir os canais adicionais e redes sociais aqui https://linktr.ee/hardlevel', ephemeral: true });
        }
    }
});


// Função de tratamento de URLs
function tratarUrls(urls, message) {
    const hardlevel = 'UCFUTYcj_6fwrw207-YAghLA'
    // Aqui você pode implementar a lógica de tratamento das URLs
    // por exemplo, enviar uma resposta com informações ou realizar
    // alguma ação com as URLs encontradas

    // Exemplo: Enviar uma resposta com as URLs encontradas
    const urlsStr = urls.join('\n'); // Converter o array de URLs em uma string
    // Expressão regular para verificar se a URL é um vídeo do YouTube
    const youtubeRegex = /^(?:(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/([\w-]+))|(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?(?=.*v=([\w-]+))(?:\S+)?|embed\/([\w-]+))(?:\S+)?\/?))$/;
    // Verificar se a URL corresponde ao padrão de URL do YouTube ou ao formato encurtado
    if (urlsStr.match(youtubeRegex)) {
        console.log('A URL é um vídeo do YouTube válido.');
        // Faça o que você precisa fazer quando a URL for um vídeo do YouTube válido
        verificarCanalDoVideo(urlsStr, message)
        return true;
    } else {
        console.log('A URL não é um vídeo do YouTube válido.');
        return false;
    }
    // message.reply(`Foram encontradas as seguintes URLs:\n${urlsStr}`);
    // message.delete()
}

async function verificarCanalDoVideo(videoUrl, message) {
    try {
        const videoTxt = `Esse vídeo não é dos canais HardLevel, portanto não pode ser compartilhado neste server, por favor leia as ${regrasChannel}`
        const yt_api = process.env.YT_API_KEY
        // Extrair o ID do vídeo da URL
        const videoId = obterIdDoVideo(videoUrl);
        const member = message.member.id
        console.log(videoId)
        // Fazer requisição à API do YouTube para obter informações do vídeo
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${yt_api}`);
        const video = response.data.items[0]; // Obter o objeto de informações do vídeo

        // Verificar se o canal do vídeo é igual a 'UCFUTYcj_6fwrw207-YAghLA'
        if (video.snippet.channelId === 'UCFUTYcj_6fwrw207-YAghLA') {
            console.log('O canal do vídeo é igual a "UCFUTYcj_6fwrw207-YAghLA"');
            // Faça o que você precisa fazer quando o canal do vídeo for igual a 'UCFUTYcj_6fwrw207-YAghLA'
        } else {            
            console.log('O canal do vídeo não é igual a "UCFUTYcj_6fwrw207-YAghLA"');
            //const botMessages = message.channel.messages.cache.filter(msg => msg.author.id === client.user.id);
            //await botMessages.forEach(msg => msg.delete());        
            const reply = await message.reply(`Esse vídeo não é dos canais HardLevel, portanto não pode ser compartilhado neste server, por favor leia as ${regrasChannel}`)
            await message.delete()
            const msgId = reply.id
            await proccessBotMessage(reply.id, message.content, message.channelId, botId)
        }
    } catch (error) {
        console.error('Ocorreu um erro ao verificar o canal do vídeo:', error);
    }
}

// Função auxiliar para extrair o ID do vídeo da URL
function obterIdDoVideo(videoUrl) {
    // Verificar se a URL é um URL encurtado do YouTube (youtu.be)
    if (videoUrl.includes('youtu.be/')) {
        const match = videoUrl.match(/youtu\.be\/([\w-]+)/);
        return match ? match[1] : null;
    }

    // Caso contrário, verificar se a URL é um URL padrão do YouTube (youtube.com/watch?v=)
    const url = new URL(videoUrl);
    if (url.hostname.includes('youtube.com') && url.pathname === '/watch') {
        return url.searchParams.get('v');
    }

    // Retornar null se a URL não for um URL válido do YouTube
    return null;
}

async function proccessBotMessage(id, content, channelId, botId){
    try {
        const channel = await client.channels.fetch(channelId)
        const messages = await channel.messages.fetch({ limit: 10 });
        const botMessages = await messages.filter(msg => msg.author.id === botId)
        console.log(util.inspect(botMessages, { depth: null }))
        for (const msg of botMessages.values()) {
            console.log('mensagem ignorada ' + id);
            if (msg.id !== id) {
                console.log('Mensagem a ser excluída:', msg.id);
                await msg.delete();
            }
        }
    } catch (error) {
        console.error('Ocorreu um erro: ', error);
    }
}

client.login(token);
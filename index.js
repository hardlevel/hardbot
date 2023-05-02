require('dotenv').config();
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

const util = require('util');
let regrasChannel = ''
const cron = require('node-cron');
const token = process.env.DISCORD_TOKEN
const noob = '740297286562873404'
const serverId = '538756064783499265'
const botId = '1063528592648192011'

const urlRegex = require('url-regex'); // Importar a biblioteca de análise de URLs
const axios = require('axios');
const { stringify } = require('querystring');

var tentativas = {}

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

//importar modulos
const { handleMessage } = require('./messageHandler');
const { startBot } = require('./startBot');

client.once(Events.ClientReady, c => {
    startBot(client, regrasChannel, serverId, c, cron)
});

//Certifique-se de substituir SEU_TOKEN_DE_BOT_DO_DISCORD_AQUI pelo token do seu bot do Discord e ID_DO_CANAL_DO_DISCORD_AQUI pelo ID do canal onde você deseja que a gif de bom dia seja enviada. Além disso, você também precisará de uma chave de API do Giphy para obter as gifs de bom dia. Você pode obter uma chave de API gratuitamente registrando-se no site do Giphy (https://developers.giphy.com/).


client.on('messageCreate', async message => {
    handleMessage(client, message, regrasChannel, urlRegex);
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

client.once('interactionCreate', async (interaction) => {
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
            const novoCargo = await interaction.guild.roles.cache.get('727127442061393991');
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


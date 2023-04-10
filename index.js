require('dotenv').config();
const {
    Client,
    Events,
    GatewayIntentBits
} = require('discord.js');
const cron = require('node-cron');
const token = process.env.DISCORD_TOKEN
const noob = '740297286562873404'

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
    console.log(`Ready! Logged in as ${c.user.tag}`);
    const generalChat = client.channel.cache.get('538756978420219905')
    generalChat.send.message('venão lindo e cheiroso')


    const channelId = '538757121538392075';
    const messageId = '538759078105841664'; // id da mensagem que deseja remover as reações
    const channel = client.channels.cache.get(channelId);

    /*client.channels.fetch('538757121538392075')
    .then(channel => console.log(channel.name))
    .catch(console.error);*/

    
    async function reactions(){
        const message = await channel.messages.fetch('538759078105841664')
        try{
            message.reactions.removeAll()
            console.log('todas reações removidas')
        } catch(error) {
            console.log(error)
        }
    }

    reactions()
});

client.on('messageCreate', message => {
    const member = message.member;
    const highestRole = member.roles.highest;
    const regrasChannel = message.guild.channels.cache.find(channel => channel.name === 'regras');

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
                const botMessages = message.channel.messages.cache.filter(msg => msg.author.id === client.user.id);
                botMessages.forEach(msg => msg.delete());
                message.delete();
                // Envia uma mensagem solicitando que o usuário leia e aceite as regras
                message.channel.send(`<@${member.user.id}>, vai com calma ai fera, você ainda é Noob nesse server, leia e aceite as ${regrasChannel} reagindo com :thumbsup: ou :white_check_mark: antes de mandar mensagens nas salas!`);

                // Incrementa o contador de tentativas do usuário
                message.member.noobTries++;
            }
        } catch (error) {
            console.error(`Ocorreu um erro ao tentar apagar a mensagem: ${error}`);
        }
    }

    console.log(`${message.author.tag} tem o cargo ${highestRole.name}`);
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
    const regrasChannel = reaction.message.guild.channels.cache.find(channel => channel.name === 'regras');
    if (reaction.message.channel.id !== regrasChannel.id) return;
    // Verifica se a reação é de um usuário com o cargo 'noob'
    const member = await reaction.message.guild.members.fetch(user.id);
    const noobRole = reaction.message.guild.roles.cache.find(role => role.name === 'noob');
    const membroRole = reaction.message.guild.roles.cache.find(role => role.id === membroId);
    if (!member.roles.cache.has(noobRole.id)) return;

    // Remove o cargo 'noob' e adiciona o cargo 'membro'
    //await member.roles.remove(noobRole);
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

client.login(token);
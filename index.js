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

const { rulesButton, buttonRules } = require('./rules_button.js');

const cron = require('node-cron');
const token = process.env.DISCORD_TOKEN
const noob = '740297286562873404'

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
    console.log(`Ready! Logged in as ${c.user.tag}`);

    const rulesChannel = client.guilds.cache.first().rulesChannelId
    const channel = client.channels.cache.get(rulesChannel)

    
    async function reactions(){
        const message = await channel.messages.fetch('538759078105841664')    
        try{
            //remove todas as reações da primeira mensagem na sala de regras
            message.reactions.removeAll()
            console.log('todas reações removidas')


        } catch(error) {
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
                        if(message.content.trim() == acceptMessageTemplate.trim()){
                           counter++
                           messageId = message.id;
                        }
                    })
                  })

                if(counter == 0){
                    const message = channel.send(acceptMessageTemplate);
                    messageId = message.id;
                } else {
                    console.log(`A mensagem já existe ${channelId}`)
                }
              
            
                // Cria a ação de linha de mensagem com o botão do módulo


                // Edita a mensagem existente ou a mensagem recém-criada para adicionar o componente
                const message = await channel.messages.fetch(messageId); // Obtém a mensagem com a ID
                message.edit({ components: [
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
                        
                ] }]}); // Edita a mensagem para adicionar o componente                
                console.log(`Mensagem criada/editada com ID: ${messageId}`);
              } catch (error) {
                console.error('Ocorreu um erro:', error);
              }
    }
    reactions()
    removeReactions()
    addButton()
});

client.on('messageCreate', message => { if((message.member) && (!message.user.bot)) { 
    const member = message.member;
    const highestRole = member.roles.highest;
    const regrasChannel = message.guild.channels.cache.find(channel => channel.name === 'regras');
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
                const botMessages = message.channel.messages.cache.filter(msg => msg.author.id === client.user.id);
                botMessages.forEach(msg => msg.delete());
                message.delete();
                // Envia uma mensagem solicitando que o usuário leia e aceite as regras
                message.channel.send(`<@${member.user.id}>, vai com calma ai fera, você ainda é Noob nesse server, leia e aceite as ${regrasChannel} reagindo com :thumbsup: ou :white_check_mark: antes de mandar mensagens nas salas!`);

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
    
}});

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
      const cargoAntigo = membro.roles.cache.get('740297286562873404');
      await membro.roles.remove(cargoAntigo);
  
      // Adicionar o novo cargo ao membro
      const novoCargo = interaction.guild.roles.cache.get('727127442061393991');
      await membro.roles.add(novoCargo);
  
      // Enviar uma resposta para o botão informando que a ação foi realizada com sucesso
      await interaction.reply({ content: 'Seja bem vindo ao server oficial HardLevel!', ephemeral: true });
    }
  });

client.login(token);
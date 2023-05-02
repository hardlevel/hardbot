async function handleMessage(client, message, regrasChannel, urlRegex) {
    if (message.member == '1063528592648192011') {
        const channel = await client.channels.fetch(message.channelId);
        const messages = await channel.messages.fetch({ limit: 100 });
        const botMessages = messages.filter(message => message.author.id === '1063528592648192011');
        const messageCount = botMessages.size;


        if (messageCount > 1) {
            const messagesToDelete = Array.from(botMessages.values()).slice(1, messageCount - 1);
            channel.bulkDelete(messagesToDelete);
        }

    }

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

        //if (member && !member.data.has('noobCounter')) {
        //    member.data.set('noobCounter', 0);
        //} 

        if (highestRole.name === 'noob') {
            try {
                if (!tentativas.hasOwnProperty(member.id)) {
                    tentativas[member.id] = 1;
                    console.log('primeiro if ' + tentativas[member.id])
                } else {
                    console.log('entrou no eslse')
                    tentativas[member.id]++;

                    if (tentativas[member.id] > 3) {
                        message.delete();
                        member.send(`
Por favor, leia e aceite as regras na sala ${regrasChannel} antes de enviar mensagens nas salas. \n
Se atente em mandar as mensagens nas salas corretas, o fórum também tem regras importantes \n
, é necessário que você leia as regras para ajudar a manter o server organizado. \n
Você recebeu um mute por insistir em mandar mensagens sem ter lido e aceitado as regras! Evite tomar um ban! \n
Siga o canal nas redes sociais, outras plataformas e outros canais em https://linktr.ee/hardlevel
`);
                        member.timeout(1000_000);
                        tentativas[member.id] = 0;
                        console.log(member.author.name + ' mutado')
                        return
                    }
                }
                const reply = message.channel.send(`<@${member.user.id}>, vai com calma ai fera, você ainda é não leu e aceitou as regras do server, leia e aceite as ${regrasChannel} reagindo com :thumbsup: ou :white_check_mark: antes de mandar mensagens nas salas! Se insistir receberá um mute. Tentativas: ${tentativas[member.id]}`);
                message.delete()
                const msgId = (await reply).id

                console.log('tentativas do noob ' + tentativas[member.id])
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
}
module.exports = { handleMessage };
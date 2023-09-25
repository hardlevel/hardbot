

const cron = require('node-cron');
const { Guilds, ChannelManager } = require('discord.js')
const { generalChatId, ps2OnlineId, serverId, memesId } = require('../config.json')
const axios = require('axios')

module.exports = async (client) => {
    const guild = client.guilds.cache.get(serverId)
    //0 0 * * 1
    //var job = cron.schedule('0 20 * * 2', () => {
    cron.schedule('0 19 * * TUE', () => {
    //cron.schedule('* * * * MON', () => {
        console.log('Criando evento do delta!')
        // Lógica para calcular a data das terças-feiras às 19h
        const hoje = new Date();
        const proximaTerca = new Date(hoje);
        proximaTerca.setDate(proximaTerca.getDate() + ((2 + 7 - hoje.getDay()) % 7)); // Próxima terça-feira

        proximaTerca.setHours(19); // Define a hora para 19h
        proximaTerca.setMinutes(0); // Define os minutos para 0 (opcional)

        // Converte a data para o formato ISO 8601
        const dataTercaISO8601 = proximaTerca.toISOString();

        // Chama sua função passando o parâmetro dataTercaISO8601

        client.user.setUsername('ABOC');
        guild.scheduledEvents.create({
            name: 'Delta Force - Evento PS2 Online',
            scheduledStartTime: dataTercaISO8601,
            privacyLevel: 2,
            entityType: 2,
            channel: '591729371539046421',
            image: 'img/delta.webp',
            description: `
                Todas as terças às 19h teremos Delta Force Black Hawk Down Online!

                DNS:45.7.228.197

                GameID: Delta Force Black Hawk Down SLUS_211.24
                ou
                GamelD: Delta Force Black Hawk Down TEAM SABRE SLUS_214.14

                Max Players: 16 Players

                LINK DA IS0 : https://drive.google.com/file/d/1PGVZy1E2EoVQFd5S-fYhJSNWybqjBnLR
                `
        }).then(event => {
            //console.log(event.url)
            const text = `Novo evento de PS2 online criado! Marque para não perder! ${event.url}`
            client.channels.cache.get(generalChatId).send(text)
            client.channels.cache.get(ps2OnlineId).send(text)
        })
        console.log('evento criado')
    })

    cron.schedule('*/30 * * * *', () =>{
        if(client.user.username != "HardBot"){
            client.user.setUsername('HardBot');
        }
    })

    cron.schedule('0 0 * * 1', () => {
    //cron.schedule('* * * * *', () => {    
        async function bulkDelete(memesId){
            const channel = await client.channels.fetch(memesId);
            const messages = await channel.messages.fetch()
            channel.bulkDelete(messages).then(
                channel.send('https://media.giphy.com/media/26gscNQHswYio5RBu/giphy-downsized-large.gif')
            ).catch(error => console.log(error))
        }
        bulkDelete(memesId)
    })

    cron.schedule('0 17 * * *', () => {
        const createdEvents = guild.scheduledEvents.fetch().then(events => {
            events.forEach(event => {
                const eventDate = event.scheduledStartAt
                const today = new Date()
                //console.log(event.scheduledStartAt, new Date(), event.scheduledStartAt.getDay())
                const day = eventDate.getDate()
                const month = eventDate.getMonth()
                const year = eventDate.getYear()
                const hour = eventDate.getHours()
                const minutes = eventDate.getMinutes()
                const todayEvent =
                    day == today.getDate() &&
                    month == today.getMonth() &&
                    year == today.getYear()
                if (todayEvent == true) {
                    const text = `Hoje tem evento de PS2 Online! Marca ai! Começando ${hour}:${minutes} ${event.url}`
                    //client.channels.cache.get(generalChatId).send(text)
                    //client.channels.cache.get(ps2OnlineId).send(text)
                    sendToTelegram(event.url)
                    sendToFacebook(event.url)
                }
            })
        })
    })

    cron.schedule('0 8 * * *', () => {
        //console.log('hora da gif!')
        // Use uma API de gifs para obter uma gif de bom dia (neste exemplo, usamos a API do Giphy)
        //fetch(`https://api.giphy.com/v1/gifs/random?api_key=${process.env.GIPHY_KEY}&tag=bom%20dia&rating=g&lang=pt`)
        //.then(res => res.json())
        //.then(data => {
        axios.get('https://g.tenor.com/v1/random?q=bom%20dia&key=LIVDSRZULELA&limit=1&locale=pt_BR')
        .then((response) => {
            //console.log('retorno da api ', response.data)
            const data = response.data
            // Verifique se a resposta da API é válida
            if (data && data.results[0].url) {
                const gifUrl = data.results[0].url
                console.log('ta na hora da gif ', gifUrl)
                async function sendGifToChannel(generalChatId){
                    const channel = await client.channels.fetch(generalChatId);
                    console.log(channel)
                    channel.send(`Bom dia! flores do dia! ${gifUrl}`)
                }
                sendGifToChannel(generalChatId)
                // Enviar a gif para o canal do Discord
                //client.channels.cache.get(generalChatId).send(`Bom dia! flores do dia! ${gifUrl}`)
                
                // if (channel && channel.isText()) {
                //     channel.send(`Bom dia! flores do dia! ${gifUrl}`);
                // }
            }
        })
        .catch(error => {
            console.error('Erro ao obter a gif de bom dia:', error);
        });
    });

    // cron.schedule('* * * * *', () => {
    //     console.log('limpando mensagens')
    //     async function bulkDelete(memesId){
    //         const channel = await client.channels.cache.get(memesId)
    //         fetched = await channel.fetchMessages({limit: 100});
    //         console.log(f)
    //         //message.channel.bulkDelete(fetched).then(message => console.log('mensagem apagada ', message))
    //     }
    // })
    async function sendToFacebook(url){
        const facebook = require('../functions/facebook');
        const message = `
        Hoje tem evento de PS2 Online com o pessoal do Discord! Marca ai para não perder!
        Entre em nosso Discord: https://hdlvl.dev/s/discord
        Nossas lives em: 
        https://hdlvl.dev/s/playmania
        https://twitch.tv/venaogames

        Siga nas demais redes: https://linktr.ee/hardlevel
        `
        await facebook(message)
    }

    async function sendToTelegram(url) {
        const telegram = require('../functions/telegram_sendtext')
        const text = `Hoje tem partida de PS2 Online no nosso discord! Acompanhe: ${url}`
        const message = {text};
        await telegram(message);
        // console.log('enviando para telegram...', data)
        // const url = 'https://api.telegram.org/bot';
        // const apiToken = process.env.TELEGRAM_TOKEN;
        // const chat_id = process.env.TELEGRAM_CHAT
        // const text = `Hoje tem partida de PS2 Online no nosso discord! Acompanhe: ${data}`
        // //tg.telegram.sendMessage(chatId, text)
        // fetch(`${url}${apiToken}/sendMessage`, {
        //     method: 'POST',
        //     body: JSON.stringify({chat_id, text}),
        //     headers: { 'Content-Type': 'application/json' }
        // }).then(response => response.json()).catch(error => error)
        // /*axios.post(`${url}${apiToken}/sendPhoto`,
        //     {
        //         chat_id,
        //         text
        //     })*/
    }

    //a função abaixo funciona, serve para forçar excluir mensagens mesmo que sejam mais antigas de 14 dias
    //descomentar apenas caso seja necessário usa-la
    //console.log('limpando mensagens ', memesId)
    // async function forceBulkDelete(memesId){
    //     const channel = await client.channels.fetch(memesId);
    //     const messages = await channel.messages.fetch().then(messages => {
    //         console.log(Object.keys(messages).length)
    //         //console.log(messages)
    //         messages.forEach(message => {
    //             message.delete()
    //             .then(console.log('mensagem deletada'))
    //             .catch(console.error)
    //         })
    //     })
    // }

    // forceBulkDelete(memesId)
}
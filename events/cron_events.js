

const cron = require('node-cron');
const { Guilds, ChannelManager } = require('discord.js');
const { generalChatId, ps2OnlineId, serverId, memesId, ifttt_key } = require('../config.json');
const axios = require('axios');
const console = require('../functions/logger').console;

module.exports = async (client) => {
    const guild = client.guilds.cache.get(serverId)
    //0 0 * * 1
    //var job = cron.schedule('0 20 * * 2', () => {
    //cron.schedule('* * * * *', () => {
    cron.schedule('00 17 * * *', () => {
    //cron.schedule('0 19 * * TUE', () => {
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

        //client.user.setUsername('ABOC');
        guild.scheduledEvents.create({
            name: 'Delta Force - Evento PS2 Online',
            scheduledStartTime: dataTercaISO8601,
            privacyLevel: 2,
            entityType: 2,
            channel: '591729371539046421',
            image: 'img/delta.webp',
            description: `Todas as terças às 19h teremos Delta Force Black Hawk Down Online!\n\n`+

                `DNS:45.7.228.197\n\n`+

                `GameID: Delta Force Black Hawk Down SLUS_211.24\n`+
                `ou\n`+
                `GamelD: Delta Force Black Hawk Down TEAM SABRE SLUS_214.14\n\n`+

                `Max Players: 16 Players\n\n`+

                `LINK DA IS0 : https://drive.google.com/file/d/1PGVZy1E2EoVQFd5S-fYhJSNWybqjBnLR`
        }).then(event => {
            //console.log(event.url)
            const text = `Novo evento de PS2 online criado! Marque para não perder! ${event.url}`
            client.channels.cache.get(generalChatId).send(text)
            client.channels.cache.get(ps2OnlineId).send(text)
        })
        console.log('evento criado')
    })

    // cron.schedule('*/30 * * * *', () =>{
    //     if(client.user.username != "HardBot"){
    //         client.user.setUsername('HardBot');
    //     }
    // })

    cron.schedule('0 0 * * MON', () => {
    //cron.schedule('* * * * *', () => {    
        async function bulkDelete(memesId){
            const channel = await client.channels.fetch(memesId);
            const messages = await channel.messages.fetch();
            //console.log(messages.size, messages);
            channel.bulkDelete(messages.size).then(
                channel.send('https://media.giphy.com/media/26gscNQHswYio5RBu/giphy-downsized-large.gif')
            ).catch(error => console.log(error))
        }
        bulkDelete(memesId)
    })

    //cron.schedule('* * * * *', () => {
    cron.schedule('0 17 * * *', () => {
        const createdEvents = guild.scheduledEvents.fetch().then(events => {
            events.forEach(event => {
                const description = event.description;
                const image = event.coverImageURL() || getCover(description, event);
                const eventDate = event.scheduledStartAt;
                const today = new Date();
                const day = eventDate.getDate();
                const month = eventDate.getMonth();
                const year = eventDate.getYear();
                const hour = eventDate.getHours();
                //const minutes = eventDate.getMinutes(); String(eventDate.getMinutes()).padStart(2, "0");
                const minutes = String(eventDate.getMinutes()).padStart(2, "0");
                const todayEvent =
                    day == today.getDate() &&
                    month == today.getMonth() &&
                    year == today.getYear()
                if (todayEvent == true) {
                    console.log('tem evento!')
                    const text = `Hoje tem evento de PS2 Online! Marca ai! Começando ${hour}:${minutes}\n`+
                        `Evento: ${event.name}`;
                    client.channels.cache.get(generalChatId).send(text)
                    client.channels.cache.get(ps2OnlineId).send(text)
                    sendToTelegram(event.name, hour, minutes);
                    sendToFacebook(event.name, hour, minutes, image);
                    sendToTwitter(event.name, hour, minutes, ifttt_key);
                } else {console.log('não tem evento!');}
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
            const data = response.data;
            // Verifique se a resposta da API é válida
            if (data && data.results[0].url) {
                const gifUrl = data.results[0].url;
                console.log('ta na hora da gif ', gifUrl);
                async function sendGifToChannel(generalChatId){
                    const channel = await client.channels.fetch(generalChatId);
                    // console.log(channel)
                    channel.send(`Bom dia! flores do dia! ${gifUrl}`);
                }
                sendGifToChannel(generalChatId);
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

    cron.schedule('0 21 * * *', () => {
        //console.log('hora da gif!')
        // Use uma API de gifs para obter uma gif de bom dia (neste exemplo, usamos a API do Giphy)
        //fetch(`https://api.giphy.com/v1/gifs/random?api_key=${process.env.GIPHY_KEY}&tag=bom%20dia&rating=g&lang=pt`)
        //.then(res => res.json())
        //.then(data => {
        axios.get('https://g.tenor.com/v1/random?q=nicolas%20cage&key=LIVDSRZULELA&limit=1')
        .then((response) => {
            //console.log('retorno da api ', response.data)
            const data = response.data;
            // Verifique se a resposta da API é válida
            if (data && data.results[0].url) {
                const gifUrl = data.results[0].url;
                console.log('ta na hora da gif ', gifUrl);
                async function sendGifToChannel(generalChatId){
                    const channel = await client.channels.fetch(generalChatId);
                    // console.log(channel)
                    channel.send(`Uma boa noite a todos! ${gifUrl}`);
                }
                sendGifToChannel(generalChatId);
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
    //cron.schedule('* * * * *', () => {
    //    sendFacebookGroups('hello world!');
    //});

    const sendFacebookGroups = async (message) => {
        console.log('enviando para grupos');
        const fb = require('../functions/fbgroups');
        const response = await fb(message);
        //const respondeBody = await response.json()
    }

    async function sendToFacebook(name, hour, minutes, image){
        const facebook = require('../functions/facebook');
        const message = `Hoje tem evento de PS2 Online com o pessoal do Discord! Marca ai para não perder!\n`+
        `Evento: ${name}\n`+
        `Horário: ${hour}:${minutes}\n`+
        `Entre em nosso Discord: https://hdlvl.dev/s/discord\n`+
        `Nossas lives em:\n`+
        `https://hdlvl.dev/s/playmania\n`+
        `https://twitch.tv/venaogames\n\n`+

        `Siga nas demais redes: https://linktr.ee/hardlevel`;
        console.log('enviando para pagina');
        const fbPost = await facebook(message, image);
        await sendFacebookGroups(message, fbPost);
    }

    async function sendToTelegram(name, hour, minutes) {
        const telegram = require('../functions/telegram_sendtext')
        const text = `Hoje tem partida de PS2 Online no nosso discord!\n`+
                `Evento: ${name}\n`+
                `Horário: ${hour}:${minutes}\n`+
                `Acompanhe: https://hdlvl.dev/s/discord`;
        const message = {text};
        await telegram(message);
    }

    async function sendToTwitter(name, hour, minutes, ifttt_key){
        console.log(ifttt_key, name, hour, minutes);
        const url = `https://maker.ifttt.com/trigger/twitter_event/with/key/${ifttt_key}`;
        const data = {
            "value1": name,
            "value2": `${hour}:${minutes}`
        }
        try {
            const ifttt = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
    
            //const response = await ifttt.json();
            //console.log(response);
        } catch (error) {
            console.error('Erro ao enviar para o IFTTT:', error);
        }
    }

    async function getCover(description, event) {
        const padrao = /Game:\s*(.+)/;
        const correspondencia = description.match(padrao);
        let conteudo = '';
        let img = '';
        // Verifique se houve uma correspondência e obtenha o conteúdo
        if (correspondencia && correspondencia.length > 1) {
            conteudo = correspondencia[1];
            findImg(game)
        } else {
            img = './img/hardlevel_bg.jpg';
        }        
        setCover(event, img);
    }

    async function findImg(game) {
        const mobby = require('../functions/mobby');
        try {
            const result = await mobby.mobby.gameCover(game);
            img = result;
            return img;
        } catch (error) {
            console.error(error);
        }
    }

    async function setCover(event, img) {
        console.log(img);
        console.log(event);
        event.edit({image: img})
            .catch(console.error);
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
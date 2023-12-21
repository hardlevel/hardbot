const cron = require('node-cron');
const { MessageManager, EmbedBuilder, Events, GuildScheduledEvent, GuildScheduledEventManager, Guild } = require('discord.js')
const channelId = '538756978420219905' //chat geral

module.exports = (client) => {
    client.once('ready', async() => {            
        console.log(`Ready! Logged in as ${client.user.tag}`);
        //const rulesChannel = client.channels.fetch(rulesChannelId)
        //console.log(client.channels.fetch('1019672275571724349'))
        //538756064783499265
        const guild = client.guilds.cache.get('538756064783499265')
        const genChatId = '538756978420219905'
        const ps2OnlineId = '735500041355264050'
        //0 0 * * 1
        //var job = cron.schedule('0 20 * * 2', () => {
        var job = cron.schedule('* * * * *', () => {
            console.log('Inicio do cron')
            // Lógica para calcular a data das terças-feiras às 19h
            const hoje = new Date();
            const proximaTerca = new Date(hoje);
            proximaTerca.setDate(proximaTerca.getDate() + ((2 + 7 - hoje.getDay()) % 7)); // Próxima terça-feira

            proximaTerca.setHours(19); // Define a hora para 19h
            proximaTerca.setMinutes(0); // Define os minutos para 0 (opcional)

            // Converte a data para o formato ISO 8601
            const dataTercaISO8601 = proximaTerca.toISOString();

            // Chama sua função passando o parâmetro dataTercaISO8601
            
        
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
                client.channels.cache.get(genChatId).send(text)                
            })
            console.log('evento criado')
        }, {
            scheduled: false
        });
        //job.start()

        cron.schedule('0 17 * * *', () =>{
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
                    if(todayEvent == true){
                        const text = `Hoje tem evento de PS2 Online! Marca ai! Começando ${hour}:${minutes} ${event.url}`
                        client.channels.cache.get(genChatId).send(text)
                        client.channels.cache.get(ps2OnlineId).send(text)
                        sendToTelegram(event.url)
                    } 
                })
            })
        })

        cron.schedule('0 8 * * *', () => {
            // Use uma API de gifs para obter uma gif de bom dia (neste exemplo, usamos a API do Giphy)
            fetch(`https://api.giphy.com/v1/gifs/random?tag=bom%20dia&api_key=${process.env.GIPHY_KEY}` )
                .then(res => res.json())
                .then(data => {
                    // Verifique se a resposta da API é válida
                    if (data && data.data && data.data.images && data.data.images.original && data.data.images.original.url) {
                        const gifUrl = data.data.images.original.url;
                        // Enviar a gif para o canal do Discord
                        const channel = client.channels.cache.get(channelId);
                        if (channel && channel.isText()) {
                            channel.send(`Bom dia! flores do dia! ${gifUrl}`);
                        }
                    }
                })
                .catch(error => {
                    console.error('Erro ao obter a gif de bom dia:', error);
                });
            });
            //remover cargos função funciona! não apagar!
            //está comentada para não executar
            /*let list = client.guilds.cache.get("538756064783499265");

            try {
                await list.members.fetch();
    
                let role1 = list.roles.cache.get('740297286562873404').members
                role1.forEach((member) => {
                    console.log(member._roles)
                    if (member._roles.includes('740297286562873404')) {
                        member.roles.remove('740297286562873404')
                          .then(() => {
                            console.log(`Role removed from member ${member.user.tag}`);
                          })
                          .catch((error) => {
                            console.error(`Error removing role from member ${member.user.tag}:`, error);
                          });
                      }
                });
            } catch (err) {
                sconsole.error(err);
            }*/
        }
    )   
}


async function sendToTelegram(data) {
    const url = 'https://api.telegram.org/bot';
    const apiToken = process.env.TELEGRAM_TOKEN;
    const chat_id = process.env.TELEGRAM_CHAT
    const text = `Hoje tem partida de PS2 Online no nosso discord! Acompanhe: ${data}`
    //tg.telegram.sendMessage(chatId, text)
    axios.post(`${url}${apiToken}/sendPhoto`,
        {
            chat_id,
            text
        })
}
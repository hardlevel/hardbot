const cron = require('node-cron');

module.exports = (client) => {
    client.once('ready', async() => {            
        console.log(`Ready! Logged in as ${client.user.tag}`);
        //const rulesChannel = client.channels.fetch(rulesChannelId)
        
        //console.log(client.channels.fetch('1019672275571724349'))

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
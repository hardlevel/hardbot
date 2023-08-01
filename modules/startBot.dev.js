"use strict";

var cron = require('node-cron');

var _require = require('discord.js'),
    MessageManager = _require.MessageManager,
    EmbedBuilder = _require.EmbedBuilder,
    Events = _require.Events,
    GuildScheduledEvent = _require.GuildScheduledEvent,
    GuildScheduledEventManager = _require.GuildScheduledEventManager,
    Guild = _require.Guild;

var channelId = '538756978420219905'; //chat geral

module.exports = function (client) {
  client.once('ready', function _callee() {
    var guild, genChatId, ps2OnlineId, job;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log("Ready! Logged in as ".concat(client.user.tag)); //const rulesChannel = client.channels.fetch(rulesChannelId)
            //console.log(client.channels.fetch('1019672275571724349'))
            //538756064783499265

            guild = client.guilds.cache.get('538756064783499265');
            genChatId = '538756978420219905';
            ps2OnlineId = '735500041355264050'; //0 0 * * 1
            //var job = cron.schedule('0 20 * * 2', () => {

            job = cron.schedule('* * * * *', function () {
              console.log('Inicio do cron'); // Lógica para calcular a data das terças-feiras às 19h

              var hoje = new Date();
              var proximaTerca = new Date(hoje);
              proximaTerca.setDate(proximaTerca.getDate() + (2 + 7 - hoje.getDay()) % 7); // Próxima terça-feira

              proximaTerca.setHours(19); // Define a hora para 19h

              proximaTerca.setMinutes(0); // Define os minutos para 0 (opcional)
              // Converte a data para o formato ISO 8601

              var dataTercaISO8601 = proximaTerca.toISOString(); // Chama sua função passando o parâmetro dataTercaISO8601

              guild.scheduledEvents.create({
                name: 'Delta Force - Evento PS2 Online',
                scheduledStartTime: dataTercaISO8601,
                privacyLevel: 2,
                entityType: 2,
                channel: '591729371539046421',
                image: 'img/delta.webp',
                description: "\n                Todas as ter\xE7as \xE0s 19h teremos Delta Force Black Hawk Down Online!\n\n                DNS:45.7.228.197\n\n                GameID: Delta Force Black Hawk Down SLUS_211.24\n                ou\n                GamelD: Delta Force Black Hawk Down TEAM SABRE SLUS_214.14\n\n                Max Players: 16 Players\n\n                LINK DA IS0 : https://drive.google.com/file/d/1PGVZy1E2EoVQFd5S-fYhJSNWybqjBnLR\n                "
              }).then(function (event) {
                //console.log(event.url)
                var text = "Novo evento de PS2 online criado! Marque para n\xE3o perder! ".concat(event.url);
                client.channels.cache.get(genChatId).send(text);
              });
              console.log('evento criado');
            }, {
              scheduled: false
            }); //job.start()

            cron.schedule('0 17 * * *', function () {
              var createdEvents = guild.scheduledEvents.fetch().then(function (events) {
                events.forEach(function (event) {
                  var eventDate = event.scheduledStartAt;
                  var today = new Date(); //console.log(event.scheduledStartAt, new Date(), event.scheduledStartAt.getDay())

                  var day = eventDate.getDate();
                  var month = eventDate.getMonth();
                  var year = eventDate.getYear();
                  var hour = eventDate.getHours();
                  var minutes = eventDate.getMinutes();
                  var todayEvent = day == today.getDate() && month == today.getMonth() && year == today.getYear();

                  if (todayEvent == true) {
                    var text = "Hoje tem evento de PS2 Online! Marca ai! Come\xE7ando ".concat(hour, ":").concat(minutes, " ").concat(event.url);
                    client.channels.cache.get(genChatId).send(text);
                    client.channels.cache.get(ps2OnlineId).send(text);
                    sendToTelegram(event.url);
                  }
                });
              });
            });
            cron.schedule('0 8 * * *', function () {
              // Use uma API de gifs para obter uma gif de bom dia (neste exemplo, usamos a API do Giphy)
              fetch("https://api.giphy.com/v1/gifs/random?tag=bom%20dia&api_key=".concat(process.env.GIPHY_KEY)).then(function (res) {
                return res.json();
              }).then(function (data) {
                // Verifique se a resposta da API é válida
                if (data && data.data && data.data.images && data.data.images.original && data.data.images.original.url) {
                  var gifUrl = data.data.images.original.url; // Enviar a gif para o canal do Discord

                  var channel = client.channels.cache.get(channelId);

                  if (channel && channel.isText()) {
                    channel.send("Bom dia! flores do dia! ".concat(gifUrl));
                  }
                }
              })["catch"](function (error) {
                console.error('Erro ao obter a gif de bom dia:', error);
              });
            }); //remover cargos função funciona! não apagar!
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

          case 7:
          case "end":
            return _context.stop();
        }
      }
    });
  });
};

function sendToTelegram(data) {
  var url, apiToken, chat_id, text;
  return regeneratorRuntime.async(function sendToTelegram$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          url = 'https://api.telegram.org/bot';
          apiToken = process.env.TELEGRAM_TOKEN;
          chat_id = process.env.TELEGRAM_CHAT;
          text = "Hoje tem partida de PS2 Online no nosso discord! Acompanhe: ".concat(data); //tg.telegram.sendMessage(chatId, text)

          axios.post("".concat(url).concat(apiToken, "/sendPhoto"), {
            chat_id: chat_id,
            text: text
          });

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
}
"use strict";

var cron = require('node-cron');

var _require = require('discord.js'),
    Guilds = _require.Guilds,
    ChannelManager = _require.ChannelManager;

var _require2 = require('../config.json'),
    generalChatId = _require2.generalChatId,
    ps2OnlineId = _require2.ps2OnlineId,
    serverId = _require2.serverId,
    memesId = _require2.memesId;

var axios = require('axios');

module.exports = function _callee(client) {
  var guild, job, sendToTelegram;
  return regeneratorRuntime.async(function _callee$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          sendToTelegram = function _ref(data) {
            var url, apiToken, chat_id, text;
            return regeneratorRuntime.async(function sendToTelegram$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
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
                    return _context3.stop();
                }
              }
            });
          };

          guild = client.guilds.cache.get(serverId);
          console.log('carregado!', process.env.GIPHY_KEY); //0 0 * * 1
          //var job = cron.schedule('0 20 * * 2', () => {

          job = cron.schedule('0 20 * * 2', function () {
            console.log('Inicio do cron'); // Lógica para calcular a data das terças-feiras às 19h

            var hoje = new Date();
            var proximaTerca = new Date(hoje);
            proximaTerca.setDate(proximaTerca.getDate() + (2 + 7 - hoje.getDay()) % 7); // Próxima terça-feira

            proximaTerca.setHours(19); // Define a hora para 19h

            proximaTerca.setMinutes(0); // Define os minutos para 0 (opcional)
            // Converte a data para o formato ISO 8601

            var dataTercaISO8601 = proximaTerca.toISOString(); // Chama sua função passando o parâmetro dataTercaISO8601

            client.user.setUsername('ABOC');
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
              client.channels.cache.get(generalChatId).send(text);
              client.user.setUsername('HardBot 2023');
            });
            console.log('evento criado');
          }, {
            scheduled: false
          });
          job.start();
          cron.schedule('0 0 * * 1', function () {
            function bulkDelete(memesId) {
              var channel, messages;
              return regeneratorRuntime.async(function bulkDelete$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.next = 2;
                      return regeneratorRuntime.awrap(client.channels.fetch(memesId));

                    case 2:
                      channel = _context.sent;
                      _context.next = 5;
                      return regeneratorRuntime.awrap(channel.messages.fetch());

                    case 5:
                      messages = _context.sent;
                      channel.bulkDelete(messages).then(channel.send('https://media.giphy.com/media/26gscNQHswYio5RBu/giphy-downsized-large.gif'));

                    case 7:
                    case "end":
                      return _context.stop();
                  }
                }
              });
            }

            bulkDelete(memesId);
          });
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
                  client.channels.cache.get(generalChatId).send(text);
                  client.channels.cache.get(ps2OnlineId).send(text);
                  sendToTelegram(event.url);
                }
              });
            });
          });
          cron.schedule('0 8 * * *', function () {
            console.log('hora da gif!'); // Use uma API de gifs para obter uma gif de bom dia (neste exemplo, usamos a API do Giphy)
            //fetch(`https://api.giphy.com/v1/gifs/random?api_key=${process.env.GIPHY_KEY}&tag=bom%20dia&rating=g&lang=pt`)
            //.then(res => res.json())
            //.then(data => {

            axios.get('https://g.tenor.com/v1/random?q=bom%20dia&key=LIVDSRZULELA&limit=1&locale=pt_BR').then(function (response) {
              console.log('retorno da api ', response.data);
              var data = response.data; // Verifique se a resposta da API é válida

              if (data && data.results[0].url) {
                var sendGifToChannel = function sendGifToChannel(generalChatId) {
                  var channel;
                  return regeneratorRuntime.async(function sendGifToChannel$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          _context2.next = 2;
                          return regeneratorRuntime.awrap(client.channels.fetch(generalChatId));

                        case 2:
                          channel = _context2.sent;
                          console.log(channel);
                          channel.send("Bom dia! flores do dia! ".concat(gifUrl));

                        case 5:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  });
                };

                var gifUrl = data.results[0].url;
                console.log('ta na hora da gif ', gifUrl);
                sendGifToChannel(generalChatId); // Enviar a gif para o canal do Discord
                //client.channels.cache.get(generalChatId).send(`Bom dia! flores do dia! ${gifUrl}`)
                // if (channel && channel.isText()) {
                //     channel.send(`Bom dia! flores do dia! ${gifUrl}`);
                // }
              }
            })["catch"](function (error) {
              console.error('Erro ao obter a gif de bom dia:', error);
            });
          }); // cron.schedule('* * * * *', () => {
          //     console.log('limpando mensagens')
          //     async function bulkDelete(memesId){
          //         const channel = await client.channels.cache.get(memesId)
          //         fetched = await channel.fetchMessages({limit: 100});
          //         console.log(f)
          //         //message.channel.bulkDelete(fetched).then(message => console.log('mensagem apagada ', message))
          //     }
          // })
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

        case 8:
        case "end":
          return _context4.stop();
      }
    }
  });
};
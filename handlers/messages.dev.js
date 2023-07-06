"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require('../index'),
    client = _require.client;

var alertForum = "Seu post em nosso forum não pode ser aprovado pois o título possui palavras não permitidas ou é curto demais, por favor leia as regras com atenção antes de enviar mensagens no server. \n Mensagens com titulos extremamente vagos que não detalham o problema não serão aprovados!";
var filter = ['ajuda', 'ajude', 'me ajuda', 'socorro', 'urgente'];

var _require2 = require('discord.js'),
    MessageManager = _require2.MessageManager,
    EmbedBuilder = _require2.EmbedBuilder;

var axios = require('axios');

var _require3 = require('express'),
    urlencoded = _require3.urlencoded;

var fetch = require('node-fetch');

var cheerio = require('cheerio');

module.exports = function (client) {
  client.on('messageCreate', function _callee2(message) {
    var author, content, channel, regex, match, url;
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            //console.log(message)
            author = message.author;
            content = message.content;
            channel = client.channels.cache.get(message.channelId);
            console.log(author.username + ' - ' + channel.name + ' - ' + content);

            if (author != '1063528592648192011') {
              console.log('mensagem não é do bot'); //const regex = /https?:\/\/.*?aliexpress\.com\/item\/(\d+)\.html/i;
              //const regex = /https?:\/\/(?:.*?\.?aliexpress\.com\/(?:[^\/]+\/)?(?:[^\/]+\/)?(?:item\/)?([\w-]+)(?:\.html)?|(?:[^\/]+\.)?(?:[a-z]+\.)?aliexpress\.com\/(?:e|item)\/([\w-]+))/i;
              //const regex = /((http|ftp|https):\/\/)?(([\w.-]*)\.([\w]*))/i

              regex = /((http|ftp|https):\/\/)?(([\w.-]*)\.aliexpress\.com([:\d]*)?)([\w.-\/]*)*/i;
              match = content.match(regex);

              if (match) {
                //console.log(match.input)
                url = match.input;

                try {
                  (function _callee() {
                    var id, data;
                    return regeneratorRuntime.async(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            _context.next = 2;
                            return regeneratorRuntime.awrap(getProductId(url));

                          case 2:
                            id = _context.sent;
                            _context.next = 5;
                            return regeneratorRuntime.awrap(getShotUrl(id));

                          case 5:
                            data = _context.sent;
                            _context.next = 8;
                            return regeneratorRuntime.awrap(replyMsg(message, id, data));

                          case 8:
                          case "end":
                            return _context.stop();
                        }
                      }
                    });
                  })(); //const productId = await getProductId(url)
                  //console.log('Meta: ' + metaData.image)                    

                } catch (err) {
                  console.log(err);
                }
              }
            }

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    });
  });
  client.on('threadCreate', function _callee3(thread) {
    var postMember, messageId, channelId, palavras;
    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            //console.log(thread)
            postMember = thread.ownerId;
            messageId = thread.id;
            channelId = thread.parentId;

            if (thread.parent.type === 15) {
              if (filter.some(function (substring) {
                return thread.name.includes(substring);
              })) {
                client.users.send(postMember, alertForum);
                thread["delete"]();
              }

              palavras = thread.name.split(" ");

              if (palavras.length <= 2) {
                client.users.send(postMember, alertForum);
                thread["delete"]();
              }
            }

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    });
  });
};

function getProductId(url) {
  var finalUrl, newUrl, productPath, regex, match, productId;
  return regeneratorRuntime.async(function getProductId$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          console.log('URL recebida para obter ID: ' + url);
          finalUrl = '';

          if (!url.includes('/item/')) {
            _context4.next = 13;
            break;
          }

          console.log('Url não reduzida identificada, capturando id...');
          newUrl = new URL(url);
          productPath = newUrl.pathname;
          regex = /\/item\/(\d+)\.html/;
          match = productPath.match(regex);
          productId = match[1];
          console.log('ID do produto: ' + productId);
          return _context4.abrupt("return", productId);

        case 13:
          console.log('URL reduzida identificada, tentando descobrir URL original...');
          finalUrl = url;

          try {
            //metodo antigo com axios
            //const response = await axios.get(finalUrl)
            //
            //metodo novo com node fetch, precisa atualizad o node
            fetch(finalUrl, {
              redirect: 'follow',
              method: 'GET'
            }).then(function (res) {
              console.log('URL final identificada: ' + res.url);
              var productUrl = new URL(res.url);
              var productPath = productUrl.pathname;
              console.log('Parte 1: ' + productPath); //console.log(productUrl)

              var regex = /\/item\/(\d+)\.html/;
              var match = productPath.match(regex);
              var productId = match[1];
              console.log('ID do produto: ' + productId);
              return productId;
            })["catch"](function (err) {
              console.log(err);
            });
          } catch (err) {
            console.log(err);
          }

        case 16:
        case "end":
          return _context4.stop();
      }
    }
  });
}

function getShotUrl(id) {
  var apiUrl, response, data;
  return regeneratorRuntime.async(function getShotUrl$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          if (id == undefined) {
            console.log('ID não definida!');
          }

          console.log('ID recebida para api: ' + id);
          apiUrl = process.env.API_URL + id; //const apiUrl = 'http://aliapi/api/ali/' + id;

          _context5.prev = 3;
          _context5.next = 6;
          return regeneratorRuntime.awrap(axios.get(apiUrl));

        case 6:
          response = _context5.sent;
          data = '';

          if (response.data.erro) {
            //console.log('O produto não suporta link de afiliado :(')
            data = {
              erro: "O produto não suporta link de afiliado :("
            };
          } else {
            data = {
              title: response.data.title,
              link: response.data.link,
              price: response.data.price,
              image: response.data.image,
              discount: response.data.discount,
              category1: response.data.category1,
              category2: response.data.category2
            };
          }

          console.log(data);
          return _context5.abrupt("return", data);

        case 13:
          _context5.prev = 13;
          _context5.t0 = _context5["catch"](3);
          console.log(_context5.t0);

        case 16:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[3, 13]]);
} // async function getOpenGraphData(id) {
//     const url = `https://pt.aliexpress.com/item/${id}.html`
//     const ogs = require('open-graph-scraper');
//     const options = { url: `https://pt.aliexpress.com/item/${id}.html`, redirect: "error" };
//     let result;
//     let attempts = 0;
//     while (attempts < 100 && (!result || !result.ogTitle)) {
//         try {
//             const { error, html, result: ogResult, response } = await ogs(options);
//             //console.log('error:', error);
//             //console.log('result:', ogResult);
//             result = ogResult;
//             attempts++;
//         } catch (error) {
//             console.error('Error:', error);
//             return null;
//         }
//     }
//     if (result && result.ogTitle) {
//         return result;
//     } else {
//         return null;
//     }
// }
// async function getOpenGraphData(id) {
//     const url = `https://pt.aliexpress.com/item/${id}.html`
//     let ogData = null;
//     while (!ogData) {
//         console.log('Tentando resgatar informações...')
//         try {
//             console.log('começando...')
//             // const response = await fetch(url, { redirect: 'manual' });
//             // if (!response.ok) {
//             //     throw new Error('Erro ao obter o conteúdo da URL.');
//             // }
//             const response = await axios.get(url, { follow: false });
//             if (!response.status === 200) {
//                 throw new Error('Erro ao obter o conteúdo da URL.');
//             }
//             //const html = await response.text();
//             const html = await response.data;
//             // Use o cheerio para carregar o HTML
//             const $ = cheerio.load(html);
//             //console.log($)
//             ogData = {
//                 ogTitle: $('meta[property="og:title"]').attr('content'),
//                 ogDescription: $('meta[property="og:description"]').attr('content'),
//                 ogImage: $('meta[property="og:image"]').attr('content'),
//                 // Adicione outras tags OpenGraph que você precisa extrair
//             };
//         } catch (error) {
//             console.error('Erro ao obter os dados do OpenGraph:', error.message);
//         }
//     }
//     console.log(ogData)
//     return ogData;
// }
// async function getOpenGraphData(id) {
//     const url = `https://pt.aliexpress.com/item/${id}.html`;
//     const maxAttempts = 5;
//     const delay = 1000; // tempo de espera em milissegundos
//     let ogData = null;
//     let attempt = 1;
//     while (attempt <= maxAttempts && ogData === null) {
//         console.log('Tentativa: ' + attempt);
//         try {
//             const response = await axios.get(url, { maxRedirects: 0 });
//             if (response.status !== 200) {
//             throw new Error('Erro ao obter o conteúdo da URL.');
//             }
//             const html = response.data;
//             // Use o cheerio para carregar o HTML
//             const $ = cheerio.load(html);
//             ogData = {
//             ogTitle: $('meta[property="og:title"]').attr('content'),
//             ogDescription: $('meta[property="og:description"]').attr('content'),
//             ogImage: $('meta[property="og:image"]').attr('content'),
//             // Adicione outras tags OpenGraph que você precisa extrair
//             };
//         } catch (error) {
//             console.error('Erro ao obter os dados do OpenGraph:', error.message);
//         }
//         attempt++;
//         if (ogData === null && attempt <= maxAttempts) {
//             await new Promise((resolve) => setTimeout(resolve, delay));
//         }
//         }
//         console.log(ogData);
//         return ogData;
// }
// async function getOpenGraphData(id) {
//     const url = `https://pt.aliexpress.com/item/${id}.html`;
//     const maxAttempts = 50;
//     const delay = 1000; // Delay entre as tentativas (em milissegundos)
//     let ogData = null;
//     let attempt = 1;
//     while (attempt <= maxAttempts && (ogData === null || ogData === undefined || hasUndefinedValues(ogData))) {
//         console.log('Tentativa: ' + attempt);
//         try {
//             const response = await axios.get(url, { maxRedirects: 0 });
//             if (response.status !== 200) {
//                 throw new Error('Erro ao obter o conteúdo da URL.');
//             }
//             const html = response.data;
//             const $ = cheerio.load(html);
//             ogData = {
//                 ogTitle: $('meta[property="og:title"]').attr('content'),
//                 ogDescription: $('meta[property="og:description"]').attr('content'),
//                 ogImage: $('meta[property="og:image"]').attr('content'),
//                 // Adicione outras tags OpenGraph que você precisa extrair
//             };
//         } catch (error) {
//             console.error('Erro ao obter os dados do OpenGraph:', error.message);
//         }
//         attempt++;
//         if (!ogData && attempt <= maxAttempts) {
//             await new Promise((resolve) => setTimeout(resolve, delay));
//         }
//     }
//     console.log(ogData);
//     return ogData;
// }
// async function getProductInfo(id){
//     const apiUrl = 'http://aliapi/api/product/' + id;
//     //const apiUrl = 'http://127.0.0.1:8000/api/product/' + id;
//     return new Promise((resolve, reject) => {
//         axios.get(apiUrl)
//         .then(function(response) {
//             console.log("Resultado API: " + response.data);
//             //console.log(response.status);
//             //console.log(response.statusText);
//             resolve(response.data);
//         })
//         .catch(function(error) {
//             //console.error(error);
//             reject(error);
//         });
//     });
// }


function replyMsg(message, productId, data) {
  var productMessage;
  return regeneratorRuntime.async(function replyMsg$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          //const data = await getShotUrl(productId);
          console.log(data);

          if (!(data && data.erro)) {
            _context6.next = 6;
            break;
          }

          message.reply('O produto não tem suporte a link de afiliado, use o link original: https://pt.aliexpress.com/item/' + productId + '.html');
          return _context6.abrupt("return");

        case 6:
          console.log('URL Reduzida: ' + data.link);
          console.log(data);
          productMessage = new EmbedBuilder().setColor(0x0099FF).setTitle(data.title).setURL(data.link).setAuthor({
            name: 'HardLevel',
            iconURL: data.image,
            url: data.link
          }).setDescription(data.title).setThumbnail(data.image).addFields({
            name: 'Preço',
            value: data.price,
            inline: true
          }, {
            name: 'Categoria primária',
            value: data.category1,
            inline: true
          }, _defineProperty({
            name: 'Categoria secundária',
            value: data.category2,
            inline: true
          }, "inline", true)).setImage(data.image).setTimestamp().setFooter({
            text: 'Aproveite esta oferta incrível!',
            iconURL: data.image
          });
          message.reply({
            embeds: [productMessage]
          }).then(function (msg) {
            return setTimeout(function () {
              return message["delete"]();
            }, 3000);
          }).then(sendToTelegram(data));

        case 10:
        case "end":
          return _context6.stop();
      }
    }
  });
}

function sendToTelegram(data) {
  var url, apiToken, chat_id, caption, photo;
  return regeneratorRuntime.async(function sendToTelegram$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          url = 'https://api.telegram.org/bot';
          apiToken = process.env.TELEGRAM_TOKEN;
          console.log('Url recebida para enviar para o telegram: ' + data.link);
          chat_id = process.env.TELEGRAM_CHAT;
          caption = "Confira esse produto que foi compartilhado no Discord! Talvez seja do seu interesse! ".concat(data.title, " ").concat(data.link);
          photo = data.image; //tg.telegram.sendMessage(chatId, text)

          axios.post("".concat(url).concat(apiToken, "/sendPhoto"), {
            chat_id: chat_id,
            caption: caption,
            photo: photo
          });

        case 7:
        case "end":
          return _context7.stop();
      }
    }
  });
}
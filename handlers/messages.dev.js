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

                (function _callee() {
                  var productId, data;
                  return regeneratorRuntime.async(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.prev = 0;
                          _context.next = 3;
                          return regeneratorRuntime.awrap(getProductId(url));

                        case 3:
                          productId = _context.sent;
                          _context.next = 6;
                          return regeneratorRuntime.awrap(getShortUrl(productId));

                        case 6:
                          data = _context.sent;
                          _context.next = 9;
                          return regeneratorRuntime.awrap(replyMsg(message, productId, data));

                        case 9:
                          _context.next = 14;
                          break;

                        case 11:
                          _context.prev = 11;
                          _context.t0 = _context["catch"](0);
                          console.log(_context.t0);

                        case 14:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, null, null, [[0, 11]]);
                })();
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

function replyMsg(message, productId, data) {
  var productMessage;
  return regeneratorRuntime.async(function replyMsg$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          console.log(data);

          if (!(data && data.erro)) {
            _context4.next = 6;
            break;
          }

          message.reply('O produto não tem suporte a link de afiliado, use o link original: https://pt.aliexpress.com/item/' + productId + '.html');
          return _context4.abrupt("return");

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
          return _context4.stop();
      }
    }
  });
}

function getProductId(url) {
  var finalUrl, newUrl, productPath, regex, match, productId, res, productUrl, _productPath, _regex, _match, _productId;

  return regeneratorRuntime.async(function getProductId$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          console.log('URL recebida para obter ID: ' + url);
          finalUrl = '';

          if (!url.includes('/item/')) {
            _context5.next = 13;
            break;
          }

          console.log('Url não reduzida identificada, capturando id...');
          newUrl = new URL(url);
          productPath = newUrl.pathname;
          regex = /\/item\/(\d+)\.html/;
          match = productPath.match(regex);
          productId = match[1];
          console.log('ID do produto: ' + productId);
          return _context5.abrupt("return", productId);

        case 13:
          console.log('URL reduzida identificada, tentando descobrir URL original...');
          finalUrl = url;
          _context5.prev = 15;
          _context5.next = 18;
          return regeneratorRuntime.awrap(fetch(finalUrl, {
            redirect: 'follow',
            method: 'GET'
          }));

        case 18:
          res = _context5.sent;
          console.log('URL final identificada: ' + res.url);
          productUrl = new URL(res.url);
          _productPath = productUrl.pathname;
          console.log('Parte 1: ' + _productPath);
          _regex = /\/item\/(\d+)\.html/;
          _match = _productPath.match(_regex);
          _productId = _match[1];
          console.log('ID do produto: ' + _productId);
          return _context5.abrupt("return", _productId);

        case 30:
          _context5.prev = 30;
          _context5.t0 = _context5["catch"](15);
          console.log(_context5.t0);

        case 33:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[15, 30]]);
}

function getShortUrl(id) {
  var apiUrl, response, data;
  return regeneratorRuntime.async(function getShortUrl$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          if (id == undefined) {
            console.log('ID não definida!');
          }

          console.log('ID recebida para api: ' + id);
          apiUrl = process.env.API_URL + id; //const apiUrl = 'http://aliapi/api/ali/' + id;

          _context6.prev = 3;
          _context6.next = 6;
          return regeneratorRuntime.awrap(axios.get(apiUrl));

        case 6:
          response = _context6.sent;
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
          return _context6.abrupt("return", data);

        case 13:
          _context6.prev = 13;
          _context6.t0 = _context6["catch"](3);
          console.log(_context6.t0);

        case 16:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[3, 13]]);
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
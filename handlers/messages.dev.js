"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//const { client } = require('../index')
var alertForum = "Seu post em nosso forum não pode ser aprovado pois o título possui palavras não permitidas ou é curto demais, por favor leia as regras com atenção antes de enviar mensagens no server. \n Mensagens com titulos extremamente vagos que não detalham o problema não serão aprovados!";
var filter = ['ajuda', 'ajude', 'me ajuda', 'socorro', 'urgente'];

var _require = require('discord.js'),
    MessageManager = _require.MessageManager,
    EmbedBuilder = _require.EmbedBuilder,
    GuildMember = _require.GuildMember,
    GuildMemberManager = _require.GuildMemberManager;

var axios = require('axios');

var _require2 = require('express'),
    urlencoded = _require2.urlencoded;

var fetch = require('node-fetch');

module.exports = function (client) {
  client.on('messageCreate', function _callee3(message) {
    var roles, oplRoom, author, content, channel, perguntaTxt, downloader, memberHasRole, terms, regex, match, url;
    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            //console.log(message)
            roles = ['538803451812118538', '538803569005166602', '594656987237711892', '758085659272675329'];
            oplRoom = '1145723573839867975';
            author = message.author;
            content = message.content;
            channel = client.channels.cache.get(message.channelId);
            perguntaTxt = "pergunta: substantivo feminino\n" + "palavra ou frase com que se faz uma interroga\xE7\xE3o.\n" + "quest\xE3o que se submete a algu\xE9m de quem se espera que a resolva.";

            if (message.channelId == '1145723573839867975') {
              downloader = require('./downloader')();
            }

            if (!(author == true)) {
              _context3.next = 12;
              break;
            }

            console.log('é mensagem de um bot');
            return _context3.abrupt("return");

          case 12:
            //console.log('não é mensagem de bot')
            //console.log(author)
            memberHasRole = function memberHasRole(member) {
              roles.forEach(function (item) {
                member.roles.cache.some(function (role) {
                  role.id === item;
                });
              });
            }; //console.log(memberHasRole);


            if (!memberHasRole(message.member) && author != '1063528592648192011') {
              if (message.channelId == '538756978420219905') {
                if (content.includes('pergunta') && (content.includes('duvida') || content.includes('dúvida'))) {
                  message.reply("De acordo com o dicion\xE1rio, a defini\xE7\xE3o de pergunta:\n\n".concat(perguntaTxt, "\n\nPor gentileza, n\xE3o meta o louco"));
                }
              } //console.log(message.member.roles.cache.has('1143207357862645830'))


              if (message.member.roles.cache.has('1143207357862645830') && message.channelId == '538756978420219905') {
                //console.log('primeira mensagem')
                message.member.roles.remove('1143207357862645830');

                if (content.includes('?')) {
                  message.reply('Essa é sua primeira mensagem no server, mas parece que aceitou as regras sem ler, se atente ao nome dessa sala e leia novamente as <#538757121538392075> e evite problemas!');
                }
              }

              terms = ['tenho duvida', 'tenho dúvida', 'tenho uma dúvida', 'tenho uma duvida', 'tirar dúvida', 'tirar duvida', 'tira duvida', 'tira dúvida'];

              if (message.channelId == '538756978420219905') {
                if (terms.some(function (term) {
                  return content.includes(term);
                })) {
                  message.reply("Não use esse chat para tirar duvidas de tutoriais ou solucionar problemas! Use as salas apropriadas para cada assunto! leia as <#538757121538392075>");
                }

                if (content.includes("sou novo")) {
                  message.reply("Seja bem vindo ao nosso server, por favor certifique-se de ter lido atentamente as <#538757121538392075>, respeite o tema de cada sala");
                }
              }
            } //console.log(author.username + ' - ' + channel.name + ' - ' + content)


            if (author != '1063528592648192011') {
              //console.log('mensagem não é do bot')
              //const regex = /https?:\/\/.*?aliexpress\.com\/item\/(\d+)\.html/i;
              //const regex = /https?:\/\/(?:.*?\.?aliexpress\.com\/(?:[^\/]+\/)?(?:[^\/]+\/)?(?:item\/)?([\w-]+)(?:\.html)?|(?:[^\/]+\.)?(?:[a-z]+\.)?aliexpress\.com\/(?:e|item)\/([\w-]+))/i;
              //const regex = /((http|ftp|https):\/\/)?(([\w.-]*)\.([\w]*))/i
              regex = /((http|ftp|https):\/\/)?(([\w.-]*)\.aliexpress\.com([:\d]*)?)([\w.-\/]*)*/i;
              match = content.match(regex);

              if (match) {
                //console.log(match.input)
                url = match.input; //console.log('link do aliexpress encontrado! ', url);

                (function _callee() {
                  var productId, data;
                  return regeneratorRuntime.async(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.next = 2;
                          return regeneratorRuntime.awrap(getProductId(url));

                        case 2:
                          productId = _context.sent;
                          _context.next = 5;
                          return regeneratorRuntime.awrap(getShortUrl(productId));

                        case 5:
                          data = _context.sent;
                          _context.next = 8;
                          return regeneratorRuntime.awrap(replyMsg(message, productId, data));

                        case 8:
                        case "end":
                          return _context.stop();
                      }
                    }
                  });
                })();
              } else {
                (function _callee2() {
                  var searchTerm, urlMatches, _url;

                  return regeneratorRuntime.async(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          searchTerm = /(https?:\/\/(?:www\.)?(?:amazon\.com(?:\.br)?|amzn\.[a-z]+)\/\S+)/i;

                          if (content.includes('amazon') || content.includes('amzn')) {
                            urlMatches = content.match(searchTerm);

                            if (urlMatches && urlMatches.length > 0) {
                              _url = urlMatches[0]; //console.log('link da amazon encontrado! ', url)

                              getAmazonId(_url, message);
                            }
                          }

                        case 2:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  });
                })();
              }
            }

          case 15:
          case "end":
            return _context3.stop();
        }
      }
    });
  });
  client.on('threadCreate', function _callee4(thread) {
    var postMember, messageId, channelId, palavras;
    return regeneratorRuntime.async(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
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
            return _context4.stop();
        }
      }
    });
  });
};

function replyMsg(message, productId, data) {
  var productMessage;
  return regeneratorRuntime.async(function replyMsg$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          if (!(data && data.error)) {
            _context5.next = 5;
            break;
          }

          message.reply('O produto não tem suporte a link de afiliado, use o link original: https://pt.aliexpress.com/item/' + productId + '.html');
          return _context5.abrupt("return");

        case 5:
          //console.log('URL Reduzida: ' + data.link)
          //console.log(data)
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
            value: data.category1 ? data.category1 : 'Games',
            inline: true
          }, _defineProperty({
            name: 'Categoria secundária',
            value: data.category2 ? data.category2 : 'Games',
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

        case 7:
        case "end":
          return _context5.stop();
      }
    }
  });
}

function getAmazonId(url, message) {
  return regeneratorRuntime.async(function getAmazonId$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          fetch(url, {
            redirect: 'follow',
            method: 'GET'
          }).then(function (response) {
            var url = new URL(response.url); //let path = url.pathname

            var params = url.searchParams;
            var id = params.get('pd_rd_i'); //console.log(id)

            getAmazonProduct(id, message);
          })["catch"](function (error) {
            return console.log(error);
          });

        case 1:
        case "end":
          return _context6.stop();
      }
    }
  });
}

function getAmazonProduct(id, message) {
  var apiUrl;
  return regeneratorRuntime.async(function getAmazonProduct$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          //console.log(id, message)
          apiUrl = process.env.API_URL + 'amz/' + id; //fetch(apiUrl).then(response => console.log(response.text()))

          axios.get(apiUrl).then(function (response) {
            //console.log(response.data)
            data = {
              title: response.data.title,
              link: response.data.link,
              price: response.data.price,
              image: response.data.image
            };
            replyMsg(message, id, data);
          })["catch"](function (err) {
            return console.log(err);
          });

        case 2:
        case "end":
          return _context7.stop();
      }
    }
  });
}

function getProductId(url) {
  var finalUrl, newUrl, productPath, regex, match, productId, res, productUrl, _productPath, _regex, _match, _productId;

  return regeneratorRuntime.async(function getProductId$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          //console.log('URL recebida para obter ID: ' + url)
          finalUrl = '';

          if (!url.includes('/item/')) {
            _context8.next = 10;
            break;
          }

          //console.log('Url não reduzida identificada, capturando id...')
          newUrl = new URL(url);
          productPath = newUrl.pathname;
          regex = /\/item\/(\d+)\.html/;
          match = productPath.match(regex);
          productId = match[1]; //console.log('ID do produto: ' + productId)

          return _context8.abrupt("return", productId);

        case 10:
          //console.log('URL reduzida identificada, tentando descobrir URL original...')
          finalUrl = url;
          _context8.prev = 11;
          _context8.next = 14;
          return regeneratorRuntime.awrap(fetch(finalUrl, {
            redirect: 'follow',
            method: 'GET'
          }));

        case 14:
          res = _context8.sent;
          //console.log('URL final identificada: ' + res.url)
          productUrl = new URL(res.url);
          _productPath = productUrl.pathname; //console.log('Parte 1: ' + productPath)

          _regex = /\/item\/(\d+)\.html/;
          _match = _productPath.match(_regex);
          _productId = _match[1]; //console.log('ID do produto: ' + productId)
          //console.log(cb(productId));
          //cb(productId);

          return _context8.abrupt("return", _productId);

        case 23:
          _context8.prev = 23;
          _context8.t0 = _context8["catch"](11);
          console.log(_context8.t0);

        case 26:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[11, 23]]);
}

function getShortUrl(id) {
  var ali, res, data;
  return regeneratorRuntime.async(function getShortUrl$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          //console.log('Obtendo informações de produto com ID: ', id);
          ali = require('../functions/ali_api');
          _context9.next = 3;
          return regeneratorRuntime.awrap(ali(id));

        case 3:
          res = _context9.sent;
          data = {};

          if (res.error) {
            data.error = "Este produto não possui suporte a link afiliado, use o link original";
          } else {
            //console.log(await res.erro);
            data = {
              title: res.title,
              link: res.link,
              price: res.price,
              image: res.image,
              discount: res.discount,
              category1: res.category1,
              category2: res.category2
            };
          } //console.log("Retorno do ali: ", data);


          return _context9.abrupt("return", data);

        case 7:
        case "end":
          return _context9.stop();
      }
    }
  });
}

function sendToTelegram(data) {
  var telegram, message;
  return regeneratorRuntime.async(function sendToTelegram$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          telegram = require('../functions/telegram_sendphoto');
          message = {
            caption: "Confira esse produto que foi compartilhado no Discord! Talvez seja do seu interesse! ".concat(data.title, " ").concat(data.link),
            photo: data.image
          };
          _context10.next = 4;
          return regeneratorRuntime.awrap(telegram(message));

        case 4:
        case "end":
          return _context10.stop();
      }
    }
  });
}
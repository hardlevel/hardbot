"use strict";

require('dotenv').config();

var _require = require('discord.js'),
    Client = _require.Client,
    Collection = _require.Collection,
    Events = _require.Events,
    GatewayIntentBits = _require.GatewayIntentBits,
    MessageManager = _require.MessageManager,
    ActionRowBuilder = _require.ActionRowBuilder,
    ButtonBuilder = _require.ButtonBuilder,
    ButtonStyle = _require.ButtonStyle,
    Message = _require.Message,
    Interaction = _require.Interaction,
    Thread = _require.Thread,
    channelMention = _require.channelMention,
    MessageActionRow = _require.MessageActionRow,
    MessageButton = _require.MessageButton,
    ChannelType = _require.ChannelType,
    GuildScheduledEvent = _require.GuildScheduledEvent,
    GuildScheduledEventManager = _require.GuildScheduledEventManager;

var client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildScheduledEvents],
  presence: {
    activities: [{
      name: "Aqui é a casa do Playstation!",
      type: 0
    }],
    status: 'dnd'
  }
});

var fs = require('node:fs');

var path = require('node:path');

var util = require('util');

var messages = require('./handlers/messages'); //const startBot = require('./modules/startBot')


var rulesChannel = '';
var tentativas = {};
var AuthenticationToken = process.env.DISCORD_TOKEN;

if (!AuthenticationToken) {
  console.warn("[CRASH] Authentication Token for Discord bot is required! Use Envrionment Secrets or config.js.".red); //return process.exit();
}

; //module.exports = client;
// Login to the bot:

client.login(AuthenticationToken)["catch"](function (err) {
  console.error("[CRASH] Something went wrong while connecting to your bot...");
  console.error("[CRASH] Error from Discord API:" + err);
  return process.exit();
}); // Handle errors:

process.on('unhandledRejection', function _callee(err, promise) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.error("[ANTI-CRASH] Unhandled Rejection: ".concat(err).red);
          console.error(promise);

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
}); //importar modulos
//const { handleMessage } = require('./modules/messageHandler');

var _require2 = require('./config'),
    token = _require2.token,
    noobId = _require2.noobId,
    serverId = _require2.serverId,
    botId = _require2.botId,
    urlRegex = _require2.urlRegex,
    rulesChannelId = _require2.rulesChannelId,
    generalChatId = _require2.generalChatId;

client.once(Events.ClientReady, function (c) {
  //console.log(`Ready! Logged in as ${c.user.tag}`);
  messages(client);

  require('./events/cron_events.js')(client); //console.log(client.commands)
  //console.log(client.application)

});
client.commands = new Collection();
var foldersPath = path.join(__dirname, 'commands');
var commandFolders = fs.readdirSync(foldersPath);
var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
  for (var _iterator = commandFolders[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
    var folder = _step.value;
    var commandsPath = path.join(foldersPath, folder);
    var commandFiles = fs.readdirSync(commandsPath).filter(function (file) {
      return file.endsWith('.js');
    });
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = commandFiles[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var file = _step2.value;
        var filePath = path.join(commandsPath, file);

        var command = require(filePath);

        if ('data' in command && 'execute' in command) {
          client.commands.set(command.data.name, command);
        } else {
          console.log("[WARNING] The command at ".concat(filePath, " is missing a required \"data\" or \"execute\" property."));
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
          _iterator2["return"]();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  }
} catch (err) {
  _didIteratorError = true;
  _iteratorError = err;
} finally {
  try {
    if (!_iteratorNormalCompletion && _iterator["return"] != null) {
      _iterator["return"]();
    }
  } finally {
    if (_didIteratorError) {
      throw _iteratorError;
    }
  }
}

client.on('interactionCreate', function _callee2(interaction) {
  var command;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (interaction.isCommand()) {
            _context2.next = 2;
            break;
          }

          return _context2.abrupt("return");

        case 2:
          command = client.commands.get(interaction.commandName); //console.log(command)

          if (command) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return");

        case 5:
          _context2.prev = 5;
          _context2.next = 8;
          return regeneratorRuntime.awrap(command.execute(interaction));

        case 8:
          _context2.next = 15;
          break;

        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](5);
          console.error(_context2.t0);
          _context2.next = 15;
          return regeneratorRuntime.awrap(interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true
          }));

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[5, 10]]);
});
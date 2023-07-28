"use strict";

var _require = require('discord.js'),
    REST = _require.REST,
    Routes = _require.Routes;

var _require2 = require('./config.json'),
    clientId = _require2.clientId,
    guildId = _require2.guildId,
    token = _require2.token;

var fs = require('node:fs');

var path = require('node:path');

var commands = []; // Grab all the command files from the commands directory you created earlier

var foldersPath = path.join(__dirname, 'commands');
var commandFolders = fs.readdirSync(foldersPath);
var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
  for (var _iterator = commandFolders[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
    var folder = _step.value;
    // Grab all the command files from the commands directory you created earlier
    var commandsPath = path.join(foldersPath, folder);
    var commandFiles = fs.readdirSync(commandsPath).filter(function (file) {
      return file.endsWith('.js');
    }); // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = commandFiles[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var file = _step2.value;
        var filePath = path.join(commandsPath, file);

        var command = require(filePath);

        if ('data' in command && 'execute' in command) {
          console.log(command);
          commands.push(command.data.toJSON());
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
  } // Construct and prepare an instance of the REST module

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

var rest = new REST().setToken(token); // and deploy your commands!

(function _callee() {
  var data;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          console.log("Started refreshing ".concat(commands.length, " application (/) commands.")); // The put method is used to fully refresh all commands in the guild with the current set

          _context.next = 4;
          return regeneratorRuntime.awrap(rest.put(Routes.applicationGuildCommands(clientId, guildId), {
            body: commands
          }));

        case 4:
          data = _context.sent;
          console.log("Successfully reloaded ".concat(data.length, " application (/) commands."));
          _context.next = 11;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          // And of course, make sure you catch and log any errors!
          console.error(_context.t0);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
})();
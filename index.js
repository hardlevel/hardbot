require('dotenv').config();

const {
    Client,
    Events,
    GatewayIntentBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Message,
    Thread,
    channelMention,
    MessageActionRow,
    MessageButton,
    ChannelType
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
    ],
    presence: {
        activities: [{
            name: "Aqui é a casa do Playstation!",
            type: 0
        }],
        status: 'dnd'
    }    
});

const util = require('util');
const axios = require('axios');
const cron = require('node-cron');
const { stringify } = require('querystring');

const messages = require('./handlers/messages')
const startBot = require('./modules/startBot')

let rulesChannel = ''
var tentativas = {}

const AuthenticationToken = process.env.DISCORD_TOKEN;
if (!AuthenticationToken) {
    console.warn("[CRASH] Authentication Token for Discord bot is required! Use Envrionment Secrets or config.js.".red)
    return process.exit();
};

//module.exports = client;

// Login to the bot:
client.login(AuthenticationToken)
    .catch((err) => {
        console.error("[CRASH] Something went wrong while connecting to your bot...");
        console.error("[CRASH] Error from Discord API:" + err);
        return process.exit();
    });

// Handle errors:
process.on('unhandledRejection', async (err, promise) => {
    console.error(`[ANTI-CRASH] Unhandled Rejection: ${err}`.red);
    console.error(promise);
});

//importar modulos
const { handleMessage } = require('./modules/messageHandler');

const { token, noobId, serverId, botId, urlRegex, rulesChannelId, generalChatId } = require('./config')

startBot(client)
messages(client)

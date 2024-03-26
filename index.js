global.baseDir = __dirname;
const logger = require('./logger');
require('dotenv').config();
const {
    Client,
    Collection,
    Events,
    GatewayIntentBits,
    MessageManager,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Message,
    Interaction,
    Thread,
    channelMention,
    MessageActionRow,
    MessageButton,
    ChannelType,
    GuildScheduledEvent,
    GuildScheduledEventManager
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildScheduledEvents
    ],
    presence: {
        activities: [{
            name: "Aqui é a casa do Playstation!",
            type: 0
        }],
        status: 'dnd'
    }
});
//const { token, noobId, serverId, botId, urlRegex, rulesChannelId, generalChatId } = require('./config')
const fs = require('node:fs');
const { access, constants } = require('node:fs');
const path = require('node:path');
const messages = require('./handlers/messages');
const AuthenticationToken = process.env.DISCORD_TOKEN;
if (!AuthenticationToken) {
    console.warn("[CRASH] Authentication Token for Discord bot is required! Use Envrionment Secrets or config.js.".red)
    //return process.exit();
};
// const games = require('./src/controllers/gamesController');
//games.add();

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

client.once(Events.ClientReady, c => {
    //console.log(`Ready! Logged in as ${c.user.tag}`);
    messages(client)
    require('./events/cron_events.js')(client);
    //console.log(client.commands)
    //console.log(client.application)
    //client.user.setUsername('HardBot 2023');
});

client.commands = new Collection();
client.cooldowns = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

client.on('interactionCreate', async interaction => {
    //console.log(interaction)
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    //console.log(command)
    if (!command) return;

    const { cooldowns } = client;

    if (!cooldowns.has(command.data.name)) {
        cooldowns.set(command.data.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.data.name);
    const defaultCooldownDuration = 3;
    const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

    if (timestamps.has(interaction.user.id)) {
        const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

        if (now < expirationTime) {
            const expiredTimestamp = Math.round(expirationTime / 1000);
            return interaction.reply({ content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`, ephemeral: true });
        }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

const files = ['./logs/error.log', './logs/server.log', './data/pin.json', './database/database.sqlite'];
files.forEach(file => {
  let ext = path.extname(file);
  if (fs.existsSync(file)) {
    if (ext == '.log') {
      fs.unlinkSync(file);
    } else {
      checkPermissions(file);
    }
  }
})
function checkPermissions(file, test = 0) {
  if (test < 2) {
      access(file, constants.R_OK | constants.W_OK, (err) => {
      console.log(`${file} ${err ? 'is not' : 'is'} readable and writable`);
      if (err) {
        setPermissions(file, test);
      }
    });
  } else {
    console.error('Não foi possível alterar as permissões do arquivo! ', file);
  }
}
function setPermissions(file, test){
  test++
  fs.chown(file, 1001, 116, (error) => {
    if (error)
      console.log("Error Code:", error);
    else
      console.log("uid and gid set successfully");
      checkPermissions(file, test);
  });
}


//fetch('https://amzn.to/43RUROk').then(response => console.log(response))

//axios.get('https://amzn.to/3Oh00tI', {maxRedirects:0}).then(response => console.log(response.request._events))
// const ProductAdvertisingAPIv1 = require('paapi5-nodejs-sdk')
// var defaultClient = ProductAdvertisingAPIv1.ApiClient.instance;

// // Specify your credentials here. These are used to create and sign the request.
// defaultClient.accessKey = process.env.AMAZON_KEY;
// defaultClient.secretKey = process.env.AMAZON_SECRET;
// console.log(defaultClient.accessKey, defaultClient.secretKey)
// /**
//  * PAAPI Host and Region to which you want to send request.
//  * For more details refer: https://webservices.amazon.com/paapi5/documentation/common-request-parameters.html#host-and-region
//  */
// defaultClient.host = 'webservices.amazon.com.br';
// defaultClient.region = 'us-east-1';

// var api = new ProductAdvertisingAPIv1.DefaultApi();

// // Request Initialization

// var getItemsRequest = new ProductAdvertisingAPIv1.GetItemsRequest();

// /** Enter your partner tag (store/tracking id) and partner type */
// getItemsRequest['PartnerTag'] = 'hardlevel-20';
// getItemsRequest['Service'] = 'ProductAdvertisingAPIv1';
// getItemsRequest['PartnerType'] = 'Associates';
// getItemsRequest['ItemIds'] = ['B0CCX369YT'];
// getItemsRequest['Condition'] = 'New';
// getItemsRequest['Resources'] = ['Images.Primary.Medium', 'ItemInfo.Title', 'Offers.Listings.Price'];

// api.getItems(getItemsRequest).then(response => console.log(response.ItemsResult))



// async function getMobyGamePlatform(){

//       const { getMultiGames } = require('./functions/mobby');
//       try {
//         const game = await getMultiGames('ps1', 'ps2');
//         return game;
//         // client.channels.cache.get(generalChatId).send(text)
//       } catch (error) {
//         console.error(error);
//       }

// }
// // getMobyGamePlatform().then(record => console.log(record));
// console.log(getMobyGamePlatform());
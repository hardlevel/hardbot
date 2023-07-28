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
const fs = require('node:fs');
const path = require('node:path');
const util = require('util');


const messages = require('./handlers/messages')
//const startBot = require('./modules/startBot')

let rulesChannel = ''
var tentativas = {}

const AuthenticationToken = process.env.DISCORD_TOKEN;
if (!AuthenticationToken) {
    console.warn("[CRASH] Authentication Token for Discord bot is required! Use Envrionment Secrets or config.js.".red)
    //return process.exit();
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
//const { handleMessage } = require('./modules/messageHandler');

const { token, noobId, serverId, botId, urlRegex, rulesChannelId, generalChatId } = require('./config')



client.once(Events.ClientReady, c => {
	//console.log(`Ready! Logged in as ${c.user.tag}`);
    messages(client)
    require('./events/cron_events.js')(client);
    //console.log(client.commands)
    //console.log(client.application)
});

client.commands = new Collection();
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

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});


//EAAKOPZAZBy5Y8BO6tfQ3NTADxVQO7RTssvtuzDfgCKB3bOGt4GQHE0eilK0gbOmy3YCEKWBVr68dn9UzLaWjmr9LqqyKoyuxUFhoKZCnxruVErhNcfTvEn4OSG8Wmq1HM2ZA6sOqrkMSu0HNapVNV3ZAj6iDDKUhhuQR6CuIHIqkr3HcSJ0ByZCEKphEZAqfFZBXFm0I733YspqdBfPSdIYCn258L9khRO9s5XmDfT03118ZD
const Facebook = require('facebook-node-sdk');

const facebook = new Facebook({ appId: '719345276872079', secret: '79090a7803aae95be19192f5e7db5127' });
console.log(facebook)
facebook.api(`/PAGE_ID/feed`, 'post', { message: 'Hello, world!' }, function(res) {
  if(!res || res.error) {
    console.log(!res ? 'error occurred' : res.error);
    return;
  }
  console.log('Post Id: ' + res.id);
});

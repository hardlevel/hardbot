//const { SlashCommandBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios')

module.exports = {
    cooldown: 60,
	data: new SlashCommandBuilder()
		.setName('bomdia')
		.setDescription('CADE MEU BOM DIA?!'),
	async execute(interaction) {
		axios.get('https://g.tenor.com/v1/random?q=bom%20dia&key=LIVDSRZULELA&limit=1&locale=pt_BR')
        .then((response) => {        
			interaction.reply(response.data.results[0].url);
		})
		.catch(error => console.log(error))
	},
};

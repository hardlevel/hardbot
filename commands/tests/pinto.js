//const { SlashCommandBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pinto')
		.setDescription('C gosta?!'),
	async execute(interaction) {
		console.log(interaction)
		await interaction.reply('Rola!');
	},
};

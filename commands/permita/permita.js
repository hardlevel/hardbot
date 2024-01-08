const { SlashCommandBuilder, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('permita')
		.setDescription('Fazer aquela pesquisa pra gente preguiçosa')
        .addStringOption(option =>
            option.setName('termo')
                .setDescription('Termo a ser pesquisado')),
	async execute(interaction) {
        //console.log(interaction.options);
        const term = interaction.options.getString('termo');
        const url = 'https://permita.me/?q=' + encodeURIComponent(term);
        const text = 'Ta na mão meu parceiro: ' + url;
		await interaction.reply(text);
	},
};

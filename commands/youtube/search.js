const { SlashCommandBuilder, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');

module.exports = {
    cooldown: 1000,
	data: new SlashCommandBuilder()
		.setName('pesquisa')
		.setDescription('Pesquisar por um video no canal HardLevel')
        .addStringOption(option =>
            option.setName('termo')
                .setDescription('Termo a ser pesquisado em um vídeo no canal HardLevel')),
	async execute(interaction) {
        //console.log(interaction.options);
        const youtube = require('../../functions/youtube');
        const term = interaction.options.getString('termo');
        const videos = await youtube(term)
        //console.log(videos[0].id.videoId)
        // videos.forEach(video => {
            
        // });
        const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Resultado da pesquisa')
            .setURL('https://discord.js.org/')
            .setAuthor({ name: 'HardLevel', iconURL: 'https://hardlevel.com.br/logo.png' , url: 'https://youtube.com/hardlevelbr' })
            .setThumbnail('https://hardlevel.com.br/logo.png')
            .setImage(`https://img.youtube.com/vi/${videos[0].id.videoId}/hqdefault.jpg`)
            .setDescription('Aqui estão alguns vídeos relacionados:')
            .addFields(
                { name: videos[0].snippet.title, value: `https://youtube.com/watch?v=${videos[0].id.videoId}` },
                { name: videos[1].snippet.title, value: `https://youtube.com/watch?v=${videos[1].id.videoId}`, inline: true },
                { name: videos[2].snippet.title, value: `https://youtube.com/watch?v=${videos[2].id.videoId}`, inline: true },
            )
            .setTimestamp()
            .setFooter({ text: 'Confira mais vídeos no canal', iconURL: 'https://hardlevel.com.br/logo.png' });
		await interaction.reply({ embeds: [exampleEmbed] });
	},
};

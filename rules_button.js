const { ButtonInteraction, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageActionRow, MessageButton } = require('discord.js');

const buttonRules = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('primary')
            .setLabel('Click me!')
            .setStyle(ButtonStyle.Primary),
)

module.exports = { buttonRules }
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('submit')
		.setDescription('Envoyer un score pour le challenge en cours.')
        .addStringOption(option => 
            option.setName("jeu")),
	async execute(interaction) {
        // TODO : Add required options, check and send submission
		await interaction.reply('Very fun!');
	},
};

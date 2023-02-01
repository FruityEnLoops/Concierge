const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play jubeat for a while.'),
	async execute(interaction) {
		await interaction.reply('Very fun!');
	},
};

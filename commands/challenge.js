const { SlashCommandBuilder } = require('discord.js');
const { songlist } = require('../meta.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('challenge')
		.setDescription('Voir les informations des challenge en cours.')
        .addStringOption(option => 
            option.setName("jeu")),
	async execute(interaction) {
        // TODO : Parse meta.json for informations and return it
		await interaction.reply('Very fun!');
	},
};

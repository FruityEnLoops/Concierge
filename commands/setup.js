const { SlashCommandBuilder } = require('discord.js');
const { setDefaults } = require('../utils/db.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setup')
		.setDescription(`Configurer les options par défaut pour l'envoi de scores`)
        .addBooleanOption(option =>
            option.setName("alphanef")
            .setDescription("Scores effectués à l'Alphanef")
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("pseudo")
            .setDescription("Pseudo par défaut")
            .setRequired(true)),
	async execute(interaction) {
        setDefaults(
            interaction.options.getBoolean("alphanef") === true ? 1 : 0,
            interaction.options.getString("pseudo"),
            interaction.user.tag.replace("#", "")
        )
		await interaction.reply({ content: 'Options par défaut sauvegardées!', ephemeral: true });
	},
};
const { SlashCommandBuilder } = require('discord.js');
const { gameTypes } = require('../constants/GameType');
const { songlist } = require('../meta.json');
const { getDefaults } = require('../utils/db.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('submit')
		.setDescription('Envoyer un score pour le challenge en cours.')
        .addStringOption(option => 
            option.setName("jeu")
			.setDescription("Jeu")
			.setRequired(true)
			.addChoices(gameTypes[0]).addChoices(gameTypes[1]).addChoices(gameTypes[2]).addChoices(gameTypes[3]).addChoices(gameTypes[4])
		)
		.addStringOption(option =>
			option.setName("song")
			.setDescription("Song")
			.setRequired(true)
			.setAutocomplete(true)
		)
		.addIntegerOption(option =>
			option.setName("score")
			.setDescription("Score")
			.setRequired(true)
		)
		.addAttachmentOption(option =>
			option.setName("image")
			.setDescription("Image du score")
				.setRequired(true)
		)
		.addBooleanOption(option =>
			option.setName("alphanef")
			.setDescription("Score joué à l'Alphanef")
			.setRequired(false)),
	async execute(interaction) {
		let defaults = await getDefaults(interaction.user.tag.replace("#", ""))
		if(!defaults) {
			interaction.reply({ content: "Merci d'utiliser la commande `/setup` pour configurer vos préférences d'envoi par défaut.", ephemeral: true })
			return;
		}
		if(!songlist.find(song => `${song.song} [${song.difficulty}]` === interaction.options.getString("song") &&
			song.gametype === interaction.options.getString("jeu"))) {
			interaction.reply({ content: "La song choisie est introuvable ou ne correspond pas au jeu choisi. Merci de bien vouloir revérifier la commande.", ephemeral: true });
			return;
		}
		if(interaction.options.getBoolean("alphanef") != null) {
			defaults.alphanef = interaction.options.getBoolean("alphanef") ? 1 : 0;
		}
		let score = {
			id: interaction.user.tag.replace("#", ""),
			pseudo: defaults.pseudo,
			song: interaction.options.getString("song"),
			score: interaction.options.getInteger("score"),
			image: interaction.options.getAttachment("image").url,
			alphanef: defaults.alphanef
		};
		await interaction.reply("POST endpoint?game=" + interaction.options.getString("jeu") + "\n```json\n" + JSON.stringify(score) + "\n```");
	},
	async autocomplete(interaction) {
		interaction.respond(
			songlist.filter(
				song => `${song.song} [${song.difficulty}]`.includes(interaction.options.getFocused()) &&
					song.gametype === interaction.options.getString("jeu")
				)
				.map(song => (
					{
						name: `${song.song} [${song.difficulty}]`,
						value: `${song.song} [${song.difficulty}]`
					}
				))
		);
	},
};

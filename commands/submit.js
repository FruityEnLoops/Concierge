const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { gameTypes } = require('../constants/GameType');
const { songlist } = require('../meta.json');
const { getDefaults } = require('../utils/db.js')
const { metaUrl, announceChannel } = require('../config.json');

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
		.addNumberOption(option =>
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
		await interaction.deferReply({ ephemeral: true });
		let defaults = await getDefaults(interaction.user.tag.replace("#", ""))
		if(!defaults) {
			interaction.editReply({ content: "Merci d'utiliser la commande `/setup` pour configurer vos préférences d'envoi par défaut.", ephemeral: true })
			return;
		}
		if(!songlist.find(song => `${song.song} [${song.difficulty}]` === interaction.options.getString("song") &&
			song.gametype === interaction.options.getString("jeu"))) {
			interaction.editReply({ content: "La song choisie est introuvable ou ne correspond pas au jeu choisi. Merci de bien vouloir revérifier la commande.", ephemeral: true });
			return;
		}
		if(interaction.options.getBoolean("alphanef") != null) {
			defaults.alphanef = interaction.options.getBoolean("alphanef") ? 1 : 0;
		}
		let score = {
			id: interaction.user.tag.replace("#", ""),
			pseudo: defaults.pseudo,
			song: interaction.options.getString("song"),
			score: interaction.options.getNumber("score"),
			image: interaction.options.getAttachment("image").url,
			alphanef: defaults.alphanef
		};
		const submission = await fetch(`${metaUrl}?game=${interaction.options.getString("jeu")}`, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(score)
		})
		if(submission.ok) {
			if(score.alphanef === 1) {
				const scoreEmbed = new EmbedBuilder()
					.addFields({
						name: `Module : ${interaction.options.getString("jeu")}`,
						value: `${interaction.user.username} à fait un score de ${interaction.options.getNumber("score")} sur ${interaction.options.getString("song")}.`
					})
				interaction.client.channels.cache.get(announceChannel).send({ embeds: [scoreEmbed] });
			}
			await interaction.editReply({ content: "Envoi du score réussi!", ephemeral: true});
		} else {
			await interaction.editReply({ content: "Envoi du score échoué. Merci de réessayer plus tard!", ephemeral: true});
		}
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

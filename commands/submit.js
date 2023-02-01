const { SlashCommandBuilder } = require('discord.js');
const { gameTypes } = require('../constants/GameType');
const { songlist } = require('../meta.json');

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
		),
	async execute(interaction) {
		let score = {
			id: interaction.user.tag.replace("#", ""),
			pseudo: "TODO",
			song: interaction.options.getString("song"),
			score: interaction.options.getInteger("score"),
			image: interaction.options.getAttachment("image").url,
			alphanef: 0
		};
		await interaction.reply("```json\n" + JSON.stringify(score) + "\n```");
	},
	async autocomplete(interaction) {
		interaction.respond(
			songlist.filter(
				song => song.song.includes(interaction.options.getFocused()) &&
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

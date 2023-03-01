const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder().setName("shuffle").setDescription("Shuffles the queue"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue || queue.previousTracks.length==0) return await interaction.editReply("**There are no songs to shuffle.**")

		queue.shuffle()
		await interaction.editReply({
			embeds: [
				new EmbedBuilder().setDescription(`**The queue of ${queue.tracks.length} songs have been shuffled!**`)
			]
		})
	},
}
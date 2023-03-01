const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder().setName("pause").setDescription("Pauses the music"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue || (queue.previousTracks.length==0 && queue.playing == false)) return await interaction.editReply("**There are no songs in the queue**")

		queue.setPaused(true)
		await interaction.editReply({
			embeds: [
				new EmbedBuilder().setDescription("**Music has been __*PAUSED*__! Use `/resume` to resume the music**")
			]
		})
	},
}
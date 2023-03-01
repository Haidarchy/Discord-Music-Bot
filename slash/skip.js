const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder().setName("skip").setDescription("Skips the current song"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)
		if (!queue || (queue.previousTracks.length==0 && queue.playing == false)) return await interaction.editReply("**There are no songs in the queue**")
		queue.skip()
        await interaction.editReply({
			embeds: [
				new EmbedBuilder().setDescription("**Song has been skipped!**")
			]
		})
	},
}
const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder().setName("skip").setDescription("Skips the current song"),
	run: async ({ client, interaction }) => {
		const queue = client.player.nodes.get(interaction.guildId)
		console.log(queue)
		if (!queue) return await interaction.editReply("**There are no songs in the queue**")
		queue.node.skip()
        await interaction.editReply({
			embeds: [
				new EmbedBuilder().setDescription("**Song has been skipped!**")
			]
		})
	},
}
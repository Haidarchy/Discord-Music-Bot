const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder().setName("resume").setDescription("Resumes the music"),
	run: async ({ client, interaction }) => {
		const queue = client.player.nodes.get(interaction.guildId)

		if (!queue) return await interaction.editReply("**There are no songs in the queue**")

		queue.node.resume()
		await interaction.editReply({
			embeds: [
				new EmbedBuilder().setDescription("**Music has been __*RESUMED*__! Use `/pause` to pause the music**")
			]
		})
	},
}
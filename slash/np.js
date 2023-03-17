const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder().setName("np").setDescription("Displays info about the currently playing song"),
	run: async ({ client, interaction }) => {
		const queue = client.player.nodes.get(interaction.guildId)

		if (!queue) return await interaction.editReply("**There are no songs playing now**")

		try {
			const song = queue.currentTrack
			await interaction.editReply({
			embeds: [new EmbedBuilder()
            .setThumbnail(song.thumbnail)
            .setDescription(`**Currently Playing [${song.title}](${song.url})\n\n**`)
        ],
		})
		} catch (error) {
			await interaction.editReply({
				embeds: [
					new EmbedBuilder().setDescription("**There are no songs playing now**")
				]
			})
		}
		
	},
}
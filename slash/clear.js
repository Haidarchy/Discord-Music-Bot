const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder().setName("clear").setDescription("Clears queue"),
	run: async ({ client, interaction }) => {
        const queue = await client.player.nodes.get(interaction.guildId)
        if (!queue) return await interaction.editReply("**There is no queue to clear**")
		queue.tracks.clear()
        await interaction.editReply({
            embeds: [
                new EmbedBuilder().setDescription(`**Queue has been cleared!**`)
            ]
        })
	},
}
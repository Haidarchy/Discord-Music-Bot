const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { QueryType } = require("discord-player")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("loads songs from youtube")
        .addStringOption((option) => option.setName("url").setDescription("the song's url").setRequired(true)),
    run: async ({ client, interaction }) => {
        if (!interaction.member.voice.channel) return interaction.editReply("**You need to be in a __*Voice Channel*__ to use this command**")

        let queue = undefined

        if (await client.player.getQueue(interaction.guild) == undefined) {
            queue = await client.player.createQueue(interaction.guild, { autoSelfDeaf: true, leaveOnEnd: false, leaveOnEndCooldown: 5, leaveOnStop: true, leaveOnEmpty: false, leaveOnEmptyCooldown: 5, ytdlOptions: { quality: "highestaudio", filter: "audioonly", highWaterMark: 1 << 25 } })
        } else {
            queue = await client.player.getQueue(interaction.guild)
        }

        if (!queue.connection) await queue.connect(interaction.member.voice.channel)

        let embed = new EmbedBuilder()
        let url = interaction.options.getString("url")
        const result = await client.player.search(url, {
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO
        })
        if (result.tracks.length === 0) { return interaction.editReply("**No results**") }

        if (result.playlist != null) {
            const playlist = result.playlist
            await queue.addTracks(result.tracks)
            embed
                .setDescription(`**${result.tracks.length} songs from [${playlist.title}](${playlist.url}) have been added to the Queue**`)
                .setThumbnail(playlist.thumbnail.url)
        } else {
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url}) has been added to the Queue**`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}` })
        }

        if (!queue.playing) await queue.play()
        await interaction.editReply({
            embeds: [embed]
        })
    },
}
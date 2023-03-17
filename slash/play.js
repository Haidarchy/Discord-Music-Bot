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

        let embed = new EmbedBuilder()
        let url = interaction.options.getString("url")
        const result = await client.player.search(url, {
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO
        })
        if (result.tracks.size === 0) { return interaction.editReply("**No results**") }

        if (await client.player.nodes.get(interaction.guildId) == undefined) {
            // queue = await client.player.play(interaction.member.voice.channel, result, {nodeOptions: {metadata: {channel: interaction.channel,client: interaction.guild.members.me,requestedBy: interaction.user,},selfDeaf: true, leaveOnEnd: true, leaveOnEndCooldown: 300000, leaveOnStop: true, leaveOnEmpty: true, leaveOnEmptyCooldown: 300000, ytdlOptions: { quality: "highestaudio", filter: "audioonly", highWaterMark: 1 << 25 }}})
            queue = await client.player.nodes.create(interaction.guild , {nodeOptions: {selfDeaf: true, leaveOnEnd: true, leaveOnEndCooldown: 300000, leaveOnStop: true, leaveOnEmpty: true, leaveOnEmptyCooldown: 300000, ytdlOptions: { quality: "highestaudio", filter: "audioonly", highWaterMark: 1 << 25 }, }})
        } else {
            queue = await client.player.nodes.get(interaction.guildId) // може би BUG
        }

        if (!queue.connection) await queue.connect(interaction.member.voice.channel)

        if (result.playlist != null) {
            const playlist = result.playlist
            await queue.addTrack(result.tracks)
            embed
                .setDescription(`**${result.tracks.size} songs from [${playlist.title}](${playlist.url}) have been added to the Queue**`)
                .setThumbnail(playlist.thumbnail.url)
        } else {
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url}) has been added to the Queue**`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}` })
        }

        if (!queue.isPlaying()) await queue.node.play()
        await interaction.editReply({
            embeds: [embed]
        })
    },
}
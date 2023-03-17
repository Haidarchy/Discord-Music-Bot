const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { QueryType } = require("discord-player")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("loops current song")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("song")
                .setDescription("Loops current song")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("queue")
                .setDescription("Loops whole queue")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("stop")
                .setDescription("Stops all loops")
        ),
    run: async ({ client, interaction }) => {
        if (!interaction.member.voice.channel) return interaction.editReply("**You need to be in a __*Voice Channel*__ to use this command**")

        let queue = undefined

        if (await client.player.nodes.get(interaction.guildId) == undefined) {
            queue = await client.player.nodes.create(interaction.guild , {nodeOptions: {selfDeaf: true, leaveOnEnd: true, leaveOnEndCooldown: 300000, leaveOnStop: true, leaveOnEmpty: true, leaveOnEmptyCooldown: 300000, ytdlOptions: { quality: "highestaudio", filter: "audioonly", highWaterMark: 1 << 25 }, }})
        } else {
            queue = await client.player.nodes.get(interaction.guildId)
        }

        let embed = new EmbedBuilder()
        
        if(interaction.options.getSubcommand() === "stop") {
            queue.setRepeatMode(0); // or 0 instead of RepeatMode.DISABLED
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder().setDescription(`**Loop mode __*DISABLED*__!**`)
                ]
            })
        } else if(interaction.options.getSubcommand() === 'song') {
            queue.setRepeatMode(1); // or 1 instead of RepeatMode.SONG
            try {
                await interaction.editReply({
                embeds: [new EmbedBuilder()
                .setThumbnail(queue.current.thumbnail)
                .setDescription(`**[${queue.current.title}](${queue.current.url}) will now be repeated\n\n Use __/loop stop__ to stop repeating the song**`)
            ],
            })
            } catch (error) {
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder().setDescription("**Current song will be repeated**")
                    ]
                })
            }
        } else if(interaction.options.getSubcommand() === 'queue') {
            queue.setRepeatMode(2); // or 2 instead of RepeatMode.QUEUE
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder().setDescription(`**Loop mode __*QUEUE*__!**`)
                ]
            })
        }

    },
}
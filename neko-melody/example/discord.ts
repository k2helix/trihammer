import NekoMelody, { Player } from "../src";

import {
    NoSubscriberBehavior,
    VoiceConnectionStatus,
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
} from "@discordjs/voice";
import { YtDlpProvider } from "../src/providers";
import { AudioInformation } from "../src/providers/base";
import { Client, IntentsBitField } from "discord.js";

import dotenv from "dotenv";
dotenv.config();

const main = async () => {
    // Discord Client
    const client = new Client({
        intents: [
            IntentsBitField.Flags.Guilds,
            IntentsBitField.Flags.GuildVoiceStates,
        ],
    });
    client.login(process.env.BOT_TOKEN);

    // Wait until the client is ready
    await new Promise((resolve) => {
        client.once("ready", resolve);
    });

    // Get channel
    const guild = client.guilds.cache.get(process.env.GUILD_ID ?? "");
    if (!guild) throw new Error("Guild not found");

    const member = guild.members.cache.get(process.env.MEMBER_ID ?? "");
    if (!member) throw new Error("Member not found");

    if (!member.voice.channel) {
        throw new Error("Member is not connected to a voice channel.");
    }

    console.log("Joining voice channel", member.voice.channel.name);
    // Join voice channel
    const connection = joinVoiceChannel({
        channelId: member.voice.channel.id,
        guildId: guild.id,
        adapterCreator: member.voice.channel.guild.voiceAdapterCreator,
    });

    // Wait until the connection is ready
    await new Promise((resolve) => {
        connection.on(VoiceConnectionStatus.Ready, resolve);
    });

    const videoId = "2gigEGxnsmo";
    const videoId2 = "oM-JneFEdBk";

    // Providers
    const providers = [new YtDlpProvider()];
    const player = NekoMelody.createPlayer(providers);
    const discordPlayer = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause,
        },
    });
    connection.subscribe(discordPlayer);

    player.on("play", (information: AudioInformation) => {
        if (!player.stream) throw new Error("No input stream");
        //playSpeaker(player);

        const resource = createAudioResource(player.stream, {
            //inlineVolume: true,
        });
        discordPlayer.play(resource);
        player.startCurrentStream();

        discordPlayer.on("stateChange", (oldState, newState) => {
            console.log("State change", oldState.status, newState.status);
            if (oldState.status === "playing" && newState.status === "idle") {
                player.endCurrentStream();
            }
        });
    });

    await player.enqueue(`https://www.youtube.com/watch?v=${videoId}`);
    await player.enqueue(`https://www.youtube.com/watch?v=${videoId2}`);
};

main();

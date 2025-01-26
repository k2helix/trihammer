import NekoMelody, { Player } from "../src";

import Speaker from "speaker";
import ffmpeg from "fluent-ffmpeg";
import { YtDlpProvider } from "../src/providers";
import { AudioInformation } from "../src/providers/base";

import dotenv from "dotenv";
dotenv.config();

const main = async () => {
    const videoId = "l6gPxDSNbVk";
    const videoId2 = "oM-JneFEdBk";

    // Providers
    const providers = [new YtDlpProvider()];
    const player = NekoMelody.createPlayer(providers);

    player.on("play", async (information: AudioInformation) => {
        await playSpeaker(player);
        player.startCurrentStream();
    });

    await player.enqueue(`https://www.youtube.com/watch?v=${videoId}`);
    await player.enqueue(`https://www.youtube.com/watch?v=${videoId2}`);

    console.log(player.getQueue());
};

let lastFFmpeg: ffmpeg.FfmpegCommand | null = null;
let lastSpeaker: Speaker | null = null;

const playSpeaker = async (player: Player) => {
    if (!player.stream) {
        console.error("No input stream");
        return;
    }

    // A function that resolves when the speaker is closed and the ffmpeg process is killed
    const closeSpeaker = () => {
        return new Promise<void>((resolve) => {
            if (lastSpeaker) {
                lastSpeaker.on("close", () => {
                    resolve();
                });
                if (lastFFmpeg) lastFFmpeg.kill("SIGKILL");
                lastSpeaker.close(true);
            } else {
                resolve();
            }
        });
    };

    await closeSpeaker();

    // Create the Speaker instance
    const speaker = new Speaker();
    lastSpeaker = speaker;

    // PCM data from stdin gets piped into the speaker
    const ffmpegProcess = ffmpeg()
        .input(player.stream)
        .format("s16le") // Output format (PCM 16-bit little-endian)
        .audioChannels(2)
        .audioFrequency(44100)
        // .on("end", async () => {
        //     await closeSpeaker();
        // })
        // @ts-expect-error - ffmpeg typings are incorrect
        .on("error", (err) => {
            console.error("[FFmpeg] > Error:", err.message);
        });

    speaker.on("unpipe", () => {
        console.log("Speaker ended");
        player.endCurrentStream();
    });

    // Pipe the ffmpeg output to the speaker
    ffmpegProcess.pipe(speaker, { end: true });

    lastFFmpeg = ffmpegProcess;
};

main();

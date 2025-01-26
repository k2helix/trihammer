import YTDlpWrap from "yt-dlp-wrap";
import { AudioInformation, Provider } from "./base";
import { getYouTubeFormats } from "../utils/Request";

export class YtDlpProvider extends Provider {
    public ytDlpWrap = new YTDlpWrap();

    public canPlay(url: string) {
        return this.checkUrl(url);
    }

    private checkUrl(url: string) {
        // https://www.youtube.com/watch?v=
        // https://youtu.be/
        if (
            url.startsWith("https://www.youtube.com/watch?v=") ||
            url.startsWith("https://youtu.be/")
        )
            return true;

        return false;
    }

    public async getInformation(url: string) {
        const getYtDlpWrapInfo = async () => {
            return JSON.parse(
                await this.ytDlpWrap.execPromise([
                    url,
                    "-f",
                    "bestaudio[ext=webm]",
                    //"--extractor-args",
                    //"youtube:player_client=ios",
                    "--dump-json",
                ]),
            );
        };

        const refreshInfoFunction = async () => {
            const ytDlpWrapInfo = await getYtDlpWrapInfo();

            const formats = await getYouTubeFormats(ytDlpWrapInfo.id);
            if (!formats) {
                throw new Error("Failed to parse YouTube formats");
            }

            let bestThumbnail = null;

            type Thumbnail = { url: string; preference: number };
            const sortedThumbnails = ytDlpWrapInfo.thumbnails.sort(
                (a: Thumbnail, b: Thumbnail) => b.preference - a.preference,
            );

            for (let thumbnail of sortedThumbnails) {
                try {
                    const response = await fetch(thumbnail.url);

                    if (response.status === 200) {
                        bestThumbnail = thumbnail.url;
                        break;
                    }
                } catch (error) {}
            }

            return {
                url: ytDlpWrapInfo.url,
                fileSize: ytDlpWrapInfo.filesize,
                duration: ytDlpWrapInfo.duration,
                indexRange: formats[0].indexRange,
                // TODO: Check if this is correct
                bitrate: ytDlpWrapInfo.asr, //bitrate: Math.ceil((ytDlpWrapInfo.tbr || 128) * 1000),
                livestream: ytDlpWrapInfo.is_live,
                refreshInfoFunction,
                metadata: {
                    title: ytDlpWrapInfo.title,
                    thumbnail: bestThumbnail,
                    url: `https://www.youtube.com/watch?v=${ytDlpWrapInfo.id}`,
                },
            } as AudioInformation;
        };

        return await refreshInfoFunction();
    }
}

export interface AudioInformation {
    url: string;
    fileSize: number;
    duration: number;
    indexRange: {
        start: number;
        end: number;
    };
    bitrate: number;
    livestream: boolean;
    metadata: {
        title: string | null;
        thumbnail: string | null;
        url: string;
    };
    refreshInfoFunction: () => Promise<AudioInformation>;
}

export abstract class Provider {
    abstract canPlay(url: string): boolean;
    abstract getInformation(url: string): Promise<AudioInformation>;
}

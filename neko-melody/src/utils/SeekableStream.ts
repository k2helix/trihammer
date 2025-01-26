import { Readable } from "stream";
import { AudioInformation } from "../providers/base";
import { Timer } from "./Timer";
import { WebmSeeker, WebmSeekerState } from "./WebmSeeker";
import { getStream } from "./Request";
import EventEmitter from "events";

const DEBUG_SIMULATE_FAILURE = false;

export class SeekableStream {
    private id: string;
    public information: AudioInformation;
    public readonly referenceUrl: string;

    public stream: WebmSeeker;

    private timer: Timer;
    private ticking: boolean = false;
    private locked: boolean = false;
    private firstTick: boolean = true;
    private destroyed: boolean = false;
    private event: EventEmitter = new EventEmitter();
    private started: boolean = false;

    private bytesReceived: number = 0;
    private bytesRead: number = 0;
    private bytesPerRequestLimit = 1 * 1024 * 1024; // 1 MB per request

    constructor(
        information: AudioInformation,
        referenceUrl: string,
        seekTime: number = 0,
    ) {
        this.id = Math.random().toString(36).substring(8);
        this.information = information;
        this.referenceUrl = referenceUrl;

        this.stream = new WebmSeeker(seekTime, {
            highWaterMark: 5 * 1024 * 1024,
        });

        this.stream.on("data", (chunk: any) => {
            this.bytesRead += chunk.length;
        });

        this.timer = new Timer(() => {
            if (this.ticking) return;
            this.ticking = true;
            this.timer.reset();
            this.tick();
            this.ticking = false;
        }, 2000);

        this.timer.start();
        this.tick(seekTime);
        //if (seekTime !== 0) this.seek();
    }

    public start() {
        this.started = true;
    }

    private async tick(seekTime?: number) {
        if (this.destroyed) {
            console.debug(
                `[${this.id}] > Stream already destroyed, not ticking`,
            );
            this.destroy();
            return;
        }

        this.debugLog();

        if (this.firstTick) {
            this.firstTick = false;
            this.locked = true;

            // Get header
            console.debug(
                `[${this.id}] > Requesting range | 0-${this.information.indexRange.end}`,
            );

            let request = await getStream(this.information.url, {
                headers: {
                    range: `bytes=0-${this.information.indexRange.end}`,
                },
            }).catch((err: Error) => err);

            if (request instanceof Error) {
                console.debug(
                    `[${this.id}] > Request first tick error: ${request.message}`,
                );
                await this.refreshInformation();
                this.timer.reset();
                this.tick();

                this.locked = false;
                return;
            }

            // Simulate failed request 25% of the time
            if (DEBUG_SIMULATE_FAILURE && Math.random() < 0.25) {
                console.debug(`[${this.id}] > Simulating request failure`);
                request.status = 416;
            }

            if (request.status >= 400) {
                console.debug(
                    `[${this.id}] > Request first tick failed with status ${request.status}`,
                );
                await this.refreshInformation();
                this.timer.reset();
                this.tick();

                this.locked = false;
                return;
            }

            if (!request.data) {
                this.timer.reset();
                this.tick();

                this.locked = false;
                return;
            }

            console.debug(`[${this.id}] > Request first tick successful`);

            const incomingStream = request.data;

            incomingStream.on("data", (chunk: any) => {
                this.stream.push(chunk);
                this.bytesReceived += chunk.length;
            });

            incomingStream.pipe(this.stream, { end: false });

            this.stream.once("headComplete", () => {
                console.debug(`[${this.id}] > Header parsed, unpiping...`);
                incomingStream.unpipe(this.stream);
                incomingStream.destroy();
                this.stream.state = WebmSeekerState.READING_DATA;
                this.stream.headerparsed = true;
                this.debugLog();

                if (seekTime !== 0) this.seek();
                this.locked = false;
            });

            // incomingStream.on("end", async () => {
            //     // console.debug(`[${this.id}] > Header received, unlocking`);
            //     //this.locked = false;
            //     //incomingStream.destroy();
            //     //this.debugLog();
            //     //this.locked = false;
            // });

            return;
        }

        if (!this.started) return;

        const isBufferSufficient =
            this.stream.readableLength >= this.bytesPerRequestLimit;

        if (!this.locked) {
            if (
                !isBufferSufficient &&
                this.bytesReceived < this.information.fileSize
            ) {
                this.locked = true;

                const end = Math.min(
                    this.bytesReceived + this.bytesPerRequestLimit,
                    this.information.fileSize,
                );
                const rangeHeader = `bytes=${this.bytesReceived}-${end}`;
                const request = await getStream(this.information.url, {
                    headers: {
                        range: rangeHeader,
                    },
                }).catch((err: Error) => err);

                console.debug(
                    `[${this.id}] > Requesting range | ${rangeHeader}`,
                );

                if (request instanceof Error) {
                    console.debug(
                        `[${this.id}] > Request error: ${request.message}`,
                    );
                    await this.refreshInformation();
                    this.locked = false;
                    this.timer.reset();
                    this.tick();
                    return;
                }

                // Simulate failed request 25% of the time
                if (DEBUG_SIMULATE_FAILURE && Math.random() < 0.25) {
                    console.debug(`[${this.id}] > Simulating request failure`);
                    request.status = 416;
                }

                if (request.status >= 400) {
                    console.debug(
                        `[${this.id}] > Request failed with status ${request.status}`,
                    );
                    await this.refreshInformation();
                    this.locked = false;
                    this.timer.reset();
                    this.tick();
                    return;
                }

                if (!request.data) {
                    this.locked = false;
                    return;
                }

                console.debug(`[${this.id}] > Request successful`);

                const incomingStream = request.data;

                incomingStream.on("data", (chunk: any) => {
                    this.stream.push(chunk);
                    this.bytesReceived += chunk.length;
                });

                incomingStream.once("error", async () => {
                    console.debug(`[${this.id}] > Pipe error, refreshing...`);
                    this.destroy();
                    await this.refreshInformation();
                    this.timer.reset();
                    this.tick();
                });

                incomingStream.on("end", async () => {
                    console.debug(
                        `[${this.id}] > Full chunk received, unlocking`,
                    );
                    this.locked = false;
                    incomingStream.destroy();
                    this.debugLog();
                });
            }
        }

        if (
            !this.locked &&
            this.bytesReceived >= this.information.fileSize &&
            this.stream.readableLength === 0 &&
            this.bytesRead >= this.information.fileSize &&
            this.stream.state === WebmSeekerState.READING_DATA &&
            !this.stream.readableEnded
        ) {
            console.debug(`[${this.id}] > Stream completed`);
            this.stream.push(null);
        }

        // if (
        //     !this.locked &&
        //     this.bytesReceived >= this.information.fileSize &&
        //     this.stream.readableLength === 0 &&
        //     this.bytesRead >= this.information.fileSize &&
        //     this.stream.state === WebmSeekerState.READING_DATA &&
        //     !this.stream.readableFlowing &&
        //     this.stream.readableEnded &&
        // ) {
        //     console.debug(`[${this.id}] > Stream ended`);
        //     //this.destroy();
        //     return;
        // }
    }

    public async seek(): Promise<boolean> {
        const parse = await new Promise(async (resolve, reject) => {
            if (!this.stream.headerparsed) {
                console.debug(`[${this.id}] > Parsing header...`);
                console.debug(
                    `[${this.id}] > Requesting range | 0-${this.information.indexRange.end}`,
                );

                let req = await getStream(this.information.url, {
                    headers: {
                        range: `bytes=0-${this.information.indexRange.end}`,
                    },
                }).catch((err: Error) => err);

                if (req instanceof Error || req.status >= 400) {
                    console.error(`[${this.id}] > Request error: ${req}`);
                    reject(false);
                    return;
                }

                const incomingStream = req.data;
                incomingStream.pipe(this.stream, { end: false });

                this.stream.once("headComplete", () => {
                    console.debug(`[${this.id}] > Header parsed, unpiping...`);
                    incomingStream.unpipe(this.stream);
                    incomingStream.destroy();
                    this.stream.state = WebmSeekerState.READING_DATA;
                    resolve(true);
                });
            }

            resolve(true);
        }).catch((err) => err);

        if (parse instanceof Error || parse === false) {
            await this.refreshInformation();
            this.timer.reset();
            return this.seek();
        }

        // Wait for lock to be released
        while (this.locked) {
            await new Promise((resolve) => setTimeout(resolve, 100));
        }

        this.locked = true;

        const bytes = this.stream.seek(this.information.fileSize);
        if (bytes instanceof Error) {
            console.error(`[${this.id}] > Seek error: ${bytes.message}`);
            // TODO: Handle seek error
            this.destroy();
            return false;
        }

        console.debug(
            `[${this.id}] > Seeking... Byte located at ${bytes} / ${this.information.fileSize}`,
        );

        // Offset the counter
        this.bytesReceived = bytes;
        this.bytesRead = bytes;

        this.stream.seekfound = false;
        this.locked = false;

        // Tick to start fetching data
        this.timer.reset();
        this.tick();

        return true;
    }

    private getCurrentTimestamp() {
        // TODO: Calculate more accurately
        const realBitrate =
            this.information.fileSize / this.information.duration;
        const currentTime = this.bytesRead / realBitrate;
        return currentTime;
    }

    private async refreshInformation() {
        console.debug(`[${this.id}] > Refreshing stream info...`);
        let information = await this.information.refreshInfoFunction();
        this.information = information;
        console.debug(`[${this.id}] > Stream info refreshed`);
    }

    public on(event: string, listener: (...args: any[]) => void) {
        this.event.on(event, listener);
    }

    public removeAllListeners(event: string) {
        this.event.removeAllListeners(event);
    }

    public destroy() {
        if (this.destroyed) return;

        console.debug(`[${this.id}] > Stream destroyed`);
        if (!this.timer.isDestroyed()) this.timer.destroy();
        if (this.stream) {
            this.stream.push(null);
            //this.stream.end();
            this.stream.destroy();
        }

        this.destroyed = true;
        this.event.emit("destroy");
    }

    private debugLog() {
        if (process.env.NODE_ENV === "production") return;
        //        console.debug("Tick");
        const isBufferSufficient =
            this.stream.readableLength >= this.bytesPerRequestLimit;
        console.debug(
            `[${this.id}] > ` +
                `Timestamp: ${this.getCurrentTimestamp().toFixed(1)}s / ${this.information.duration.toFixed(1)}s | ` +
                `Data Received: ${(this.bytesReceived / (1024 * 1024)).toFixed(3)} MB / ${(this.information.fileSize / (1024 * 1024)).toFixed(3)} MB | ` +
                `Data Read: ${(this.bytesRead / (1024 * 1024)).toFixed(3)} MB | ` +
                `Buffer Remaining: ${(this.stream.readableLength / (1024 * 1024)).toFixed(3)} MB | ` +
                `${!false ? `Buffer Sufficient: ${isBufferSufficient} | ` : ``}` +
                `Locked: ${this.locked} | `, // +
            //`Stream URL: ${this.information.url} | `,
            //`Fetch Completed: ${this.fetchCompleted}`,
        );
    }
}

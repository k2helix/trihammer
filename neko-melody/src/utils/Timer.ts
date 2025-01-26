type TimerState = "idle" | "running" | "paused" | "finished" | "destroyed";

export class Timer {
    private callback: () => void | Promise<void>;
    private time: number;
    private intervalId: NodeJS.Timeout | null;
    private startTime: number;
    private remainingTime: number;
    private state: TimerState;

    constructor(callback: () => void | Promise<void>, time: number) {
        this.callback = callback;
        this.time = time;
        this.intervalId = null;
        this.startTime = 0;
        this.remainingTime = time;
        this.state = "idle";
    }

    private clearExistingInterval() {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    private async runCallback() {
        await this.callback();
        if (this.state === "running") {
            this.start();
        }
    }

    start() {
        this.clearExistingInterval();
        this.state = "running";
        this.startTime = Date.now();
        this.intervalId = setTimeout(async () => {
            await this.runCallback();
        }, this.remainingTime);
    }

    pause() {
        if (this.state === "running") {
            this.clearExistingInterval();
            this.remainingTime -= Date.now() - this.startTime;
            this.state = "paused";
        }
    }

    resume() {
        if (this.state === "paused") {
            this.state = "running";
            this.startTime = Date.now();
            this.intervalId = setTimeout(async () => {
                await this.runCallback();
            }, this.remainingTime);
        }
    }

    reset(startImmediately: boolean = true, newTime?: number) {
        this.clearExistingInterval();
        this.time = newTime !== undefined ? newTime : this.time;
        this.remainingTime = this.time;

        this.state = "idle";
        if (startImmediately) {
            this.start();
        }
    }

    destroy() {
        this.clearExistingInterval();
        this.callback = () => {};
        this.state = "destroyed";
    }

    isDestroyed(): boolean {
        return this.state === "destroyed";
    }

    getState(): TimerState {
        return this.state;
    }
}

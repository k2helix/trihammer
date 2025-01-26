import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import playwright, { chromium } from "playwright-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
chromium.use(StealthPlugin());

// 2 hour
const TIMEOUT = 2 * 60 * 60 * 1000;

let isUpdating = false;
let lastUpdate: Date | null = null;
let globalHeaders: Record<string, string> = {};
let globalCookies: string = "";

export async function makeStreamRequest(
    url: string,
    options: AxiosRequestConfig = {},
    body?: any,
): Promise<AxiosResponse> {
    const { headers = {}, method = "GET" } = options;

    if (isUpdating) {
        let timeout = 0;
        while (isUpdating && timeout < 30000) {
            await new Promise((resolve) => setTimeout(resolve, 100));
            timeout += 100;
        }
        if (isUpdating) {
            throw new Error("Failed to update headers and cookies");
        }
    }

    let config: AxiosRequestConfig = {
        url,
        method,
        headers: {
            ...globalHeaders,
            ...headers,
            Cookie: globalCookies,
        },
        data: body,
        responseType: "stream",
    };

    // Override / Add config
    config = Object.assign(config, options);

    try {
        const response = await axios(config);
        return response;
    } catch (err) {
        throw err;
    }
}

export async function getStream(
    url: string,
    options: AxiosRequestConfig = { method: "GET" },
): Promise<AxiosResponse<any, any>> {
    try {
        let response = await makeStreamRequest(url, options);
        const visitedUrls = new Set<string>();

        // Handle redirection and detect redirection loop
        while (
            response.status >= 300 &&
            response.status < 400 &&
            response.headers.location
        ) {
            const redirectUrl = response.headers.location;
            if (visitedUrls.has(redirectUrl)) {
                throw new Error("Redirection loop detected");
            }
            visitedUrls.add(redirectUrl);
            response = await makeStreamRequest(redirectUrl, options);
        }

        return response;
    } catch (error) {
        throw error;
    }
}

export async function getYouTubeFormats(id: string) {
    if (isUpdating) {
        let timeout = 0;
        while (isUpdating && timeout < 30000) {
            await new Promise((resolve) => setTimeout(resolve, 100));
            timeout += 100;
        }
        if (isUpdating) {
            throw new Error("Failed to update headers and cookies");
        }
    }

    let body;
    if (
        (!globalCookies ||
            !globalHeaders ||
            !lastUpdate ||
            lastUpdate < new Date(Date.now() - TIMEOUT)) &&
        !isUpdating
    ) {
        body = await updateHeaderAndCookies(id);
    } else {
        console.debug("Using axios");
        const response = await axios.get(
            `https://www.youtube.com/watch?v=${id}&has_verified=1`,
            {
                headers: {
                    ...globalHeaders,
                    Cookie: globalCookies,
                },
            },
        );

        body = response.data;
    }

    const scriptMatch = body.match(
        /var ytInitialPlayerResponse = (.*?)(?=;\s*<\/script>)/,
    );
    const scriptData = scriptMatch ? scriptMatch[1] : null;
    if (!scriptData) throw new Error("Failed to get YouTube formats");

    const jsonMatch = scriptData.match(/{.*}/);
    const data = jsonMatch ? jsonMatch[0] : null;
    if (!data) throw new Error("Failed to get YouTube formats");

    try {
        let formats = JSON.parse(data).streamingData.adaptiveFormats;
        if (!formats) throw new Error("Failed to parse YouTube formats");

        // Filters only audio formats that are webm
        formats = formats.filter((format: any) =>
            format.mimeType.startsWith("audio/webm;"),
        );

        // Sort the quality of the formats
        formats = formats.sort((a: any, b: any) => {
            const aQuality = a.audioQuality === "AUDIO_QUALITY_MEDIUM" ? 0 : 1;
            const bQuality = b.audioQuality === "AUDIO_QUALITY_MEDIUM" ? 0 : 1;
            return aQuality - bQuality;
        });

        return formats;
    } catch (err) {
        console.error(data, err);
        throw new Error("Failed to parse YouTube formats");
    }
}

async function updateHeaderAndCookies(id: string = "-VKIqrvVOpo") {
    if (isUpdating) {
        return;
    }
    console.debug("[Request] Updating headers and cookies using playwright");
    isUpdating = true;
    try {
        const browser = await chromium.launch({
            headless: true,
        });

        const page = await browser.newPage();

        page.once("request", (request) => {
            globalHeaders = request.headers();
        });

        await page.goto(
            `https://www.youtube.com/watch?v=${id}&has_verified=1`,
            {
                waitUntil: "domcontentloaded",
            },
        );

        const body = await page.evaluate(() => document.body.innerHTML);
        const cookies = await page.context().cookies();

        globalCookies = cookies
            .map((cookie) => `${cookie.name}=${cookie.value}`)
            .join("; ");

        await page.close();
        await browser.close();

        console.debug("[Request] New cookies", globalCookies);
        console.debug("[Request] New headers", globalHeaders);

        lastUpdate = new Date();
        return body;
    } catch (err) {
        console.error(err);
    } finally {
        isUpdating = false;
    }
}

updateHeaderAndCookies();

setInterval(
    () => {
        updateHeaderAndCookies();
    },
    Math.floor(TIMEOUT / 2),
);

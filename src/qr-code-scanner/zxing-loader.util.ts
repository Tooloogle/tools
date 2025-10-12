interface ZXingCodeReader {
    decodeOnceFromVideoDevice: (
        deviceId: string | undefined,
        videoElement: HTMLVideoElement
    ) => Promise<ZXingResult>;
    decodeFromImageElement: (
        imageElement: HTMLImageElement
    ) => Promise<ZXingResult>;
    reset: () => void;
}

interface ZXingResult {
    text: string;
    result?: unknown;
}

interface ZXingLibrary {
    BrowserQRCodeReader: new () => ZXingCodeReader;
}

declare global {
    interface Window {
        ZXing: ZXingLibrary;
    }
}

export type { ZXingCodeReader, ZXingResult, ZXingLibrary };

export class ZXingLoader {
    private static instance: ZXingLoader;
    private static loadingPromise: Promise<ZXingLibrary> | null = null;
    private static loaded = false;

    private static readonly CDN_URL = 'https://unpkg.com/@zxing/library@latest/umd/index.min.js';

    private constructor() {
        // Private constructor for singleton pattern
    }

    public static getInstance(): ZXingLoader {
        if (!ZXingLoader.instance) {
            ZXingLoader.instance = new ZXingLoader();
        }

        return ZXingLoader.instance;
    }

    /**
     * Dynamically loads the ZXing library if not already loaded
     * @returns Promise that resolves to the ZXing library
     */
    public async loadZXing(): Promise<ZXingLibrary> {
        if (ZXingLoader.loaded && window.ZXing) {
            return window.ZXing;
        }

        if (ZXingLoader.loadingPromise) {
            return ZXingLoader.loadingPromise;
        }

        ZXingLoader.loadingPromise = this.loadLibrary();

        try {
            const library = await ZXingLoader.loadingPromise;
            ZXingLoader.loaded = true;
            return library;
        } catch (error) {
            ZXingLoader.loadingPromise = null;
            throw error;
        }
    }

    //Loads the ZXing library from CDN
    private async loadLibrary(): Promise<ZXingLibrary> {
        try {
            await this.loadScript(ZXingLoader.CDN_URL);

            if (window.ZXing && window.ZXing.BrowserQRCodeReader) {
                return window.ZXing;
            }

            throw new Error('ZXing library did not load correctly');

        } catch (error) {
            console.error('Failed to load ZXing:', error);
            throw new Error(`Failed to load ZXing library: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    // Loads a script tag dynamically
    private loadScript(url: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const existingScript = document.querySelector(`script[src="${url}"]`);
            if (existingScript) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = url;
            script.async = true;
            script.crossOrigin = 'anonymous';

            const timeout = setTimeout(() => {
                document.head.removeChild(script);
                reject(new Error(`Timeout loading script from ${url}`));
            }, 10000);

            script.onload = () => {
                clearTimeout(timeout);
                resolve();
            };

            script.onerror = () => {
                clearTimeout(timeout);
                document.head.removeChild(script);
                reject(new Error(`Failed to load script from ${url}`));
            };

            document.head.appendChild(script);
        });
    }

    // Checks if ZXing library is already available
    public isLoaded(): boolean {
        return ZXingLoader.loaded && !!window.ZXing?.BrowserQRCodeReader;
    }

    //Forces a reload of the library
    public async forceReload(): Promise<ZXingLibrary> {
        ZXingLoader.loaded = false;
        ZXingLoader.loadingPromise = null;

        const scripts = document.querySelectorAll('script[src*="zxing"]');
        scripts.forEach(script => script.remove());

        window.ZXing = undefined as unknown as ZXingLibrary;

        return this.loadZXing();
    }

    public getStatus(): 'not-loaded' | 'loading' | 'loaded' | 'error' {
        if (ZXingLoader.loaded && window.ZXing) {
            return 'loaded';
        }

        if (ZXingLoader.loadingPromise) {
            return 'loading';
        }

        return 'not-loaded';
    }
}

// Export singleton instance for convenience
export const zxingLoader = ZXingLoader.getInstance();
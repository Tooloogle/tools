export type OutputFormat = 'image/png' | 'image/jpeg' | 'image/webp';

export const EXT: Record<OutputFormat, string> = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/webp': 'webp',
};

export function readDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            const result = { width: img.naturalWidth, height: img.naturalHeight };
            URL.revokeObjectURL(url);
            resolve(result);
        };

        img.onerror = err => {
            URL.revokeObjectURL(url);
            reject(err instanceof Error ? err : new Error('Image load failed.'));
        };

        img.src = url;
    });
}

export function renderToBlob(
    file: File,
    width: number,
    height: number,
    format: OutputFormat,
    quality: number,
    useQuality: boolean,
): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(url);
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Canvas 2D context unavailable.'));
                return;
            }

            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(blob => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('Could not encode image.'));
                }
            }, format, useQuality ? quality : undefined);
        };

        img.onerror = err => {
            URL.revokeObjectURL(url);
            reject(err instanceof Error ? err : new Error('Image load failed.'));
        };

        img.src = url;
    });
}

export function formatBytes(bytes: number): string {
    if (bytes < 1024) {
        return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

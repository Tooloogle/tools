export type OutputFormat = 'image/jpeg' | 'image/webp';

export const EXT: Record<OutputFormat, string> = {
    'image/jpeg': 'jpg',
    'image/webp': 'webp',
};

export function encode(file: File, format: OutputFormat, quality: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(url);
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Canvas 2D context unavailable.'));
                return;
            }

            ctx.drawImage(img, 0, 0);
            canvas.toBlob(blob => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('Could not encode image.'));
                }
            }, format, quality);
        };

        img.onerror = err => {
            URL.revokeObjectURL(url);
            reject(err instanceof Error ? err : new Error('Image load failed.'));
        };

        img.src = url;
    });
}

export async function searchTargetSize(
    file: File,
    format: OutputFormat,
    targetBytes: number,
): Promise<{ blob: Blob; quality: number }> {
    let lo = 0.1;
    let hi = 1.0;
    let best: { blob: Blob; quality: number } | null = null;
    for (let i = 0; i < 7; i++) {
        const mid = (lo + hi) / 2;
        const blob = await encode(file, format, mid);
        if (blob.size <= targetBytes) {
            best = { blob, quality: mid };
            lo = mid;
        } else {
            hi = mid;
        }
    }

    if (!best) {
        const blob = await encode(file, format, 0.1);
        return { blob, quality: 0.1 };
    }

    return best;
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

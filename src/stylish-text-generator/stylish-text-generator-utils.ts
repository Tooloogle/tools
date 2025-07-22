export interface FontOption {
    name: string;
    category: string;
}

export interface TextSettings {
    text: string;
    fontSize: number;
    fontFamily: string;
    textColor: string;
    backgroundColor: string;
    strokeWidth: number;
    strokeColor: string;
    shadowBlur: number;
    shadowColor: string;
    shadowOffsetX: number;
    shadowOffsetY: number;
    canvasWidth: number;
    canvasHeight: number;
}

export const fontOptions: FontOption[] = [
    // Sans-serif (modern)
    { name: 'Poppins', category: 'sans-serif' },
    { name: 'Montserrat', category: 'sans-serif' },
    { name: 'Open Sans', category: 'sans-serif' },
    { name: 'Roboto', category: 'sans-serif' },
    { name: 'Lato', category: 'sans-serif' },
    { name: 'Raleway', category: 'sans-serif' },
    { name: 'Nunito', category: 'sans-serif' },
    
    // Serif (classic)
    { name: 'Playfair Display', category: 'serif' },
    { name: 'Merriweather', category: 'serif' },
    { name: 'Georgia', category: 'serif' },
    { name: 'Times New Roman', category: 'serif' },
    
    // Display (bold/attention-grabbing)
    { name: 'Impact', category: 'display' },
    { name: 'Oswald', category: 'display' },
    { name: 'Arial Black', category: 'display' },
    
    // Handwriting (casual)
    { name: 'Dancing Script', category: 'handwriting' },
    { name: 'Pacifico', category: 'handwriting' },
    { name: 'Caveat', category: 'handwriting' },
    
    // System fallbacks
    { name: 'Arial', category: 'system' },
    { name: 'Helvetica', category: 'system' },
    { name: 'Verdana', category: 'system' },
    { name: 'Trebuchet MS', category: 'system' }
];

export async function loadWebFonts(): Promise<void> {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&family=Montserrat&family=Roboto&family=Open+Sans&family=Lato&family=Raleway&family=Playfair+Display&family=Merriweather&family=Oswald&family=Nunito&family=Dancing+Script&family=Pacifico&family=Caveat&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
}

export function generateImageOnCanvas(
    canvas: HTMLCanvasElement, 
    ctx: CanvasRenderingContext2D, 
    settings: TextSettings
): void {
    // Set canvas size
    canvas.width = settings.canvasWidth;
    canvas.height = settings.canvasHeight;

    // Clear canvas
    ctx.fillStyle = settings.backgroundColor;
    ctx.fillRect(0, 0, settings.canvasWidth, settings.canvasHeight);

    // Set text properties
    ctx.font = `${settings.fontSize}px ${settings.fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Set shadow
    ctx.shadowBlur = settings.shadowBlur;
    ctx.shadowColor = settings.shadowColor;
    ctx.shadowOffsetX = settings.shadowOffsetX;
    ctx.shadowOffsetY = settings.shadowOffsetY;

    const centerX = settings.canvasWidth / 2;
    const centerY = settings.canvasHeight / 2;

    // Draw stroke if enabled
    if (settings.strokeWidth > 0) {
        ctx.strokeStyle = settings.strokeColor;
        ctx.lineWidth = settings.strokeWidth;
        ctx.strokeText(settings.text, centerX, centerY);
    }

    // Draw fill text
    ctx.fillStyle = settings.textColor;
    ctx.fillText(settings.text, centerX, centerY);

    // Reset shadow for future draws
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
}

export function downloadCanvasImage(canvas: HTMLCanvasElement, filename: string): void {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
}

export function getDefaultSettings(): Omit<TextSettings, 'text'> {
    return {
        fontSize: 72,
        fontFamily: 'Poppins',
        textColor: '#3b82f6',
        backgroundColor: '#ffffff',
        strokeWidth: 2,
        strokeColor: '#1e40af',
        shadowBlur: 5,
        shadowColor: '#9ca3af',
        shadowOffsetX: 3,
        shadowOffsetY: 3,
        canvasWidth: 800,
        canvasHeight: 300
    };
}

export function initializeCanvas(shadowRoot: ShadowRoot | null): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
    const canvas = shadowRoot?.getElementById('textCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Failed to get 2D context from canvas.');
    }
    return { canvas, ctx };
}

export function createEventHandler<T extends HTMLInputElement | HTMLTextAreaElement |HTMLSelectElement >(
    callback: (value: string) => void,
    transform?: (value: string) => string
) {
    return function(e: Event) {
        const target = e.target as T;
        const value = transform ? transform(target.value) : target.value;
        callback(value);
    };
}

export function createRangeHandler(callback: (value: number) => void) {
    return function(e: Event) {
        const target = e.target as HTMLInputElement;
        callback(parseInt(target.value));
    };
}

export function applyDefaultSettings(
    component: Record<string, unknown>,
    generateImageFn: () => void
): void {
    const defaults = getDefaultSettings();
    Object.assign(component, defaults);
    generateImageFn();
}
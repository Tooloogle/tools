export interface UnknownObject {
    [key: string]: any;
}
export type DotType = "dots" | "rounded" | "classy" | "classy-rounded" | "square" | "extra-rounded";
export type CornerDotType = "dot" | "square";
export type CornerSquareType = "dot" | "square" | "extra-rounded";
export type Extension = "svg" | "png" | "jpeg" | "webp";
export type GradientType = "radial" | "linear";
export type DrawType = "canvas" | "svg";
export type Gradient = {
    type: GradientType;
    rotation?: number;
    colorStops: {
        offset: number;
        color: string;
    }[];
};
export interface DotTypes {
    [key: string]: DotType;
}
export interface GradientTypes {
    [key: string]: GradientType;
}
export interface CornerDotTypes {
    [key: string]: CornerDotType;
}
export interface CornerSquareTypes {
    [key: string]: CornerSquareType;
}
export interface DrawTypes {
    [key: string]: DrawType;
}
export type TypeNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40;
export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";
export type Mode = "Numeric" | "Alphanumeric" | "Byte" | "Kanji";
export interface QRCode {
    addData(data: string, mode?: Mode): void;
    make(): void;
    getModuleCount(): number;
    isDark(row: number, col: number): boolean;
    createImgTag(cellSize?: number, margin?: number): string;
    createSvgTag(cellSize?: number, margin?: number): string;
    createSvgTag(opts?: {
        cellSize?: number;
        margin?: number;
        scalable?: boolean;
    }): string;
    createDataURL(cellSize?: number, margin?: number): string;
    createTableTag(cellSize?: number, margin?: number): string;
    createASCII(cellSize?: number, margin?: number): string;
    renderTo2dContext(context: CanvasRenderingContext2D, cellSize?: number): void;
}
export type Options = {
    type?: DrawType;
    width?: number;
    height?: number;
    margin?: number;
    data?: string;
    image?: string;
    qrOptions?: {
        typeNumber?: TypeNumber;
        mode?: Mode;
        errorCorrectionLevel?: ErrorCorrectionLevel;
    };
    imageOptions?: {
        hideBackgroundDots?: boolean;
        imageSize?: number;
        crossOrigin?: string;
        margin?: number;
    };
    dotsOptions?: {
        type?: DotType;
        color?: string;
        gradient?: Gradient;
    };
    cornersSquareOptions?: {
        type?: CornerSquareType;
        color?: string;
        gradient?: Gradient;
    };
    cornersDotOptions?: {
        type?: CornerDotType;
        color?: string;
        gradient?: Gradient;
    };
    backgroundOptions?: {
        color?: string;
        gradient?: Gradient;
    };
};
export type FilterFunction = (i: number, j: number) => boolean;
export type DownloadOptions = {
    name?: string;
    extension?: Extension;
};
export type DrawArgs = {
    x: number;
    y: number;
    size: number;
    rotation?: number;
    getNeighbor?: GetNeighbor;
};
export type BasicFigureDrawArgs = {
    x: number;
    y: number;
    size: number;
    rotation?: number;
};
export type RotateFigureArgs = {
    x: number;
    y: number;
    size: number;
    rotation?: number;
    draw: () => void;
};
export type DrawArgsCanvas = DrawArgs & {
    context: CanvasRenderingContext2D;
};
export type BasicFigureDrawArgsCanvas = BasicFigureDrawArgs & {
    context: CanvasRenderingContext2D;
};
export type RotateFigureArgsCanvas = RotateFigureArgs & {
    context: CanvasRenderingContext2D;
};
export type GetNeighbor = (x: number, y: number) => boolean;
export default _default;
export default _default;
export default _default;
export default _default;
export default _default;
export default qrTypes;
export default _default;
export default _default;
interface RequiredOptions extends Options {
    type: DrawType;
    width: number;
    height: number;
    margin: number;
    data: string;
    qrOptions: {
        typeNumber: TypeNumber;
        mode?: Mode;
        errorCorrectionLevel: ErrorCorrectionLevel;
    };
    imageOptions: {
        hideBackgroundDots: boolean;
        imageSize: number;
        crossOrigin?: string;
        margin: number;
    };
    dotsOptions: {
        type: DotType;
        color: string;
        gradient?: Gradient;
    };
    backgroundOptions: {
        color: string;
        gradient?: Gradient;
    };
}
declare class QRCanvas {
    _canvas: HTMLCanvasElement;
    _options: RequiredOptions;
    _qr?: QRCode;
    _image?: HTMLImageElement;
    constructor(options: RequiredOptions);
    get context(): CanvasRenderingContext2D | null;
    get width(): number;
    get height(): number;
    getCanvas(): HTMLCanvasElement;
    clear(): void;
    drawQR(qr: QRCode): Promise<void>;
    drawBackground(): void;
    drawDots(filter?: FilterFunction): void;
    drawCorners(filter?: FilterFunction): void;
    loadImage(): Promise<void>;
    drawImage({ width, height, count, dotSize }: {
        width: number;
        height: number;
        count: number;
        dotSize: number;
    }): void;
    _createGradient({ context, options, additionalRotation, x, y, size }: {
        context: CanvasRenderingContext2D;
        options: Gradient;
        additionalRotation: number;
        x: number;
        y: number;
        size: number;
    }): CanvasGradient;
}
declare class QRSVG {
    _element: SVGElement;
    _defs: SVGElement;
    _dotsClipPath?: SVGElement;
    _cornersSquareClipPath?: SVGElement;
    _cornersDotClipPath?: SVGElement;
    _options: RequiredOptions;
    _qr?: QRCode;
    _image?: HTMLImageElement;
    constructor(options: RequiredOptions);
    get width(): number;
    get height(): number;
    getElement(): SVGElement;
    clear(): void;
    drawQR(qr: QRCode): Promise<void>;
    drawBackground(): void;
    drawDots(filter?: FilterFunction): void;
    drawCorners(): void;
    loadImage(): Promise<void>;
    drawImage({ width, height, count, dotSize }: {
        width: number;
        height: number;
        count: number;
        dotSize: number;
    }): void;
    _createColor({ options, color, additionalRotation, x, y, height, width, name }: {
        options?: Gradient;
        color?: string;
        additionalRotation: number;
        x: number;
        y: number;
        height: number;
        width: number;
        name: string;
    }): void;
}
export class QRCodeStyling {
    _options: RequiredOptions;
    _container?: HTMLElement;
    _canvas?: QRCanvas;
    _svg?: QRSVG;
    _qr?: QRCode;
    _canvasDrawingPromise?: Promise<void>;
    _svgDrawingPromise?: Promise<void>;
    constructor(options?: Partial<Options>);
    static _clearContainer(container?: HTMLElement): void;
    _getQRStylingElement(extension?: Extension): Promise<QRCanvas | QRSVG>;
    update(options?: Partial<Options>): void;
    append(container?: HTMLElement): void;
    getRawData(extension?: Extension): Promise<Blob | null>;
    download(downloadOptions?: Partial<DownloadOptions> | string): Promise<void>;
}
export default QRCodeStyling;

//# sourceMappingURL=qr-code-styling.d.ts.map

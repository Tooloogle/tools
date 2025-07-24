
export interface OptimizationOptions {
    removeViewBox: boolean;
    removeTitle: boolean;
    removeDesc: boolean;
    removeComments: boolean;
    removeMetadata: boolean;
    removeUselessStrokeAndFill: boolean;
    cleanupIds: boolean;
    minifyStyles: boolean;
    convertStyleToAttrs: boolean;
    removeUnusedNS: boolean;
    cleanupNumericValues: boolean;
    collapseGroups: boolean;
    mergePaths: boolean;
}

export class SvgOptimizerUtils {
    static removeBasicElements(optimized: string, options: OptimizationOptions): string {
        let result = optimized;

        // Remove XML declarations and DOCTYPE if present
        result = result.replace(/<\?xml[^>]*\?>/gi, '');
        result = result.replace(/<!DOCTYPE[^>]*>/gi, '');

        if (options.removeComments) {
            result = result.replace(/<!--[\s\S]*?-->/g, '');
        }

        if (options.removeMetadata) {
            result = result.replace(/<metadata[\s\S]*?<\/metadata>/gi, '');
        }

        if (options.removeTitle) {
            result = result.replace(/<title[\s\S]*?<\/title>/gi, '');
        }

        if (options.removeDesc) {
            result = result.replace(/<desc[\s\S]*?<\/desc>/gi, '');
        }

        if (options.removeViewBox) {
            result = result.replace(/\s*viewBox="[^"]*"/gi, '');
        }

        return result;
    }

    static minifyStyles(optimized: string, options: OptimizationOptions): string {
        if (!options.minifyStyles) return optimized;

        return optimized.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (match, content) => {
            const minified = content
                .replace(/\/\*[\s\S]*?\*\//g, '') // Remove CSS comments
                .replace(/\s*{\s*/g, '{')
                .replace(/\s*}\s*/g, '}')
                .replace(/;\s*/g, ';')
                .replace(/:\s*/g, ':')
                .replace(/,\s*/g, ',')
                .replace(/\s+/g, ' ')
                .trim();
            return match.replace(content, minified);
        });
    }

    static convertStylesToAttributes(optimized: string, options: OptimizationOptions): string {
        if (!options.convertStyleToAttrs) return optimized;

        return optimized.replace(/style="([^"]*)"/gi, (match, styleContent) => {
            const styles = styleContent.split(';').filter((s: string) => s.trim());
            let attrs = '';
            const remainingStyles: string[] = [];

            styles.forEach((style: string) => {
                const [prop, value] = style.split(':').map((s: string) => s.trim());
                if (prop && value) {
                    const attrMap: Record<string, string> = {
                        'fill': `fill="${value}"`,
                        'stroke': `stroke="${value}"`,
                        'stroke-width': `stroke-width="${value}"`,
                        'opacity': `opacity="${value}"`
                    };

                    if (attrMap[prop]) {
                        attrs += ` ${attrMap[prop]}`;
                    } else {
                        remainingStyles.push(style);
                    }
                }
            });

            if (remainingStyles.length > 0) {
                attrs += ` style="${remainingStyles.join(';')}"`;
            }

            return attrs || match;
        });
    }

    static removeUselessAttributes(optimized: string, options: OptimizationOptions): string {
        if (!options.removeUselessStrokeAndFill) return optimized;

        let result = optimized;
        result = result.replace(/\s*stroke-width="0"/gi, '');
        result = result.replace(/\s*fill="black"\s/gi, ' ');
        result = result.replace(/\s*stroke="black"\s/gi, ' ');
        return result;
    }

    static cleanupIds(optimized: string, options: OptimizationOptions): string {
        if (!options.cleanupIds) return optimized;

        let result = optimized;
        const ids = [...result.matchAll(/id="([^"]+)"/gi)];

        ids.forEach(([, id]) => {
            const references = [...result.matchAll(new RegExp(`(#${id}|url\\(#${id}\\))`, 'gi'))];
            if (references.length <= 1) {
                result = result.replace(new RegExp(`\\s*id="${id}"`, 'gi'), '');
            }
        });

        return result;
    }

    static cleanupNumericValues(optimized: string, options: OptimizationOptions): string {
        if (!options.cleanupNumericValues) return optimized;

        return optimized.replace(/(\d+\.\d{3,})/g, (match) => {
            const num = parseFloat(match);
            return num.toFixed(2).replace(/\.?0+$/, '');
        });
    }

    static removeUnusedNamespaces(optimized: string, options: OptimizationOptions): string {
        if (!options.removeUnusedNS) return optimized;

        let result = optimized;
        const namespaces = [...result.matchAll(/xmlns:([^=]+)="[^"]*"/gi)];

        namespaces.forEach(([fullMatch, prefix]) => {
            const isUsed = new RegExp(`${prefix}:`).test(result.replace(fullMatch, ''));
            if (!isUsed) {
                result = result.replace(fullMatch, '');
            }
        });

        return result;
    }

    static collapseEmptyGroups(optimized: string, options: OptimizationOptions): string {
        if (!options.collapseGroups) return optimized;

        return optimized.replace(/<g>([\s\S]*?)<\/g>/gi, '$1');
    }

    static finalCleanup(optimized: string): string {
        let result = optimized;
        result = result.replace(/\s+/g, ' ');
        result = result.replace(/>\s+</g, '><');
        result = result.replace(/\s*([<>])\s*/g, '$1');
        return result.trim();
    }

    static async processOptimization(svgContent: string, options: OptimizationOptions): Promise<string> {
        let optimized = svgContent;

        optimized = this.removeBasicElements(optimized, options);
        optimized = this.minifyStyles(optimized, options);
        optimized = this.convertStylesToAttributes(optimized, options);
        optimized = this.removeUselessAttributes(optimized, options);
        optimized = this.cleanupIds(optimized, options);
        optimized = this.cleanupNumericValues(optimized, options);
        optimized = this.removeUnusedNamespaces(optimized, options);
        optimized = this.collapseEmptyGroups(optimized, options);
        optimized = this.finalCleanup(optimized);

        return optimized;
    }
}

export class FileUtils {
    static formatBytes(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    }

    static calculateSavingsPercentage(originalSize: number, optimizedSize: number): number {
        if (originalSize === 0) return 0;
        return Math.round(((originalSize - optimizedSize) / originalSize) * 100);
    }

    static downloadFile(content: string, filename: string, mimeType = 'text/plain'): void {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    static async copyToClipboard(text: string): Promise<void> {
        try {
            await navigator.clipboard.writeText(text);
        } catch {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
    }

    static validateSvgFile(file: File): { isValid: boolean; error?: string } {
        if (!file.type.includes('svg') && !file.name.endsWith('.svg')) {
            return { isValid: false, error: 'Please select an SVG file.' };
        }

        return { isValid: true };
    }

    static readFileAsText(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => resolve(event.target?.result as string);
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    static validateSvgContent(content: string): { isValid: boolean; error?: string } {
        const trimmed = content.trim();

        if (!trimmed) {
            return { isValid: false, error: 'Please enter SVG content.' };
        }

        if (!trimmed.includes('<svg')) {
            return { isValid: false, error: 'Content does not appear to be valid SVG.' };
        }

        // Basic XML structure check
        if (!trimmed.startsWith('<') || !trimmed.endsWith('>')) {
            return { isValid: false, error: 'Invalid XML/SVG format.' };
        }

        return { isValid: true };
    }
}


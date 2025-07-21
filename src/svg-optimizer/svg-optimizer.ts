import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import svgOptimizerStyles from './svg-optimizer.css.js';

@customElement('svg-optimizer')
export class SvgOptimizer extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, svgOptimizerStyles];
    
    @property({ type: String }) originalSvg = '';
    @property({ type: String }) optimizedSvg = '';
    @property({ type: Number }) originalSize = 0;
    @property({ type: Number }) optimizedSize = 0;
    @property({ type: Boolean }) optimizing = false;
    @property({ type: String }) error = '';
    @property({ type: Object }) optimizationOptions = {
        removeViewBox: false,
        removeTitle: true,
        removeDesc: true,
        removeComments: true,
        removeMetadata: true,
        removeUselessStrokeAndFill: false, 
        cleanupIds: false, 
        minifyStyles: true,
        convertStyleToAttrs: false, 
        removeUnusedNS: true,
        cleanupNumericValues: true,
        collapseGroups: false, 
        mergePaths: false 
    };

    private handleFileUpload(e: Event) {
        const input = e.target as HTMLInputElement;
        const file = input.files?.[0];
        
        if (!file) return;

        if (!file.type.includes('svg') && !file.name.endsWith('.svg')) {
            this.error = 'Please select an SVG file.';
            return;
        }

        this.error = '';
        const reader = new FileReader();
        
        reader.onload = (event) => {
            this.originalSvg = event.target?.result as string;
            this.originalSize = new Blob([this.originalSvg]).size;
            this.optimizedSvg = '';
            this.optimizedSize = 0;
        };
        
        reader.readAsText(file);
    }

    private handleSvgTextInput(e: Event) {
        const textarea = e.target as HTMLTextAreaElement;
        this.originalSvg = textarea.value;
        this.originalSize = new Blob([this.originalSvg]).size;
        this.optimizedSvg = '';
        this.optimizedSize = 0;
        this.error = '';
    }

    private handleOptionChange(e: Event) {
        const input = e.target as HTMLInputElement;
        const option = input.name as keyof typeof this.optimizationOptions;
        this.optimizationOptions = {
            ...this.optimizationOptions,
            [option]: input.checked
        };
    }

    private async optimizeSvg() {
        if (!this.originalSvg.trim()) {
            this.error = 'Please provide an SVG to optimize.';
            return;
        }

        this.optimizing = true;
        this.error = '';

        try {
            // Built-in SVG optimization logic
            let optimized = this.originalSvg;
            
            // Remove XML declarations and DOCTYPE if present
            optimized = optimized.replace(/<\?xml[^>]*\?>/gi, '');
            optimized = optimized.replace(/<!DOCTYPE[^>]*>/gi, '');
            
            if (this.optimizationOptions.removeComments) {
                optimized = optimized.replace(/<!--[\s\S]*?-->/g, '');
            }
            
            if (this.optimizationOptions.removeMetadata) {
                optimized = optimized.replace(/<metadata[\s\S]*?<\/metadata>/gi, '');
            }
            
            if (this.optimizationOptions.removeTitle) {
                optimized = optimized.replace(/<title[\s\S]*?<\/title>/gi, '');
            }
            
            if (this.optimizationOptions.removeDesc) {
                optimized = optimized.replace(/<desc[\s\S]*?<\/desc>/gi, '');
            }
            
            if (this.optimizationOptions.removeViewBox) {
                optimized = optimized.replace(/\s*viewBox="[^"]*"/gi, '');
            }
            
            if (this.optimizationOptions.minifyStyles) {
                // Basic CSS minification in style tags
                optimized = optimized.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (match, content) => {
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
            
            if (this.optimizationOptions.convertStyleToAttrs) {
                // Convert simple style attributes to individual attributes (fixed version)
                optimized = optimized.replace(/style="([^"]*)"/gi, (match, styleContent) => {
                    const styles = styleContent.split(';').filter((s:any) => s.trim());
                    let attrs = '';
                    const remainingStyles: string[] = [];
                    
                    styles.forEach((style:any) => {
                        const [prop, value] = style.split(':').map((s:any) => s.trim());
                        if (prop && value) {
                            switch (prop) {
                                case 'fill':
                                    attrs += ` fill="${value}"`;
                                    break;
                                case 'stroke':
                                    attrs += ` stroke="${value}"`;
                                    break;
                                case 'stroke-width':
                                    attrs += ` stroke-width="${value}"`;
                                    break;
                                case 'opacity':
                                    attrs += ` opacity="${value}"`;
                                    break;
                                default:
                                    // Keep as style if not a common SVG attribute
                                    remainingStyles.push(style);
                                    break;
                            }
                        }
                    });
                    
                    // If there are remaining styles, keep them in a style attribute
                    if (remainingStyles.length > 0) {
                        attrs += ` style="${remainingStyles.join(';')}"`;
                    }
                    
                    return attrs || match;
                });
            }
            
            if (this.optimizationOptions.removeUselessStrokeAndFill) {
                // Only remove stroke-width="0" as it's truly useless
                // Keep stroke="none" and fill="none" as they have semantic meaning
                optimized = optimized.replace(/\s*stroke-width="0"/gi, '');
                
                // Remove redundant default values only in safe cases
                // This is very conservative to avoid breaking colors
                optimized = optimized.replace(/\s*fill="black"\s/gi, ' '); // Only if followed by space
                optimized = optimized.replace(/\s*stroke="black"\s/gi, ' '); // Only if followed by space
            }
            
            if (this.optimizationOptions.cleanupIds) {
                // Find all IDs and check if they're referenced
                const ids = [...optimized.matchAll(/id="([^"]+)"/gi)];
                ids.forEach(([, id]) => {
                    const references = [...optimized.matchAll(new RegExp(`(#${id}|url\\(#${id}\\))`, 'gi'))];
                    // If ID is only used once (in its declaration), remove it
                    if (references.length <= 1) {
                        optimized = optimized.replace(new RegExp(`\\s*id="${id}"`, 'gi'), '');
                    }
                });
            }
            
            if (this.optimizationOptions.cleanupNumericValues) {
                // Round numeric values to reduce precision
                optimized = optimized.replace(/(\d+\.\d{3,})/g, (match) => {
                    const num = parseFloat(match);
                    return num.toFixed(2).replace(/\.?0+$/, '');
                });
            }
            
            if (this.optimizationOptions.removeUnusedNS) {
                // Remove unused namespace declarations (basic implementation)
                const namespaces = [...optimized.matchAll(/xmlns:([^=]+)="[^"]*"/gi)];
                namespaces.forEach(([fullMatch, prefix]) => {
                    const isUsed = new RegExp(`${prefix}:`).test(optimized.replace(fullMatch, ''));
                    if (!isUsed) {
                        optimized = optimized.replace(fullMatch, '');
                    }
                });
            }
            
            if (this.optimizationOptions.collapseGroups) {
                // Only remove groups that have no attributes at all (safer version)
                optimized = optimized.replace(/<g>([\s\S]*?)<\/g>/gi, '$1');
            }
            
            // Final cleanup: remove extra whitespace
            optimized = optimized.replace(/\s+/g, ' ');
            optimized = optimized.replace(/>\s+</g, '><');
            optimized = optimized.replace(/\s*([<>])\s*/g, '$1');
            optimized = optimized.trim();

            this.optimizedSvg = optimized;
            this.optimizedSize = new Blob([this.optimizedSvg]).size;

        } catch (error) {
            console.error('Optimization failed:', error);
            this.error = 'Failed to optimize SVG. Please check if the SVG is valid.';
        } finally {
            this.optimizing = false;
        }
    }

    private downloadOptimized() {
        if (!this.optimizedSvg) return;

        const blob = new Blob([this.optimizedSvg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'optimized.svg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    private async copyOptimized() {
        if (this.optimizedSvg) {
            try {
                await navigator.clipboard.writeText(this.optimizedSvg);
                console.log('Copied to clipboard');
                // You might want to show a success message here
            } catch (err) {
                console.error('Failed to copy:', err);
                // Fallback for older browsers
                const textarea = document.createElement('textarea');
                textarea.value = this.optimizedSvg;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
            }
        }
    }

    private formatBytes(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    private getSavingsPercentage(): number {
        if (this.originalSize === 0) return 0;
        return Math.round(((this.originalSize - this.optimizedSize) / this.originalSize) * 100);
    }

    override render() {
        return html`
            <div class="container">
                <div class="input-section">
                    <label class="upload-label">
                        Upload SVG File
                    </label>
                    <div class="upload-area">
                            <input 
                                type="file" 
                                accept=".svg,image/svg+xml" 
                                class="form-input" 
                                @change="${this.handleFileUpload}"
                            />
                    </div>

                    <div class="text-input-area">
                        <label>Or paste SVG code:</label>
                        <textarea 
                            class="form-input svg-textarea" 
                            placeholder="Paste your SVG code here..."
                            @input="${this.handleSvgTextInput}"
                            .value="${this.originalSvg}"
                        ></textarea>
                    </div>
                </div>

                

                ${this.error ? html`
                    <div class="error-message">
                        ${this.error}
                    </div>
                ` : ''}

                <div class="action-section">
                    <button 
                        class="btn" 
                        @click="${this.optimizeSvg}" 
                        ?disabled="${!this.originalSvg || this.optimizing}"
                    >
                        ${this.optimizing ? 'Optimizing...' : 'Optimize SVG'}
                    </button>
                </div>

                ${this.originalSize > 0 ? html`
                    <div class="stats-section">
                        <div class="stat">
                            <span class="label">Original Size:</span>
                            <span class="value">${this.formatBytes(this.originalSize)}</span>
                        </div>
                        ${this.optimizedSize > 0 ? html`
                            <div class="stat">
                                <span class="label">Optimized Size:</span>
                                <span class="value">${this.formatBytes(this.optimizedSize)}</span>
                            </div>
                            <div class="stat savings">
                                <span class="label">Savings:</span>
                                <span class="value">${this.formatBytes(this.originalSize - this.optimizedSize)} (${this.getSavingsPercentage()}%)</span>
                            </div>
                        ` : ''}
                    </div>
                ` : ''}

                ${this.optimizedSvg ? html`
                    <div class="result-section">
                        <div class="result-actions">
                            <button class="btn" @click="${this.downloadOptimized}">
                                Download Optimized
                            </button>
                            <button class="btn btn-secondary" @click="${this.copyOptimized}">
                                Copy Code
                            </button>
                        </div>

                        <div class="svg-comparison">
                            <div class="svg-preview">
                                <h4>Original</h4>
                                <div class="svg-container" .innerHTML="${this.originalSvg}"></div>
                            </div>
                            <div class="svg-preview">
                                <h4>Optimized</h4>
                                <div class="svg-container" .innerHTML="${this.optimizedSvg}"></div>
                            </div>
                        </div>

                        <div class="code-output">
                            <label>Optimized SVG Code:</label>
                            <textarea 
                                class="form-input svg-textarea" 
                                readonly
                                .value="${this.optimizedSvg}"
                            ></textarea>
                        </div>
                    </div>
                ` : ''}
<div class="options-section">
                    <h3>Optimization Options:</h3>
                    <div class="options-grid">
                        <label>
                            <input type="checkbox" name="removeViewBox" 
                                   ?checked="${this.optimizationOptions.removeViewBox}" 
                                   @change="${this.handleOptionChange}">
                            Remove viewBox
                        </label>
                        <label>
                            <input type="checkbox" name="removeTitle" 
                                   ?checked="${this.optimizationOptions.removeTitle}" 
                                   @change="${this.handleOptionChange}">
                            Remove title elements
                        </label>
                        <label>
                            <input type="checkbox" name="removeDesc" 
                                   ?checked="${this.optimizationOptions.removeDesc}" 
                                   @change="${this.handleOptionChange}">
                            Remove desc elements
                        </label>
                        <label>
                            <input type="checkbox" name="removeComments" 
                                   ?checked="${this.optimizationOptions.removeComments}" 
                                   @change="${this.handleOptionChange}">
                            Remove comments
                        </label>
                        <label>
                            <input type="checkbox" name="removeMetadata" 
                                   ?checked="${this.optimizationOptions.removeMetadata}" 
                                   @change="${this.handleOptionChange}">
                            Remove metadata
                        </label>
                        <label>
                            <input type="checkbox" name="removeUselessStrokeAndFill" 
                                   ?checked="${this.optimizationOptions.removeUselessStrokeAndFill}" 
                                   @change="${this.handleOptionChange}">
                            Remove useless stroke/fill
                        </label>
                        <label>
                            <input type="checkbox" name="cleanupIds" 
                                   ?checked="${this.optimizationOptions.cleanupIds}" 
                                   @change="${this.handleOptionChange}">
                            Cleanup unused IDs
                        </label>
                        <label>
                            <input type="checkbox" name="minifyStyles" 
                                   ?checked="${this.optimizationOptions.minifyStyles}" 
                                   @change="${this.handleOptionChange}">
                            Minify styles
                        </label>
                        <label>
                            <input type="checkbox" name="convertStyleToAttrs" 
                                   ?checked="${this.optimizationOptions.convertStyleToAttrs}" 
                                   @change="${this.handleOptionChange}">
                            Convert styles to attributes
                        </label>
                        <label>
                            <input type="checkbox" name="removeUnusedNS" 
                                   ?checked="${this.optimizationOptions.removeUnusedNS}" 
                                   @change="${this.handleOptionChange}">
                            Remove unused namespaces
                        </label>
                        <label>
                            <input type="checkbox" name="cleanupNumericValues" 
                                   ?checked="${this.optimizationOptions.cleanupNumericValues}" 
                                   @change="${this.handleOptionChange}">
                            Cleanup numeric values
                        </label>
                        <label>
                            <input type="checkbox" name="collapseGroups" 
                                   ?checked="${this.optimizationOptions.collapseGroups}" 
                                   @change="${this.handleOptionChange}">
                            Collapse empty groups
                        </label>
                    </div>
                </div>
                <ul class="note">
                    <li>Optimizes SVG files by removing unnecessary elements and attributes</li>
                    <li>Preserves visual appearance while reducing file size</li>
                    <li>All optimization happens in your browser - no files uploaded</li>
                    <li>Preview both original and optimized versions side by side</li>
                    <li><strong>Conservative defaults:</strong> Color-affecting options are disabled by default</li>
                </ul>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'svg-optimizer': SvgOptimizer;
    }
}
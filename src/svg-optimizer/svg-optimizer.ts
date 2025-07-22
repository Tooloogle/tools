import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import svgOptimizerStyles from './svg-optimizer.css.js';
import { SvgOptimizerUtils, FileUtils, OptimizationOptions } from './svg-optimizer-utils.js';
import { SvgOptimizerTemplates } from './svg-optimizer-templates.js';

@customElement('svg-optimizer')
export class SvgOptimizer extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, svgOptimizerStyles];
    
    @property({ type: String }) originalSvg = '';
    @property({ type: String }) optimizedSvg = '';
    @property({ type: Number }) originalSize = 0;
    @property({ type: Number }) optimizedSize = 0;
    @property({ type: Boolean }) optimizing = false;
    @property({ type: String }) error = '';
    @property({ type: Object }) optimizationOptions: OptimizationOptions = {
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

    const validation = FileUtils.validateSvgFile(file);
    if (!validation.isValid) {
        this.error = validation.error || 'Invalid file';
        return;
    }

    // Don't await here, handle the promise properly
    FileUtils.readFileAsText(file)
        .then(content => {
            this.error = '';
            this.setSvgContent(content);
        })
        .catch(() => {
            this.error = 'Failed to read file';
        });
    }

    private handleSvgTextInput(e: Event) {
        const textarea = e.target as HTMLTextAreaElement;
        this.setSvgContent(textarea.value);
        this.error = '';
    }

    private setSvgContent(content: string) {
        this.originalSvg = content;
        this.originalSize = new Blob([this.originalSvg]).size;
        this.optimizedSvg = '';
        this.optimizedSize = 0;
    }

    private handleOptionChange(e: Event) {
        const input = e.target as HTMLInputElement;
        const option = input.name as keyof OptimizationOptions;
        this.optimizationOptions = {
            ...this.optimizationOptions,
            [option]: input.checked
        };
    }

    private optimizeSvg() {
    if (!this.originalSvg.trim()) {
        this.error = 'Please provide an SVG to optimize.';
        return;
    }

    this.optimizing = true;
    this.error = '';

    // Handle the promise properly instead of making the function async
    SvgOptimizerUtils.processOptimization(this.originalSvg, this.optimizationOptions)
        .then(optimized => {
            this.optimizedSvg = optimized;
            this.optimizedSize = new Blob([this.optimizedSvg]).size;
        })
        .catch(() => {
            this.error = 'Failed to optimize SVG. Please check if the SVG is valid.';
        })
        .finally(() => {
            this.optimizing = false;
        });
    }

    private downloadOptimized() {
        if (!this.optimizedSvg) return;
        FileUtils.downloadFile(this.optimizedSvg, 'optimized.svg', 'image/svg+xml');
    }

    private copyOptimized() {
        if (!this.optimizedSvg) return;
        
        FileUtils.copyToClipboard(this.optimizedSvg)
            .catch(() => {
                console.warn('Failed to copy to clipboard');
            });
    }

    private formatBytes(bytes: number): string {
        return FileUtils.formatBytes(bytes);
    }

    private getSavingsPercentage(): number {
        return FileUtils.calculateSavingsPercentage(this.originalSize, this.optimizedSize);
    }

    override render() {
        return html`
            <div class="container">
                ${SvgOptimizerTemplates.renderUploadSection(
                    this.originalSvg,
                    this.handleFileUpload.bind(this),
                    this.handleSvgTextInput.bind(this)
                )}
                
                ${SvgOptimizerTemplates.renderErrorMessage(this.error)}
                
                ${SvgOptimizerTemplates.renderActionSection(
                    this.originalSvg,
                    this.optimizing,
                    this.optimizeSvg.bind(this)
                )}
                
                ${SvgOptimizerTemplates.renderStatsSection(
                    this.originalSize,
                    this.optimizedSize,
                    this.formatBytes.bind(this),
                    this.getSavingsPercentage.bind(this)
                )}
                
                ${SvgOptimizerTemplates.renderResultSection(
                    this.optimizedSvg,
                    this.originalSvg,
                    this.downloadOptimized.bind(this),
                    this.copyOptimized.bind(this)
                )}
                
                ${SvgOptimizerTemplates.renderOptionsSection(
                    this.optimizationOptions,
                    this.handleOptionChange.bind(this)
                )}
                
                ${SvgOptimizerTemplates.renderNotes()}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'svg-optimizer': SvgOptimizer;
    }
}
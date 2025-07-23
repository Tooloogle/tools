import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import { customElement, property, state } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import stylishTextGeneratorStyles from './stylish-text-generator.css.js';
import {
    fontOptions, loadWebFonts, generateImageOnCanvas, downloadCanvasImage, initializeCanvas, applyDefaultSettings
} from './stylish-text-generator-utils.js';

@customElement('stylish-text-generator')
export class StylishTextGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, stylishTextGeneratorStyles];

    @property() text = "Stylish Text";
    @state() private fontSize = 72;
    @state() private fontFamily = 'Poppins';
    @state() private textColor = '#3b82f6';
    @state() private backgroundColor = '#ffffff';
    @state() private strokeWidth = 2;
    @state() private strokeColor = '#1e40af';
    @state() private shadowBlur = 5;
    @state() private shadowColor = '#9ca3af';
    @state() private shadowOffsetX = 3;
    @state() private shadowOffsetY = 3;
    @state() private canvasWidth = 800;
    @state() private canvasHeight = 300;

    private canvas!: HTMLCanvasElement;
    private ctx!: CanvasRenderingContext2D;

    firstUpdated() {
        const { canvas, ctx } = initializeCanvas(this.shadowRoot);
        this.canvas = canvas;
        this.ctx = ctx;
        this.generateImage();
        void loadWebFonts();
    }

    generateImage() {
        if (!this.canvas || !this.ctx) return;

        const settings = {
            text: this.text,
            fontSize: this.fontSize,
            fontFamily: this.fontFamily,
            textColor: this.textColor,
            backgroundColor: this.backgroundColor,
            strokeWidth: this.strokeWidth,
            strokeColor: this.strokeColor,
            shadowBlur: this.shadowBlur,
            shadowColor: this.shadowColor,
            shadowOffsetX: this.shadowOffsetX,
            shadowOffsetY: this.shadowOffsetY,
            canvasWidth: this.canvasWidth,
            canvasHeight: this.canvasHeight
        };

        generateImageOnCanvas(this.canvas, this.ctx, settings);
    }

    downloadImage() {
        downloadCanvasImage(this.canvas, 'stylish-text.png');
    }

    resetSettings() {
        applyDefaultSettings(this as Record<string, unknown>, () => this.generateImage());
    }

    private onValueChange(e: Event) {
        const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        const key = target.dataset.key as keyof this;

        if (!key) return;

        let value: string | number | boolean;

        if (target.type === 'checkbox') {
            value = (target as HTMLInputElement).checked;
            // Special case for transparent background checkbox
            if (key === 'backgroundColor') {
                this[key] = (value ? 'transparent' : '#ffffff') as never;
                this.generateImage();
                return;
            }
        } else if (target.type === 'range' || target.type === 'number') {
            value = parseInt(target.value);
        } else {
            value = target.value;
        }

        this[key] = value as never;

        // Special handling for font family which needs a delay for webfont loading
        if (key === 'fontFamily') {
            setTimeout(() => this.generateImage(), 100);
        } else {
            this.generateImage();
        }
    }

    private renderTextInputSection() {
        return html`
            <div class="text-input-section">
                <label class="block py-1">
                    <textarea
                        class="form-textarea"
                        autofocus
                        placeholder="Enter your text here..."
                        rows="2"
                        data-key="text"
                        .value=${this.text}
                        @input=${this.onValueChange}></textarea>
                </label>
            </div>
        `;
    }

    private renderPreviewSection() {
        return html`
            <div class="preview-section">
                <div class="canvas-container">
                    <canvas id="textCanvas"></canvas>
                </div>
            </div>
        `;
    }

    private renderActionButtons() {
        return html`
            <div class="btns-container">
                <button class="btn btn-blue" @click=${this.downloadImage}>Download PNG</button>
                <button class="btn btn-red btn-sm" @click=${this.resetSettings}>Reset Settings</button> 
            </div>
        `;
    }

    private renderCanvasControls() {
        return html`
            <div class="control-group">
                <h4>Canvas Size</h4>
                <input type="range" class="range-input" min="300" max="1200" step="50" 
                    data-key="canvasWidth"
                    .value=${this.canvasWidth.toString()} 
                    @input=${this.onValueChange}>
                <div class="value-display">Width: ${this.canvasWidth}px</div>
                <input type="range" class="range-input" min="100" max="800" step="25" 
                    data-key="canvasHeight"
                    .value=${this.canvasHeight.toString()} 
                    @input=${this.onValueChange}>
                <div class="value-display">Height: ${this.canvasHeight}px</div>
            </div>
        `;
    }

    private renderFontControls() {
        const fontOptionsHtml = fontOptions.map(font =>
            html`<option value="${font.name}">${font.name}</option>`
        );

        return html`
            <div class="control-group">
                <h4>Font</h4>
                <select 
                    class="font-select" 
                    data-key="fontFamily"
                    .value=${this.fontFamily} 
                    @change=${this.onValueChange}>
                    ${fontOptionsHtml}
                </select>
                <input type="range" class="range-input" min="12" max="120" 
                    data-key="fontSize"
                    .value=${this.fontSize.toString()} 
                    @input=${this.onValueChange}>
                <div class="value-display">Size: ${this.fontSize}px</div>
            </div>
        `;
    }

    private renderColorControls() {
        const isTransparent = this.backgroundColor === 'transparent';

        return html`
        <div class="control-group">
            <h4>Colors</h4>
            <label>Text Color</label>
            <input type="color" class="color-input" 
                data-key="textColor"
                .value=${this.textColor} 
                @input=${this.onValueChange}>
            
            <div class="background-controls">
                <label>Background</label>
                <input type="color" class="color-input" 
                    data-key="backgroundColor"
                    .value=${isTransparent ? '#ffffff' : this.backgroundColor} 
                    @input=${this.onValueChange}
                    ?disabled=${isTransparent}>
                
                <label class="checkbox-label">
                    <input type="checkbox" 
                        data-key="backgroundColor"
                        .checked=${isTransparent}
                        @change=${this.onValueChange}>
                    Transparent Background
                </label>
            </div>
        </div>
    `;
    }

    private renderStrokeControls() {
        return html`
            <div class="control-group">
                <h4>Stroke</h4>
                <input type="range" class="range-input" min="0" max="10" 
                    data-key="strokeWidth"
                    .value=${this.strokeWidth.toString()} 
                    @input=${this.onValueChange}>
                <div class="value-display">Width: ${this.strokeWidth}px</div>
                <input type="color" class="color-input" 
                    data-key="strokeColor"
                    .value=${this.strokeColor} 
                    @input=${this.onValueChange}>
            </div>
        `;
    }

    private renderShadowControls() {
        return html`
            <div class="control-group">
                <h4>Shadow</h4>
                <input type="range" class="range-input" min="0" max="20" 
                    data-key="shadowBlur"
                    .value=${this.shadowBlur.toString()} 
                    @input=${this.onValueChange}>
                <div class="value-display">Blur: ${this.shadowBlur}px</div>
                <input type="color" class="color-input" 
                    data-key="shadowColor"
                    .value=${this.shadowColor} 
                    @input=${this.onValueChange}>
                <input type="range" class="range-input" min="-20" max="20" 
                    data-key="shadowOffsetX"
                    .value=${this.shadowOffsetX.toString()} 
                    @input=${this.onValueChange}>
                <div class="value-display">X Offset: ${this.shadowOffsetX}px</div>
                <input type="range" class="range-input" min="-20" max="20" 
                    data-key="shadowOffsetY"
                    .value=${this.shadowOffsetY.toString()} 
                    @input=${this.onValueChange}>
                <div class="value-display">Y Offset: ${this.shadowOffsetY}px</div>
            </div>
        `;
    }

    override render() {
        return html`
            <div class="generator-container">
                ${this.renderTextInputSection()}
                ${this.renderPreviewSection()}
                ${this.renderActionButtons()}
                <div class="controls-section">
                    ${this.renderCanvasControls()}
                    ${this.renderFontControls()}
                    ${this.renderStrokeControls()}
                    ${this.renderColorControls()}
                    ${this.renderShadowControls()}
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'stylish-text-generator': StylishTextGenerator;
    }
}
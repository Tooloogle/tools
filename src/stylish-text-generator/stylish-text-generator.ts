import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import { customElement, property, state } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import stylishTextGeneratorStyles from './stylish-text-generator.css.js';
import {  fontOptions, loadWebFonts, generateImageOnCanvas, downloadCanvasImage, initializeCanvas, applyDefaultSettings
} from './stylish-text-generator-utils.js';

@customElement('stylish-text-generator')
export class StylishTextGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [  WebComponentBase.styles, inputStyles, buttonStyles, stylishTextGeneratorStyles  ];

    @property()
    text = "Stylish Text";

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

    private onValueChange(
        property: 'text' | 'fontSize' | 'fontFamily' | 'textColor' | 'backgroundColor' | 'strokeWidth' | 'strokeColor' | 'shadowBlur' | 'shadowColor' | 'shadowOffsetX' | 'shadowOffsetY' | 'canvasWidth' | 'canvasHeight',
        value: string | number
    ) {
        if (property === 'fontFamily') {
            (this)[property] = value as string;
            setTimeout(() => this.generateImage(), 100);
            return;
        }

        this[property] = value as never;
        this.generateImage();
    }

    private onTextInput(e: Event) {
        this.onValueChange('text', (e.target as HTMLTextAreaElement).value);
    }

    private onCanvasWidthInput(e: Event) {
        this.onRangeInput('canvasWidth', e);
    }

    private onCanvasHeightInput(e: Event) {
        this.onRangeInput('canvasHeight', e);
    }

    private onFontSizeInput(e: Event) {
        this.onRangeInput('fontSize', e);
    }

    private onStrokeWidthInput(e: Event) {
        this.onRangeInput('strokeWidth', e);
    }

    private onShadowBlurInput(e: Event) {
        this.onRangeInput('shadowBlur', e);
    }

    private onShadowOffsetXInput(e: Event) {
        this.onRangeInput('shadowOffsetX', e);
    }

    private onShadowOffsetYInput(e: Event) {
        this.onRangeInput('shadowOffsetY', e);
    }

    private onTextColorInput(e: Event) {
        this.onColorInput('textColor', e);
    }

    private onBackgroundColorInput(e: Event) {
        this.onColorInput('backgroundColor', e);
    }

    private onStrokeColorInput(e: Event) {
        this.onColorInput('strokeColor', e);
    }

    private onShadowColorInput(e: Event) {
        this.onColorInput('shadowColor', e);
    }

    private onRangeInput(property: 'canvasWidth' | 'canvasHeight' | 'fontSize' | 'strokeWidth' | 'shadowBlur' | 'shadowOffsetX' | 'shadowOffsetY', e: Event) {
        this.onValueChange(property, parseInt((e.target as HTMLInputElement).value));
    }

    private onColorInput(property: 'textColor' | 'backgroundColor' | 'strokeColor' | 'shadowColor',e: Event) {
        this.onValueChange(property, (e.target as HTMLInputElement).value);
    }

    private onFontFamilyChange(e: Event) {
        this.onValueChange('fontFamily', (e.target as HTMLSelectElement).value);
    }

    private onTransparentBgChange(e: Event) {
        const isChecked = (e.target as HTMLInputElement).checked;
        this.onValueChange('backgroundColor', isChecked ? 'transparent' : '#ffffff');
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
                        .value=${this.text}
                        @input=${this.onTextInput}></textarea>
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
            <div class="btns">
                <button class="btn btn-primary" @click=${this.downloadImage}>Download PNG</button>
                <button class="btn btn-secondary" @click=${this.resetSettings}>Reset Settings</button>
            </div>
        `;
    }

    private renderCanvasControls() {
        return html`
            <div class="control-group">
                <h4>Canvas Size</h4>
                <input type="range" class="range-input" min="300" max="1200" step="50" .value=${this.canvasWidth.toString()} 
                    @input=${this.onCanvasWidthInput}>
                <div class="value-display">Width: ${this.canvasWidth}px</div>
                <input type="range" class="range-input" min="100" max="800" step="25" .value=${this.canvasHeight.toString()} 
                    @input=${this.onCanvasHeightInput}>
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
                <select class="font-select" .value=${this.fontFamily} @change=${this.onFontFamilyChange}>
                    ${fontOptionsHtml}
                </select>
                <input type="range" class="range-input" min="12" max="120" .value=${this.fontSize.toString()} 
                    @input=${this.onFontSizeInput}>
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
            <input type="color" class="color-input" .value=${this.textColor} 
                @input=${this.onTextColorInput}>
            
            <div class="background-controls">
                <label>Background</label>
                <input type="color" class="color-input" .value=${isTransparent ? '#ffffff' : this.backgroundColor} 
                    @input=${this.onBackgroundColorInput}
                    ?disabled=${isTransparent}>
                
                <label class="checkbox-label">
                    <input type="checkbox" 
                        .checked=${isTransparent}
                        @change=${this.onTransparentBgChange}>
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
                <input type="range" class="range-input" min="0" max="10" .value=${this.strokeWidth.toString()} 
                    @input=${this.onStrokeWidthInput}>
                <div class="value-display">Width: ${this.strokeWidth}px</div>
                <input type="color" class="color-input" .value=${this.strokeColor} 
                    @input=${this.onStrokeColorInput}>
            </div>
        `;
    }

    private renderShadowControls() {
        return html`
            <div class="control-group">
                <h4>Shadow</h4>
                <input type="range" class="range-input" min="0" max="20" .value=${this.shadowBlur.toString()} 
                    @input=${this.onShadowBlurInput}>
                <div class="value-display">Blur: ${this.shadowBlur}px</div>
                <input type="color" class="color-input" .value=${this.shadowColor} 
                    @input=${this.onShadowColorInput}>
                <input type="range" class="range-input" min="-20" max="20" .value=${this.shadowOffsetX.toString()} 
                    @input=${this.onShadowOffsetXInput}>
                <div class="value-display">X Offset: ${this.shadowOffsetX}px</div>
                <input type="range" class="range-input" min="-20" max="20" .value=${this.shadowOffsetY.toString()} 
                    @input=${this.onShadowOffsetYInput}>
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
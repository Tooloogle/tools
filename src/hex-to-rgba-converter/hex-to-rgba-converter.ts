import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import inputStyles from '../_styles/input.css.js';
import hexToRgbaConverterStyles from './hex-to-rgba-converter.css.js';

@customElement('hex-to-rgba-converter')
export class HexToRgbaConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, hexToRgbaConverterStyles];

    @property({ type: String }) hexInput = '';
    @property({ type: String }) rgbaInput = '';
    @property({ type: String }) output = '';

    handleHexInputChange(event: Event) {
        const target = event.target as HTMLInputElement;
        this.hexInput = target?.value;
        this.convertHexToRgba();
    }

    handleRgbaInputChange(event: Event) {
        const target = event.target as HTMLInputElement;
        this.rgbaInput = target?.value;
        this.convertRgbaToHex();
    }

    convertHexToRgba() {
        let hex = this.hexInput.replace('#', '');

        // Handle short hex format (#RGB)
        if (hex.length === 3) {
            hex = hex.split('').map(c => c + c).join('');
        }

        // Handle hex format with alpha (#RRGGBBAA)
        if (hex.length === 8) {
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            const a = parseInt(hex.substring(6, 8), 16) / 255; // Convert alpha channel to decimal
            this.output = `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
        } else if (hex.length === 6) {
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            this.output = `rgba(${r}, ${g}, ${b}, 1)`;
        } else {
            this.output = 'Invalid hex input';
        }

        this.rgbaInput = this.output;
    }

    convertRgbaToHex() {
        const rgbaMatch = this.rgbaInput.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(\.\d+)?))?\)/);
        if (!rgbaMatch) {
            this.output = 'Invalid rgba input';
            return;
        }

        const [, r, g, b, a] = rgbaMatch.map(Number);

        // Convert alpha to hexadecimal value
        const alphaHex = Math.round(a * 255).toString(16).padStart(2, '0');

        this.output = `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}${alphaHex.toUpperCase()}`;
        this.hexInput = this.output;
    }

    renderPreviewBox() {
        const style = this.output.startsWith('#') ? `background-color: ${this.output};` : `background-color: ${this.output};`;
        return html`
      <div class="preview-box">
        <div class="color-preview" style="${style}"></div>
      </div>
    `;
    }

    render() {
        return html`
      <div class="container">
        <label for="hexInput">Hex Color:</label>
        <input id="hexInput" type="text" class="form-input" .value="${this.hexInput}" @input="${this.handleHexInputChange}">
      </div>
      <div class="container">
        <label for="rgbaInput">RGBA Color:</label>
        <input id="rgbaInput" type="text" class="form-input" .value="${this.rgbaInput}" @input="${this.handleRgbaInputChange}">
      </div>
      ${this.output && this.renderPreviewBox()}
      <div class="container">
        <label for="output">Output:</label>
        <textarea id="output" class="form-textarea" readonly .value="${this.output}"></textarea>
      </div>
    `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hex-to-rgba-converter': HexToRgbaConverter;
    }
}

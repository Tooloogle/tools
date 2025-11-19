import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import cssMinifierStyles from './css-minifier.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import '../t-copy-button/t-copy-button.js';

@customElement('css-minifier')
export class CssMinifier extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, cssMinifierStyles];

    @property()
    input = '';

    @property()
    output = '';

    @property()
    originalSize = 0;

    @property()
    minifiedSize = 0;

    private handleInputChange(e: Event) {
        this.input = (e.target as HTMLTextAreaElement).value;
        this.originalSize = new Blob([this.input]).size;
    }

    private minify() {
        let css = this.input;
        
        // Remove comments
        css = css.replace(/\/\*[\s\S]*?\*\//g, '');
        
        // Remove whitespace
        css = css.replace(/\s+/g, ' ');
        
        // Remove spaces around special characters
        css = css.replace(/\s*([{}:;,>~+])\s*/g, '$1');
        
        // Remove trailing semicolons
        css = css.replace(/;}/g, '}');
        
        // Remove leading zeros
        css = css.replace(/:0(\.\d+)/g, ':$1');
        
        this.output = css.trim();
        this.minifiedSize = new Blob([this.output]).size;
    }

    private clear() {
        this.input = '';
        this.output = '';
        this.originalSize = 0;
        this.minifiedSize = 0;
    }

    override render() {
        const savedBytes = this.originalSize - this.minifiedSize;
        const savedPercent = this.originalSize > 0 ? ((savedBytes / this.originalSize) * 100).toFixed(2) : 0;

        return html`
            <label class="block py-1">
                <span class="inline-block py-1 font-bold">CSS Input:</span>
                <textarea
                    class="form-textarea font-mono text-sm"
                    placeholder="Paste CSS code here..."
                    rows="12"
                    autofocus
                    .value=${this.input}
                    @input=${this.handleInputChange}
                ></textarea>
            </label>

            <div class="py-2 flex flex-wrap gap-2">
                <button class="btn btn-blue" @click=${this.minify}>Minify CSS</button>
                <button class="btn btn-red" @click=${this.clear}>Clear</button>
            </div>

            ${this.output ? html`
                <div class="py-2">
                    <div class="p-3 bg-green-50 rounded">
                        <p><strong>Original Size:</strong> ${this.originalSize} bytes</p>
                        <p><strong>Minified Size:</strong> ${this.minifiedSize} bytes</p>
                        <p><strong>Saved:</strong> ${savedBytes} bytes (${savedPercent}%)</p>
                    </div>
                </div>

                <label class="block py-1">
                    <span class="inline-block py-1 font-bold">Minified Output:</span>
                    <textarea
                        class="form-textarea font-mono text-sm"
                        rows="8"
                        readonly
                        .value=${this.output}
                    ></textarea>
                    <div class="py-2 text-right">
                        <t-copy-button .isIcon=${false} .text=${this.output}></t-copy-button>
                    </div>
                </label>
            ` : ''}
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'css-minifier': CssMinifier;
    }
}

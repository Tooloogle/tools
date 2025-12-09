import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import javascriptMinifierStyles from './javascript-minifier.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button';
import '../t-button';
import '../t-textarea';

@customElement('javascript-minifier')
export class JavascriptMinifier extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, javascriptMinifierStyles];

    @property()
    input = '';

    @property()
    output = '';

    @property()
    originalSize = 0;

    @property()
    minifiedSize = 0;

    private handleInputChange(e: CustomEvent) {
        this.input = e.detail.value;
        this.originalSize = new Blob([this.input]).size;
    }

    private minify() {
        let js = this.input;
        
        // Remove single-line comments
        js = js.replace(/\/\/.*$/gm, '');
        
        // Remove multi-line comments
        js = js.replace(/\/\*[\s\S]*?\*\//g, '');
        
        // Remove extra whitespace
        js = js.replace(/\s+/g, ' ');
        
        // Remove spaces around operators and punctuation
        js = js.replace(/\s*([{}()[\];,:<>!=+\-*/%&|?])\s*/g, '$1');
        
        // Restore space between keywords and identifiers
        js = js.replace(/\b(return|var|let|const|if|else|for|while|function|class)\b(?=[a-zA-Z_$])/g, '$1 ');
        
        this.output = js.trim();
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
                <span class="inline-block py-1 font-bold">JavaScript Input:</span>
                <t-textarea placeholder="Paste JavaScript code here..." rows="12" class="font-mono text-sm"></t-textarea>
            </label>

            <div class="py-2 flex flex-wrap gap-2">
                <t-button variant="blue" @click=${this.minify}>Minify JavaScript</t-button>
                <t-button variant="red" @click=${this.clear}>Clear</t-button>
            </div>

            <div class="my-2 p-3 bg-yellow-100 text-yellow-800 rounded text-sm">
                <strong>Note:</strong> This is a basic minifier. For production use, consider advanced tools like UglifyJS or Terser.
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
                    <t-textarea rows="8" ?readonly=${true} class="font-mono text-sm"></t-textarea>
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
        'javascript-minifier': JavascriptMinifier;
    }
}

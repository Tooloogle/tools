import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import cssTextShadowGeneratorStyles from './css-text-shadow-generator.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';

@customElement('css-text-shadow-generator')
export class CssTextShadowGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, cssTextShadowGeneratorStyles];

    @property({ type: Number }) offsetX = 2;
    @property({ type: Number }) offsetY = 2;
    @property({ type: Number }) blurRadius = 4;
    @property({ type: String }) color = '#000000';
    @property({ type: String }) outputText = '';

    connectedCallback() {
        super.connectedCallback();
        this.process();
    }

    private process() {
        this.outputText = `text-shadow: ${this.offsetX}px ${this.offsetY}px ${this.blurRadius}px ${this.color};`;
    }

    override render() {
        return html`
            <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block mb-2">Offset X:</label>
                        <input type="number" class="form-input w-full" .value=${String(this.offsetX)}
                            @input=${(e: Event) => { this.offsetX = Number((e.target as HTMLInputElement).value); this.process(); }} />
                    </div>
                    <div>
                        <label class="block mb-2">Offset Y:</label>
                        <input type="number" class="form-input w-full" .value=${String(this.offsetY)}
                            @input=${(e: Event) => { this.offsetY = Number((e.target as HTMLInputElement).value); this.process(); }} />
                    </div>
                    <div>
                        <label class="block mb-2">Blur Radius:</label>
                        <input type="number" min="0" class="form-input w-full" .value=${String(this.blurRadius)}
                            @input=${(e: Event) => { this.blurRadius = Number((e.target as HTMLInputElement).value); this.process(); }} />
                    </div>
                    <div>
                        <label class="block mb-2">Color:</label>
                        <input type="color" class="form-input w-full" .value=${this.color}
                            @input=${(e: Event) => { this.color = (e.target as HTMLInputElement).value; this.process(); }} />
                    </div>
                </div>
                <div>
                    <label class="block mb-2 font-semibold">CSS Output:</label>
                    <textarea class="form-input w-full h-20 font-mono" readonly .value=${this.outputText}></textarea>
                    <t-copy-button .text=${this.outputText}></t-copy-button>
                </div>
                <div>
                    <label class="block mb-2 font-semibold">Preview:</label>
                    <div class="text-4xl font-bold" style="${this.outputText}">Sample Text</div>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'css-text-shadow-generator': CssTextShadowGenerator;
    }
}

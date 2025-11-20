import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import cssBorderRadiusGeneratorStyles from './css-border-radius-generator.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';

@customElement('css-border-radius-generator')
export class CssBorderRadiusGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, cssBorderRadiusGeneratorStyles];

    @property({ type: Number }) topLeft = 0;
    @property({ type: Number }) topRight = 0;
    @property({ type: Number }) bottomRight = 0;
    @property({ type: Number }) bottomLeft = 0;
    @property({ type: String }) outputText = '';

    connectedCallback() {
        super.connectedCallback();
        this.process();
    }

    private process() {
        if (this.topLeft === this.topRight && this.topRight === this.bottomRight && this.bottomRight === this.bottomLeft) {
            this.outputText = `border-radius: ${this.topLeft}px;`;
        } else {
            this.outputText = `border-radius: ${this.topLeft}px ${this.topRight}px ${this.bottomRight}px ${this.bottomLeft}px;`;
        }
    }

    override render() {
        return html`
            <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block mb-2">Top Left:</label>
                        <input type="number" min="0" class="form-input w-full" .value=${String(this.topLeft)}
                            @input=${(e: Event) => { this.topLeft = Number((e.target as HTMLInputElement).value); this.process(); }} />
                    </div>
                    <div>
                        <label class="block mb-2">Top Right:</label>
                        <input type="number" min="0" class="form-input w-full" .value=${String(this.topRight)}
                            @input=${(e: Event) => { this.topRight = Number((e.target as HTMLInputElement).value); this.process(); }} />
                    </div>
                    <div>
                        <label class="block mb-2">Bottom Left:</label>
                        <input type="number" min="0" class="form-input w-full" .value=${String(this.bottomLeft)}
                            @input=${(e: Event) => { this.bottomLeft = Number((e.target as HTMLInputElement).value); this.process(); }} />
                    </div>
                    <div>
                        <label class="block mb-2">Bottom Right:</label>
                        <input type="number" min="0" class="form-input w-full" .value=${String(this.bottomRight)}
                            @input=${(e: Event) => { this.bottomRight = Number((e.target as HTMLInputElement).value); this.process(); }} />
                    </div>
                </div>
                <div>
                    <label class="block mb-2 font-semibold">CSS Output:</label>
                    <textarea class="form-input w-full h-20 font-mono" readonly .value=${this.outputText}></textarea>
                    <t-copy-button .text=${this.outputText}></t-copy-button>
                </div>
                <div>
                    <label class="block mb-2 font-semibold">Preview:</label>
                    <div class="w-32 h-32 bg-blue-500" style="${this.outputText}"></div>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'css-border-radius-generator': CssBorderRadiusGenerator;
    }
}

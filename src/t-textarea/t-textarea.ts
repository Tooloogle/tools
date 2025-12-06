import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import tTextareaStyles from './t-textarea.css.js';
import inputStyles from '../_styles/input.css.js';
import { customElement, property } from 'lit/decorators.js';

@customElement('t-textarea')
export class TTextarea extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, tTextareaStyles];

    @property({ type: String })
    value = '';

    @property({ type: String })
    placeholder = '';

    @property({ type: Number })
    rows = 4;

    @property({ type: Boolean })
    disabled = false;

    private handleInput(e: Event) {
        const target = e.target as HTMLTextAreaElement;
        this.value = target.value;
        this.dispatchEvent(new CustomEvent('t-input', {
            detail: { value: this.value },
            bubbles: true,
            composed: true
        }));
    }

    override render() {
        return html`
            <textarea
                class="form-textarea"
                .value=${this.value}
                placeholder=${this.placeholder}
                rows=${this.rows}
                ?disabled=${this.disabled}
                @input=${this.handleInput}
            ></textarea>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        't-textarea': TTextarea;
    }
}

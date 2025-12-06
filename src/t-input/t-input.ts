import { html, nothing } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import tInputStyles from './t-input.css.js';
import inputStyles from '../_styles/input.css.js';
import { customElement, property } from 'lit/decorators.js';

@customElement('t-input')
export class TInput extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, tInputStyles];

    @property({ type: String })
    type: 'text' | 'number' | 'email' | 'password' | 'date' | 'datetime-local' | 'file' = 'text';

    @property({ type: String })
    value = '';

    @property({ type: String })
    placeholder = '';

    @property({ type: Boolean })
    disabled = false;

    /** File type filter for file inputs (e.g., 'image/*', '.pdf,.doc') */
    @property({ type: String })
    accept = '';

    private handleInput(e: Event) {
        const target = e.target as HTMLInputElement;
        if (this.type === 'file') {
            const files = target.files ?? null;
            this.dispatchEvent(new CustomEvent('t-input', {
                detail: { files },
                bubbles: true,
                composed: true
            }));
        } else {
            this.value = target.value;
            this.dispatchEvent(new CustomEvent('t-input', {
                detail: { value: this.value },
                bubbles: true,
                composed: true
            }));
        }
    }

    override render() {
        return html`
            <input
                class="form-input"
                type=${this.type}
                .value=${this.type !== 'file' ? this.value : ''}
                placeholder=${this.placeholder}
                ?disabled=${this.disabled}
                accept=${this.type === 'file' ? this.accept : nothing}
                @input=${this.handleInput}
            />
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        't-input': TInput;
    }
}

import { html } from 'lit';
import { } from "lit/directives/spread.js";
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import tButtonStyles from './t-button.css.js';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

@customElement('t-button')
export class TButton extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, tButtonStyles];

    @property({ type: String }) type: 'button' | 'submit' | 'reset' = 'button';

    @property({ type: Boolean })
    disabled = false;

    @property({ type: String })
    variant: 'blue' | 'green' | 'red' = 'blue';

    @property({ type: String }) size: 'sm' | 'md' | 'lg' = 'md';

    @property({ type: Boolean }) loading = false;

    private handleClick(e: Event) {
        if (this.disabled) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        // Re-dispatch click event from shadow DOM to host element
        this.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
            composed: true,
            cancelable: true
        }));
    }

    override render() {
        return html`
            <button
                class="btn btn-${this.variant} btn-${this.size}"
                ?disabled=${this.disabled || this.loading}
                @click=${this.handleClick}
            >
                ${when(this.loading, () => html`<span class="spinner"></span>`, () => html`<slot></slot>`)}
            </button>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        't-button': TButton;
    }
}

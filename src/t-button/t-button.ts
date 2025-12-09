import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import tButtonStyles from './t-button.css.js';
import { customElement, property } from 'lit/decorators.js';

@customElement('t-button')
export class TButton extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, tButtonStyles];

    @property({ type: String })
    variant: 'blue' | 'green' | 'red' = 'blue';

    @property({ type: Boolean })
    disabled = false;

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
                class="btn btn-${this.variant}"
                ?disabled=${this.disabled}
                @click=${this.handleClick}
            >
                <slot></slot>
            </button>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        't-button': TButton;
    }
}

import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { inputStyles } from "../_styles/input.css.js"
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';

@customElement('email-validator')
export class EmailValidator extends WebComponentBase<IConfigBase> {
    static override styles = [inputStyles];

    @property()
    isValid = false;

    onChange(e: any) {
        this.isValid = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(e.target?.value);
    }

    override render() {
        return html`
        <div style="display: flex; padding: 0.5rem 0;">
            <input
                name="email"
                autofocus
                placeholder="Enter email to validate"
                @keyup=${this.onChange}
                />
        </div>
        <div>
            <strong>${this.isValid ? "Valid" : "Invalid"}</strong>
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'email-validator': EmailValidator;
    }
}

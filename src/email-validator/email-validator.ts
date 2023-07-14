import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from "../_styles/input.css.js"
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import emailValidatorStyles from './email-validator.css.js';

@customElement('email-validator')
export class EmailValidator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, emailValidatorStyles];

    @property()
    isValid = false;

    onChange(e: any) {
        this.isValid = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(e.target?.value);
    }

    override render() {
        return html`
        <lable class="block">
            <span class="inline-block py-1">Email id</span>
            <input
                name="email"
                class="form-input"
                autofocus
                placeholder="Enter email to validate"
                @keyup=${this.onChange}
                />
        </lable>
        <div class="py-2">
            <strong>${this.isValid ? "Valid" : "Invalid"}</strong>
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'email-validator': EmailValidator;
    }
}

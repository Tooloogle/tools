import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from "../_styles/input.css.js"
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import emailValidatorStyles from './email-validator.css.js';
import { when } from 'lit/directives/when.js';

@customElement('email-validator')
export class EmailValidator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, emailValidatorStyles];

    @property()
    value = "";

    @property()
    isValid = false;

    private onChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.value = target.value;
    this.isValid = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(this.value);
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
                .value=${this.value}
                @keyup=${this.onChange}
                />
        </lable>
        <div class="py-2">
            ${when(this.value, () => html`
                <strong>${this.isValid ? "Valid" : "Invalid"}</strong>
            `)}
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'email-validator': EmailValidator;
    }
}

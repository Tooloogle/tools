import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import emailValidatorStyles from './email-validator.css.js';
import { when } from 'lit/directives/when.js';
import '../t-input/t-input.js';

@customElement('email-validator')
export class EmailValidator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, emailValidatorStyles];

    @property()
    value = "";

    @property()
    isValid = false;

    private onChange(e: Event) {
        const target = e.target as HTMLInputElement;
        this.value = target?.value;
        this.isValid = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(this.value);
    }

    override render() {
        return html`
        <lable class="block">
            <span class="inline-block py-1">Email id</span>
            <t-input placeholder="Enter email to validate" .value=${this.value} @t-input=${this.onChange}></t-input>
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

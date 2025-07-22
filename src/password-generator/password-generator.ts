import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from "../_styles/input.css.js"
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import buttonStyles from '../_styles/button.css.js';
import passwordGeneratorStyles from './password-generator.css.js';
import { when } from 'lit/directives/when.js';
import "../t-copy-button/t-copy-button.js";

const passwordChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

@customElement('password-generator')
export class PasswordGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, passwordGeneratorStyles];

    @property()
    length = 10;

    @property()
    password = "";

    generate() {
        this.password = Array(Number(this.length)).fill(passwordChars).map((x) => { return x[(Math.floor(Math.random() * passwordChars.length))] }).join('');
    }

    private handleLengthChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.length = Number(target.value);
    }

    private renderPasswordWithCopyButton() {
    return html`
        <strong class="break-all">${this.password}</strong>
        <t-copy-button .text=${this.password}></t-copy-button>
        `;
    }

    override render() {
        return html`
        <label class="block">
            <span class="inline-block py-1">Password length</span>
            <input
                name="email"
                class="form-input text-end"
                type="number"
                max="100"
                autofocus
                .value=${this.length}
                @keyup=${this.handleLengthChange}
                />
        </label>
        <div class="py-2 flex content-center">
            ${when(this.password, this.renderPasswordWithCopyButton)}
        </div>
        <div class="text-end">
            <button class="btn btn-blue" @click=${this.generate}>Generate Strong Password</button>
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'password-generator': PasswordGenerator;
    }
}

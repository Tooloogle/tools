import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import passwordGeneratorStyles from './password-generator.css.js';
import { when } from 'lit/directives/when.js';
import '../t-copy-button/index.js';

const passwordChars =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*_+-=';

/** Cryptographically secure random index in range [0, max). */
function secureRandomIndex(max: number): number {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % max;
}

@customElement('password-generator')
export class PasswordGenerator extends WebComponentBase {
  static override styles = [
    WebComponentBase.styles,
    passwordGeneratorStyles];

  @property()
  length = 10;

  @property()
  password = '';

  generate() {
    this.password = Array(Number(this.length))
      .fill(passwordChars)
      .map(x => {
        return x[secureRandomIndex(passwordChars.length)];
      })
      .join('');
  }

  private handleLengthChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.length = Number(target?.value);
  }

  private renderPasswordWithCopyButton = () => {
    return html`
      <strong class="break-all">${this.password}</strong>
      <t-copy-button .text=${this.password}></t-copy-button>
    `;
  };

  override render() {
    return html` <label class="block">
        <span class="inline-block py-1">Password length</span>
        <input
          name="length"
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
        <button class="btn btn-blue" @click=${this.generate}>
          Generate Strong Password
        </button>
      </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'password-generator': PasswordGenerator;
  }
}

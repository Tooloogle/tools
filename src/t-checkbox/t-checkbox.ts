import { html, nothing } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import tCheckboxStyles from './t-checkbox.css.js';
import { customElement, property } from 'lit/decorators.js';

@customElement('t-checkbox')
export class TCheckbox extends WebComponentBase<IConfigBase> {
  static override styles = [WebComponentBase.styles, tCheckboxStyles];

  @property({ type: Boolean })
  checked = false;

  @property({ type: String })
  label = '';

  @property({ type: String })
  name = '';

  @property({ type: String })
  id = '';

  @property({ type: Boolean })
  disabled = false;

  @property({ type: Boolean })
  required = false;

  private handleChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.checked = target.checked;
    this.dispatchEvent(
      new CustomEvent('t-change', {
        detail: { checked: this.checked },
        bubbles: true,
        composed: true,
      })
    );
  }

  override render() {
    return html`
      <label class="checkbox-wrapper">
        <input
          type="checkbox"
          .checked=${this.checked}
          name=${this.name || nothing}
          id=${this.id || nothing}
          ?disabled=${this.disabled}
          ?required=${this.required}
          @change=${this.handleChange}
        />
        ${this.label ? html`<span>${this.label}</span>` : ''}
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    't-checkbox': TCheckbox;
  }
}

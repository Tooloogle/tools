import { html, nothing } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import tSelectStyles from './t-select.css.js';
import { customElement, property } from 'lit/decorators.js';

@customElement('t-select')
export class TSelect extends WebComponentBase<IConfigBase> {
  static override styles = [WebComponentBase.styles, tSelectStyles];

  @property({ type: String })
  value = '';

  @property({ type: String })
  name = '';

  @property({ type: String })
  id = '';

  @property({ type: Boolean })
  disabled = false;

  @property({ type: Boolean })
  required = false;

  private handleChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    this.value = target.value;
    this.dispatchEvent(
      new CustomEvent('t-change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  override render() {
    return html`
      <select
        .value=${this.value}
        name=${this.name || nothing}
        id=${this.id || nothing}
        ?disabled=${this.disabled}
        ?required=${this.required}
        @change=${this.handleChange}
      >
        <slot></slot>
      </select>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    't-select': TSelect;
  }
}

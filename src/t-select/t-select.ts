import { html, nothing } from "lit";
import { repeat } from "lit/directives/repeat.js";
import {
  IConfigBase,
  WebComponentBase,
} from "../_web-component/WebComponentBase.js";
import tSelectStyles from "./t-select.css.js";
import { customElement, property } from "lit/decorators.js";

export interface SelectOption {
  value: string;
  label: string;
}

@customElement("t-select")
export class TSelect extends WebComponentBase<IConfigBase> {
  static override styles = [WebComponentBase.styles, tSelectStyles];

  @property({ type: String })
  value = "";

  @property({ type: Array })
  options: SelectOption[] = [];

  @property({ type: String })
  placeholder = "";

  @property({ type: Boolean })
  disabled = false;

  @property({ type: String })
  name = "";

  @property({ type: Boolean })
  required = false;

  private handleChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    this.value = target.value;

    this.dispatchEvent(
      new CustomEvent("t-change", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  override render() {
    return html`
      <select
        class="form-select"
        .value=${this.value}
        ?disabled=${this.disabled}
        ?required=${this.required}
        name=${this.name || nothing}
        @change=${this.handleChange}
      >
        ${this.placeholder
          ? html`<option value="" disabled ?selected=${!this.value}>
              ${this.placeholder}
            </option>`
          : nothing}
        ${repeat(
          this.options,
          option => option.value,
          option => html`
            <option
              value=${option.value}
              ?selected=${this.value === option.value}
            >
              ${option.label}
            </option>
          `
        )}
      </select>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "t-select": TSelect;
  }
}

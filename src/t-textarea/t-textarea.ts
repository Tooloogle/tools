import { html } from "lit";
import {
  IConfigBase,
  WebComponentBase,
} from "../_web-component/WebComponentBase.js";
import tTextareaStyles from "./t-textarea.css.js";
import { customElement, property } from "lit/decorators.js";

@customElement("t-textarea")
export class TTextarea extends WebComponentBase<IConfigBase> {
  static override styles = [WebComponentBase.styles, tTextareaStyles];

  @property({ type: String }) value = "";
  @property({ type: String }) placeholder = "";
  @property({ type: Number }) rows = 4;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) readonly = false;

  private handleInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
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
      <textarea
        .value=${this.value}
        placeholder=${this.placeholder}
        rows=${this.rows}
        ?disabled=${this.disabled}
        ?readonly=${this.readonly}
        @input=${this.handleInput}
      ></textarea>
    `;
  }
}

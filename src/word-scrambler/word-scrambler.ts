import { html } from "lit";
import {
  IConfigBase,
  WebComponentBase,
} from "../_web-component/WebComponentBase.js";
import wordScramblerStyles from "./word-scrambler.css.js";
import { customElement, property } from "lit/decorators.js";
import "../t-copy-button";
import '../t-textarea';

@customElement("word-scrambler")
export class WordScrambler extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    wordScramblerStyles];

  @property({ type: String }) inputText = "";
  @property({ type: String }) outputText = "";

  private handleInput(e: CustomEvent) {
    this.inputText = e.detail.value;
    this.convert();
  }

  private convert() {
    this.outputText = this.inputText
      .split(" ")
      .map(word => {
        const arr = word.split("");
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }

        return arr.join("");
      })
      .join(" ");
  }

  override render() {
    return html`
      <div class="space-y-4">
        <div>
          <label class="block mb-2 font-semibold">Input Text:</label>
          <t-textarea placeholder="Enter text to scramble words..." class="w-full h-32"></t-textarea>
        </div>
        <div>
          <label class="block mb-2 font-semibold">Scrambled Output:</label>
          <t-textarea ?readonly=${true} class="w-full h-32"></t-textarea>
          ${this.outputText
            ? html`<t-copy-button .text=${this.outputText}></t-copy-button>`
            : ""}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "word-scrambler": WordScrambler;
  }
}

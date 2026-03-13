import { html } from "lit";
import { WebComponentBase } from "../_web-component/WebComponentBase.js";
import stringSimilarityCheckerStyles from "./string-similarity-checker.css.js";
import { customElement, property } from "lit/decorators.js";
import '../t-copy-button/index.js';

@customElement("string-similarity-checker")
export class StringSimilarityChecker extends WebComponentBase {
  static override styles = [
    WebComponentBase.styles,    stringSimilarityCheckerStyles];

  @property({ type: String }) inputText = "";
  @property({ type: String }) outputText = "";

  private handleInput(e: Event) {
    this.inputText = (e.target as HTMLTextAreaElement).value;
    this.convert();
  }

  private convert() {
    const lines = this.inputText.split("\n");
    if (lines.length >= 2) {
      const similarity = lines[0] === lines[1] ? "100%" : "0%";
      this.outputText = `Similarity: ${similarity}`;
    } else {
      this.outputText = "Enter two lines to compare";
    }
  }

  override render() {
    return html`
      <div class="space-y-4">
        <div>
          <label class="block mb-2 font-semibold"
            >Input Text (separate lines for comparison):</label
          >
          <textarea
            class="form-textarea w-full h-32"
            placeholder="Enter two texts on separate lines..."
            .value=${this.inputText}
            @input=${this.handleInput}
          ></textarea>
        </div>
        <div>
          <label class="block mb-2 font-semibold">Similarity Result:</label>
          <textarea
            class="form-textarea w-full h-32"
            readonly
            .value=${this.outputText}
          ></textarea>
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
    "string-similarity-checker": StringSimilarityChecker;
  }
}

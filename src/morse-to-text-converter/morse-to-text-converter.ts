import { html } from "lit";
import {
  IConfigBase,
  WebComponentBase,
} from "../_web-component/WebComponentBase.js";
import morseToTextConverterStyles from "./morse-to-text-converter.css.js";
import { customElement, property } from "lit/decorators.js";
import "../t-copy-button";

const MORSE_TO_TEXT: { [key: string]: string } = {
  ".-": "A",
  "-...": "B",
  "-.-.": "C",
  "-..": "D",
  ".": "E",
  "..-.": "F",
  "--.": "G",
  "....": "H",
  "..": "I",
  ".---": "J",
  "-.-": "K",
  ".-..": "L",
  "--": "M",
  "-.": "N",
  "---": "O",
  ".--.": "P",
  "--.-": "Q",
  ".-.": "R",
  "...": "S",
  "-": "T",
  "..-": "U",
  "...-": "V",
  ".--": "W",
  "-..-": "X",
  "-.--": "Y",
  "--..": "Z",
  "-----": "0",
  ".----": "1",
  "..---": "2",
  "...--": "3",
  "....-": "4",
  ".....": "5",
  "-....": "6",
  "--...": "7",
  "---..": "8",
  "----.": "9",
  "/": " ",
};

@customElement("morse-to-text-converter")
export class MorseToTextConverter extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    morseToTextConverterStyles];

  @property({ type: String }) inputMorse = "";
  @property({ type: String }) outputText = "";

  private handleInput(e: CustomEvent) {
    this.inputMorse = e.detail.value;
    this.outputText = this.morseToText(this.inputMorse);
  }

  private morseToText(morse: string): string {
    return morse
      .split(" ")
      .map(code => MORSE_TO_TEXT[code] || code)
      .join("");
  }

  override render() {
    return html`
      <div class="space-y-4">
        <div>
          <label class="block mb-2 font-semibold">Morse Code Input:</label>
          <t-textarea placeholder="Enter Morse code (e.g., .... . .-.. .-.. ---)..." class="w-full h-32 font-mono text-lg"></t-textarea>
        </div>
        <div>
          <label class="block mb-2 font-semibold">Text Output:</label>
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
    "morse-to-text-converter": MorseToTextConverter;
  }
}

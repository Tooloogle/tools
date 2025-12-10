import { html } from "lit";
import {
  IConfigBase,
  WebComponentBase,
} from "../_web-component/WebComponentBase.js";
import textToMorseConverterStyles from "./text-to-morse-converter.css.js";
import { customElement, property } from "lit/decorators.js";
import "../t-copy-button";
import '../t-textarea';

const MORSE_CODE: { [key: string]: string } = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
  "0": "-----",
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----.",
  " ": "/",
};

@customElement("text-to-morse-converter")
export class TextToMorseConverter extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    textToMorseConverterStyles];

  @property({ type: String }) inputText = "";
  @property({ type: String }) outputMorse = "";

  private handleInput(e: CustomEvent) {
    this.inputText = e.detail.value;
    this.outputMorse = this.textToMorse(this.inputText);
  }

  private textToMorse(text: string): string {
    return text
      .toUpperCase()
      .split("")
      .map(char => MORSE_CODE[char] || char)
      .join(" ");
  }

  override render() {
    return html`
      <div class="space-y-4">
        <div>
          <label class="block mb-2 font-semibold">Input Text:</label>
          <t-textarea placeholder="Enter text to convert to Morse code..." class="w-full h-32"></t-textarea>
        </div>
        <div>
          <label class="block mb-2 font-semibold">Morse Code Output:</label>
          <t-textarea ?readonly=${true} class="w-full h-32 font-mono text-lg"></t-textarea>
          ${this.outputMorse
            ? html`<t-copy-button .text=${this.outputMorse}></t-copy-button>`
            : ""}
        </div>
      </div>
    `;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "text-to-morse-converter": TextToMorseConverter;
  }
}

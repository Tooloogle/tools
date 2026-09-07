import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import camelCaseConverterStyles from './camel-case-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button/index.js';

@customElement('camel-case-converter')
export class CamelCaseConverter extends WebComponentBase {
  static override styles = [
    WebComponentBase.styles,
    camelCaseConverterStyles];

  @property({ type: String }) inputText = '';
  @property({ type: String }) outputText = '';

  private handleInput(e: Event) {
    this.inputText = (e.target as HTMLTextAreaElement).value;
    this.convert();
  }

  private convert() {
    const words = this.inputText
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
      .split(/[^a-zA-Z0-9]+/)
      .filter(Boolean);

    this.outputText = words
      .map((word, i) => {
        const lower = word.toLowerCase();
        if (i === 0) {
          return lower;
        }

        return lower.charAt(0).toUpperCase() + lower.slice(1);
      })
      .join('');
  }

  override render() {
    return html`
      <div class="space-y-4">
        <div>
          <label class="block mb-2 font-semibold">Input Text:</label>
          <textarea
            class="form-textarea w-full h-32"
            placeholder="Enter text to convert..."
            .value=${this.inputText}
            @input=${this.handleInput}
          ></textarea>
        </div>
        <div>
          <label class="block mb-2 font-semibold">camelCase Output:</label>
          <textarea
            class="form-textarea w-full h-32"
            readonly
            .value=${this.outputText}
          ></textarea>
          <div class="py-2 text-right">
            <t-copy-button
              .text=${this.outputText}
              .isIcon=${false}
              .disabled=${!this.outputText}
            ></t-copy-button>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'camel-case-converter': CamelCaseConverter;
  }
}

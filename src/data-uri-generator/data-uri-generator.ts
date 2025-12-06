import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import dataUriGeneratorStyles from './data-uri-generator.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import '../t-copy-button';

@customElement('data-uri-generator')
export class DataUriGenerator extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    inputStyles,
    dataUriGeneratorStyles,
  ];

  @property({ type: String }) inputText = '';
  @property({ type: String }) outputText = '';
  @property({ type: String }) mimeType = 'text/plain';
  @property({ type: Boolean }) useBase64 = true;

  private handleInput(e: Event) {
    this.inputText = (e.target as HTMLTextAreaElement).value;
    this.process();
  }

  private handleMimeTypeChange(e: Event) {
    this.mimeType = (e.target as HTMLSelectElement).value;
    this.process();
  }

  private handleBase64Change(e: Event) {
    this.useBase64 = (e.target as HTMLInputElement).checked;
    this.process();
  }

  private process() {
    if (!this.inputText) {
      this.outputText = '';
      return;
    }

    try {
      if (this.useBase64) {
        const base64Data = btoa(unescape(encodeURIComponent(this.inputText)));
        this.outputText = `data:${this.mimeType};base64,${base64Data}`;
      } else {
        const encodedData = encodeURIComponent(this.inputText);
        this.outputText = `data:${this.mimeType},${encodedData}`;
      }
    } catch (err) {
      this.outputText =
        'Error: Unable to encode text. Please check your input.';
      console.error(err);
    }
  }

  override render() {
    return html`
      <div class="space-y-4">
        <div>
          <label class="block mb-2 font-semibold">MIME Type:</label>
          <select
            class="form-select w-full"
            .value=${this.mimeType}
            @change=${this.handleMimeTypeChange}
          >
            <option value="text/plain">text/plain</option>
            <option value="text/html">text/html</option>
            <option value="text/css">text/css</option>
            <option value="text/javascript">text/javascript</option>
            <option value="application/json">application/json</option>
            <option value="application/xml">application/xml</option>
            <option value="image/svg+xml">image/svg+xml</option>
          </select>
        </div>
        <div>
          <label class="block mb-2">
            <input
              type="checkbox"
              .checked=${this.useBase64}
              @change=${this.handleBase64Change}
            />
            <span class="ml-2">Use Base64 encoding</span>
          </label>
        </div>
        <div>
          <label class="block mb-2 font-semibold">Input Text:</label>
          <textarea
            class="form-textarea w-full h-32"
            placeholder="Enter text to convert to Data URI..."
            .value=${this.inputText}
            @input=${this.handleInput}
          ></textarea>
        </div>
        <div>
          <label class="block mb-2 font-semibold">Data URI Output:</label>
          <textarea
            class="form-textarea w-full h-32 font-mono text-sm"
            readonly
            .value=${this.outputText}
          ></textarea>
          ${this.outputText && !this.outputText.startsWith('Error:')
            ? html`<t-copy-button .text=${this.outputText}></t-copy-button>`
            : ''}
        </div>
        ${this.outputText &&
        !this.outputText.startsWith('Error:') &&
        this.mimeType.startsWith('text/html')
          ? html`
              <div class="p-4 bg-gray-100 rounded">
                <p class="font-bold mb-2">HTML Preview:</p>
                <iframe
                  src="${this.outputText}"
                  class="w-full h-32 border rounded bg-white"
                  sandbox
                ></iframe>
              </div>
            `
          : ''}
        <div class="text-sm text-gray-600">
          <p>
            <strong>Note:</strong> Data URIs allow you to embed data directly in
            HTML/CSS.
          </p>
          <p>Base64 encoding is recommended for binary or non-ASCII data.</p>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'data-uri-generator': DataUriGenerator;
  }
}

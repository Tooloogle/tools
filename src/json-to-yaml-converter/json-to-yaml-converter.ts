import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import jsonToYamlConverterStyles from './json-to-yaml-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import * as yaml from 'js-yaml';
import '../t-copy-button';
@customElement('json-to-yaml-converter')
export class JsonToYamlConverter extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    inputStyles,
    jsonToYamlConverterStyles,
  ];

  @property({ type: String }) inputText = '';
  @property({ type: String }) outputText = '';
  @property({ type: String }) errorMessage = '';

  private handleInput(e: Event) {
    this.inputText = (e.target as HTMLTextAreaElement).value;
    this.process();
  }

  private process() {
    if (!this.inputText.trim()) {
      this.outputText = '';
      this.errorMessage = '';
      return;
    }

    try {
      const jsonObj = JSON.parse(this.inputText);
      this.outputText = yaml.dump(jsonObj, { indent: 2, lineWidth: -1 });
      this.errorMessage = '';
    } catch (error) {
      this.outputText = '';
      this.errorMessage = `Error: ${
        error instanceof Error ? error.message : 'Invalid JSON'
      }`;
    }
  }

  override render() {
    return html`
      <div class="space-y-4">
        <div>
          <label class="block mb-2 font-semibold">JSON Input:</label>
          <textarea
            class="form-textarea w-full h-32"
            placeholder='Enter JSON... e.g., {"name": "John", "age": 30}'
            .value=${this.inputText}
            @input=${this.handleInput}
          ></textarea>
        </div>
        ${this.errorMessage
          ? html`
              <div
                class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
              >
                ${this.errorMessage}
              </div>
            `
          : ''}
        <div>
          <label class="block mb-2 font-semibold">YAML Output:</label>
          <textarea
            class="form-textarea w-full h-32"
            readonly
            .value=${this.outputText}
          ></textarea>
          ${this.outputText
            ? html`<t-copy-button .text=${this.outputText}></t-copy-button>`
            : ''}
        </div>
        <div class="text-sm text-gray-600">
          Convert JSON to YAML format using js-yaml library
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'json-to-yaml-converter': JsonToYamlConverter;
  }
}

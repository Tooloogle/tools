import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import yamlToJsonConverterStyles from './yaml-to-json-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import * as yaml from 'js-yaml';
import '../t-copy-button';
import '../t-textarea';

@customElement('yaml-to-json-converter')
export class YamlToJsonConverter extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    yamlToJsonConverterStyles];

  @property({ type: String }) inputText = '';
  @property({ type: String }) outputText = '';
  @property({ type: String }) errorMessage = '';

  private handleInput(e: CustomEvent) {
    this.inputText = e.detail.value;
    this.process();
  }

  private process() {
    try {
      this.errorMessage = '';
      if (!this.inputText.trim()) {
        this.outputText = '';
        return;
      }

      const parsed = yaml.load(this.inputText);
      this.outputText = JSON.stringify(parsed, null, 2);
    } catch (error) {
      this.errorMessage = `Error: ${(error as Error).message}`;
      this.outputText = '';
    }
  }

  override render() {
    return html`
      <div class="space-y-4">
        <div>
          <label class="block mb-2 font-semibold">Input:</label>
          <t-textarea placeholder="Enter input..." class="w-full h-32" .value=${this.inputText} @t-input=${this.handleInput}></t-textarea>
        </div>
        <div>
          <label class="block mb-2 font-semibold">Output:</label>
          <t-textarea ?readonly=${true} class="w-full h-32" .value=${this.outputText}></t-textarea>
          ${this.outputText
            ? html`<t-copy-button .text=${this.outputText}></t-copy-button>`
            : ''}
        </div>
        <div class="text-sm text-gray-600">
          Note: Convert YAML to JSON format
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'yaml-to-json-converter': YamlToJsonConverter;
  }
}

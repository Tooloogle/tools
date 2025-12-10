import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import camelCaseConverterStyles from './camel-case-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button';
import '../t-textarea';

@customElement('camel-case-converter')
export class CamelCaseConverter extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    camelCaseConverterStyles];

  @property({ type: String }) inputText = '';
  @property({ type: String }) outputText = '';

  private handleInput(e: CustomEvent) {
    this.inputText = e.detail.value;
    this.convert();
  }

  private convert() {
    this.outputText = this.inputText
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
  }

  override render() {
    return html`
      <div class="space-y-4">
        <div>
          <label class="block mb-2 font-semibold">Input Text:</label>
          <t-textarea placeholder="Enter text to convert..." .value=${this.inputText} @t-input=${this.handleInput} class="w-full h-32"></t-textarea>
        </div>
        <div>
          <label class="block mb-2 font-semibold">camelCase Output:</label>
          <t-textarea ?readonly=${true} .value=${this.outputText} class="w-full h-32"></t-textarea>
          ${this.outputText
            ? html`<t-copy-button
                .text=${this.outputText}
                .isIcon=${false}
              ></t-copy-button>`
            : ''}
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

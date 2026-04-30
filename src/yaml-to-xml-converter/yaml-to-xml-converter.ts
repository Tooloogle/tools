import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import yamlToXmlConverterStyles from './yaml-to-xml-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import * as yaml from 'js-yaml';
import { escapeXml, sanitizeXmlName } from '../_utils/XmlHelper.js';
import '../t-copy-button/index.js';

@customElement('yaml-to-xml-converter')
export class YamlToXmlConverter extends WebComponentBase {
  static override styles = [
    WebComponentBase.styles,
    yamlToXmlConverterStyles];

  @property({ type: String }) inputText = '';
  @property({ type: String }) outputText = '';

  private handleInput(e: Event) {
    this.inputText = (e.target as HTMLTextAreaElement).value;
    this.process();
  }

  private jsonToXml(obj: unknown, rootName = 'root'): string {
    const safeRoot = sanitizeXmlName(rootName);

    if (typeof obj !== 'object' || obj === null) {
      return `<${safeRoot}>${escapeXml(obj)}</${safeRoot}>`;
    }

    let xml = `<${safeRoot}>`;

    if (Array.isArray(obj)) {
      // Each array item gets its own <item> wrapper. We pass the wrapper name
      // to jsonToXml when the item is an object/array (so the recursive call
      // wraps), and emit the wrapper directly for primitives.
      obj.forEach((item) => {
        if (typeof item === 'object' && item !== null) {
          xml += this.jsonToXml(item, 'item');
        } else {
          xml += `<item>${escapeXml(item)}</item>`;
        }
      });
    } else {
      const record = obj as Record<string, unknown>;
      for (const key in record) {
        if (Object.prototype.hasOwnProperty.call(record, key)) {
          const value = record[key];
          if (typeof value === 'object' && value !== null) {
            xml += this.jsonToXml(value, key);
          } else {
            const safeKey = sanitizeXmlName(key);
            xml += `<${safeKey}>${escapeXml(value)}</${safeKey}>`;
          }
        }
      }
    }

    xml += `</${safeRoot}>`;
    return xml;
  }

  private process() {
    if (!this.inputText.trim()) {
      this.outputText = '';
      return;
    }

    try {
      const parsed = yaml.load(this.inputText);
      this.outputText = this.jsonToXml(parsed);
    } catch (error) {
      this.outputText = `Error: ${(error as Error).message}`;
    }
  }

  override render() {
    return html`
      <div class="space-y-4">
        <div>
          <label class="block mb-2 font-semibold">Input:</label>
          <textarea
            class="form-textarea w-full h-32"
            placeholder="Enter input..."
            .value=${this.inputText}
            @input=${this.handleInput}
          ></textarea>
        </div>
        <div>
          <label class="block mb-2 font-semibold">Output:</label>
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
          Note: Convert YAML to XML format
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'yaml-to-xml-converter': YamlToXmlConverter;
  }
}

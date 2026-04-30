import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import yamlToXmlConverterStyles from './yaml-to-xml-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import * as yaml from 'js-yaml';
import { escapeXml, sanitizeXmlName } from '../_utils/XmlHelper.js';
import '../t-copy-button/index.js';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') {
    return false;
  }

  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function isStructural(value: unknown): boolean {
  return Array.isArray(value) || isPlainObject(value);
}

function scalarToString(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return String(value ?? '');
}

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

    // Treat non-plain objects (Date, RegExp, etc. — js-yaml deserializes
    // YAML timestamps to Date) as scalars. Otherwise they fall into the
    // object branch below and serialize as empty elements because they
    // have no enumerable own keys.
    if (!isStructural(obj)) {
      return `<${safeRoot}>${escapeXml(scalarToString(obj))}</${safeRoot}>`;
    }

    const body = Array.isArray(obj)
      ? this.arrayToXml(obj)
      : this.recordToXml(obj as Record<string, unknown>);

    return `<${safeRoot}>${body}</${safeRoot}>`;
  }

  private arrayToXml(arr: unknown[]): string {
    let xml = '';
    // Each array item gets its own <item> wrapper. We pass the wrapper name
    // to jsonToXml when the item is a structural object/array (so the
    // recursive call wraps), and emit the wrapper directly for scalars.
    arr.forEach((item) => {
      if (isStructural(item)) {
        xml += this.jsonToXml(item, 'item');
      } else {
        xml += `<item>${escapeXml(scalarToString(item))}</item>`;
      }
    });
    return xml;
  }

  private recordToXml(record: Record<string, unknown>): string {
    let xml = '';
    for (const key in record) {
      if (!Object.prototype.hasOwnProperty.call(record, key)) {
        continue;
      }

      const value = record[key];
      if (isStructural(value)) {
        xml += this.jsonToXml(value, key);
      } else {
        const safeKey = sanitizeXmlName(key);
        xml += `<${safeKey}>${escapeXml(scalarToString(value))}</${safeKey}>`;
      }
    }

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

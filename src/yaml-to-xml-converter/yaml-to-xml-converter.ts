import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import yamlToXmlConverterStyles from './yaml-to-xml-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import * as yaml from 'js-yaml';
import { escapeXml, sanitizeXmlName } from '../_utils/XmlHelper.js';
import '../t-copy-button/index.js';
import '../t-file-dropzone/index.js';
import type { TFileDropzoneChangeDetail } from '../t-file-dropzone/t-file-dropzone.js';

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

  private handleFileUpload(e: CustomEvent<TFileDropzoneChangeDetail>) {
    const file = e.detail.file;
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        this.inputText = event.target?.result as string;
        this.process();
      };

      reader.readAsText(file);
    }
  }

  private downloadXml() {
    const blob = new Blob([this.outputText], {
      type: 'application/xml;charset=utf-8;',
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'output.xml');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
    const hasOutput =
      Boolean(this.outputText) && !this.outputText.startsWith('Error:');

    return html`
      <div class="space-y-4 text-gray-900 dark:text-gray-100">
        <div>
          <label class="block mb-2 font-semibold">YAML Input:</label>
          <textarea
            class="form-textarea w-full h-40 font-mono text-sm"
            placeholder="name: John&#10;age: 30&#10;hobbies:&#10;  - reading"
            .value=${this.inputText}
            @input=${this.handleInput}
          ></textarea>
          <t-file-dropzone
            class="block mt-2"
            accept="application/x-yaml,text/yaml,.yaml,.yml"
            label="Drop a YAML file here or click to browse"
            @change=${this.handleFileUpload}
          ></t-file-dropzone>
        </div>
        <div>
          <label class="block mb-2 font-semibold">XML Output:</label>
          <textarea
            class="form-textarea w-full h-40 font-mono text-sm"
            readonly
            .value=${this.outputText}
          ></textarea>
          <div class="flex items-center justify-end gap-2 py-2">
            <button
              class="btn btn-blue btn-sm"
              ?disabled=${!hasOutput}
              @click=${this.downloadXml}
            >
              Download XML
            </button>
            <t-copy-button .isIcon=${false} .disabled=${!hasOutput} .text=${this.outputText}></t-copy-button>
          </div>
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

import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import xmlToCsvConverterStyles from './xml-to-csv-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import '../t-copy-button';

@customElement('xml-to-csv-converter')
export class XmlToCsvConverter extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    inputStyles,
    xmlToCsvConverterStyles,
  ];

  @property({ type: String }) inputText = '';
  @property({ type: String }) outputText = '';

  private handleInput(e: Event) {
    this.inputText = (e.target as HTMLTextAreaElement).value;
    this.process();
  }

  private xmlToJson(xml: string): any[] {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');

    if (xmlDoc.querySelector('parsererror')) {
      throw new Error('Invalid XML');
    }

    const parseNode = (node: Element): any => {
      if (node.children.length === 0) {
        return node.textContent || '';
      }

      const obj: any = {};
      Array.from(node.children).forEach(child => {
        const key = child.tagName;
        const value =
          child.children.length === 0 ? child.textContent : parseNode(child);
        obj[key] = value;
      });

      return obj;
    };

    const rows = Array.from(xmlDoc.documentElement.children);
    return rows.map(row => parseNode(row));
  }

  private process() {
    if (!this.inputText.trim()) {
      this.outputText = '';
      return;
    }

    try {
      const data = this.xmlToJson(this.inputText);

      if (data.length === 0) {
        this.outputText = '';
        return;
      }

      // Get all unique keys
      const keys = Array.from(new Set(data.flatMap(obj => Object.keys(obj))));

      // Create CSV header
      const header = keys.join(',');

      // Create CSV rows
      const rows = data.map(obj => {
        return keys
          .map(key => {
            const value = obj[key];
            const stringValue =
              value !== undefined && value !== null ? String(value) : '';
            // Escape quotes and wrap in quotes if contains comma
            return stringValue.includes(',') || stringValue.includes('"')
              ? `"${stringValue.replace(/"/g, '""')}"`
              : stringValue;
          })
          .join(',');
      });

      this.outputText = [header, ...rows].join('\n');
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
        <div class="text-sm text-gray-600">Note: Convert XML to CSV</div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'xml-to-csv-converter': XmlToCsvConverter;
  }
}

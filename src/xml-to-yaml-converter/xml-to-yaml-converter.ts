import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import xmlToYamlConverterStyles from './xml-to-yaml-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import * as yaml from 'js-yaml';
import '../t-copy-button';

@customElement('xml-to-yaml-converter')
export class XmlToYamlConverter extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    xmlToYamlConverterStyles];

  @property({ type: String }) inputText = '';
  @property({ type: String }) outputText = '';

  private handleInput(e: CustomEvent) {
    this.inputText = e.detail.value;
    this.process();
  }

  private xmlToJson(xml: string): any {
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
      const children = Array.from(node.children);

      children.forEach(child => {
        const key = child.tagName;
        const value = parseNode(child);

        if (obj[key]) {
          if (!Array.isArray(obj[key])) {
            obj[key] = [obj[key]];
          }

          obj[key].push(value);
        } else {
          obj[key] = value;
        }
      });

      return obj;
    };

    return parseNode(xmlDoc.documentElement);
  }

  private process() {
    if (!this.inputText.trim()) {
      this.outputText = '';
      return;
    }

    try {
      const json = this.xmlToJson(this.inputText);
      this.outputText = yaml.dump(json);
    } catch (error) {
      this.outputText = `Error: ${(error as Error).message}`;
    }
  }

  override render() {
    return html`
      <div class="space-y-4">
        <div>
          <label class="block mb-2 font-semibold">Input:</label>
          <t-textarea placeholder="Enter input..." class="w-full h-32"></t-textarea>
        </div>
        <div>
          <label class="block mb-2 font-semibold">Output:</label>
          <t-textarea ?readonly=${true} class="w-full h-32"></t-textarea>
          ${this.outputText
            ? html`<t-copy-button .text=${this.outputText}></t-copy-button>`
            : ''}
        </div>
        <div class="text-sm text-gray-600">
          Note: Convert XML to YAML format
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'xml-to-yaml-converter': XmlToYamlConverter;
  }
}

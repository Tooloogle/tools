import { html, customElement, property } from 'lit-element'
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import xmlToJsonConverterStyles from './xml-to-json-converter.css.js';

interface JsonObject {
  [key: string]: unknown;
  '@attributes'?: Record<string, string>;
  '#text'?: string;
}

@customElement('xml-to-json-converter')
export class XmlToJsonConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, xmlToJsonConverterStyles];

    @property({ type: Object }) file: File | null = null;

  private handleFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.file = input.files?.[0] ?? null;
  }

  private xmlToJson(xml: string): JsonObject | string {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');
    
    // Check for parsing errors
    const parseError = xmlDoc.querySelector('parsererror');
    if (parseError) {
      throw new Error('Invalid XML format');
    }
    
    return this.xmlNodeToJson(xmlDoc.documentElement);
  }

  private xmlNodeToJson(node: Element): JsonObject | string {
    const obj: JsonObject = {};
    
    // Handle attributes
    this.processAttributes(node, obj);
    
    // Handle child nodes
    return this.processChildNodes(node, obj);
  }

  private processAttributes(node: Element, obj: JsonObject): void {
    if (node.attributes.length === 0) return;
    
    obj['@attributes'] = {};
    for (let i = 0; i < node.attributes.length; i++) {
      const attr = node.attributes[i];
      (obj['@attributes'] as Record<string, string>)[attr.name] = attr.value;
    }
  }

  private processChildNodes(node: Element, obj: JsonObject): JsonObject | string {
    if (!node.hasChildNodes()) {
      return obj;
    }

    for (let i = 0; i < node.childNodes.length; i++) {
      const child = node.childNodes[i];
      
      if (child.nodeType === Node.TEXT_NODE) {
        const textResult = this.processTextNode(child, obj);
        if (typeof textResult === 'string') {
          return textResult;
        }
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        this.processElementNode(child as Element, obj);
      }
    }
    
    return obj;
  }

  private processTextNode(child: ChildNode, obj: JsonObject): JsonObject | string {
    const text = child.textContent?.trim();
    if (!text) {
      return obj;
    }

    if (Object.keys(obj).length === 0) {
      return text;
    }
    
    obj['#text'] = text;
    return obj;
  }

  private processElementNode(childElement: Element, obj: JsonObject): void {
    const childName = childElement.nodeName;
    const childValue = this.xmlNodeToJson(childElement);
    
    this.addChildToObject(obj, childName, childValue);
  }

  private addChildToObject(obj: JsonObject, childName: string, childValue: JsonObject | string): void {
    const existingValue = obj[childName];
    
    if (existingValue !== undefined) {
      if (!Array.isArray(existingValue)) {
        obj[childName] = [existingValue];
      }
      (obj[childName] as unknown[]).push(childValue);
    } else {
      obj[childName] = childValue;
    }
  }

  private async convert() {
    if (!this.file) return;

    try {
      const text = await this.file.text();
      const jsonObj = this.xmlToJson(text);
      const jsonString = JSON.stringify(jsonObj, null, 2);
      
      this.downloadJson(jsonString);
    } catch (error) {
      console.error('Conversion failed:', error);
      alert('Failed to convert XML file. Please check if the XML is valid.');
    }
  }

  private downloadJson(jsonString: string): void {
    if (!this.file) return;
    
    const blob = new Blob([jsonString], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    const fileName = this.file.name.replace(/\.[^/.]+$/, '.json');
    a.download = fileName;
    a.click();
  }

    override render() {
    return html`
      <div class="container">
        <label>Select an XML file:</label>
        <input type="file" accept="application/xml,text/xml,.xml" class="form-input" @change="${this.handleFileChange}" />
        <button class="btn" @click="${this.convert}" ?disabled="${!this.file}">
          Convert to JSON
        </button>
      </div>
    `;
  }
}

declare global {
    interface HTMLElementTagNameMap {
        'xml-to-json-converter': XmlToJsonConverter;
    }
}
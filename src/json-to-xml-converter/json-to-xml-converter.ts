import { html, customElement, property } from 'lit-element'
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import jsonToXmlConverterStyles from './json-to-xml-converter.css.js';

@customElement('json-to-xml-converter')
export class JsonToXmlConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, jsonToXmlConverterStyles];

    @property({ type: Object }) file: File | null = null;

  private handleFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.file = input.files?.[0] ?? null;
  }

    private jsonToXml(obj: unknown, rootName = 'root'): string {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += this.objectToXml(obj, rootName);
        return xml;
    }

  private objectToXml(obj: any, nodeName: string): string {
    if (obj === null || obj === undefined) {
      return `<${nodeName}></${nodeName}>`;
    }
    
    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
      return `<${nodeName}>${this.escapeXml(obj.toString())}</${nodeName}>`;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.objectToXml(item, nodeName)).join('\n');
    }
    
    if (typeof obj === 'object') {
      let xml = `<${nodeName}`;
      let content = '';
      
      // Handle attributes
      if (obj['@attributes']) {
        for (const [key, value] of Object.entries(obj['@attributes'])) {
          xml += ` ${key}="${this.escapeXml(value as string)}"`;
        }
      }
      
      xml += '>';
      
      // Handle text content
      if (obj['#text']) {
        content += this.escapeXml(obj['#text']);
      }
      
      // Handle child elements
      for (const [key, value] of Object.entries(obj)) {
        if (key !== '@attributes' && key !== '#text') {
          if (Array.isArray(value)) {
            content += '\n' + value.map(item => this.objectToXml(item, key)).join('\n');
          } else {
            content += '\n' + this.objectToXml(value, key);
          }
        }
      }
      
      if (content) {
        xml += content + '\n';
      }
      
      xml += `</${nodeName}>`;
      return xml;
    }
    
    return `<${nodeName}>${this.escapeXml(obj.toString())}</${nodeName}>`;
  }

  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  private async convert() {
    if (!this.file) return;

    try {
      const text = await this.file.text();
      const jsonObj = JSON.parse(text);
      
      // Determine root element name
      const rootName = Object.keys(jsonObj).length === 1 ? Object.keys(jsonObj)[0] : 'root';
      const dataToConvert = Object.keys(jsonObj).length === 1 ? jsonObj[rootName] : jsonObj;
      
      const xmlString = this.jsonToXml(dataToConvert, rootName);
      
      const blob = new Blob([xmlString], { type: 'application/xml' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      const fileName = this.file.name.replace(/\.[^/.]+$/, '.xml');
      a.download = fileName;
      a.click();
    } catch (error) {
      console.error('Conversion failed:', error);
      alert('Failed to convert JSON file. Please check if the JSON is valid.');
    }
  }

    override render() {
    return html`
      <div class="container">
        <label>Select a JSON file:</label>
        <input type="file" accept="application/json,text/json,.json" class="form-input" @change="${this.handleFileChange}" />
        <button class="btn" @click="${this.convert}" ?disabled="${!this.file}">
          Convert to XML
        </button>
      </div>
    `;
  }
}

declare global {
    interface HTMLElementTagNameMap {
        'json-to-xml-converter': JsonToXmlConverter;
    }
}
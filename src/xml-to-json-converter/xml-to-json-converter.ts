import { html, customElement, property } from 'lit-element'
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import xmlToJsonConverterStyles from './xml-to-json-converter.css.js';

@customElement('xml-to-json-converter')
export class XmlToJsonConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, xmlToJsonConverterStyles];

    @property({ type: Object }) file: File | null = null;

  private handleFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.file = input.files?.[0] ?? null;
  }

  private xmlToJson(xml: string): any {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');
    
    // Check for parsing errors
    const parseError = xmlDoc.querySelector('parsererror');
    if (parseError) {
      throw new Error('Invalid XML format');
    }
    
    return this.xmlNodeToJson(xmlDoc.documentElement);
  }

  private xmlNodeToJson(node: Element): any {
    const obj: any = {};
    
    // Handle attributes
    if (node.attributes.length > 0) {
      obj['@attributes'] = {};
      for (let i = 0; i < node.attributes.length; i++) {
        const attr = node.attributes[i];
        obj['@attributes'][attr.name] = attr.value;
      }
    }
    
    // Handle child nodes
    if (node.hasChildNodes()) {
      for (let i = 0; i < node.childNodes.length; i++) {
        const child = node.childNodes[i];
        
        if (child.nodeType === Node.TEXT_NODE) {
          const text = child.textContent?.trim();
          if (text) {
            if (Object.keys(obj).length === 0) {
              return text;
            } else {
              obj['#text'] = text;
            }
          }
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          const childElement = child as Element;
          const childName = childElement.nodeName;
          const childValue = this.xmlNodeToJson(childElement);
          
          if (obj[childName]) {
            if (!Array.isArray(obj[childName])) {
              obj[childName] = [obj[childName]];
            }
            obj[childName].push(childValue);
          } else {
            obj[childName] = childValue;
          }
        }
      }
    }
    
    return obj;
  }

  private async convert() {
    if (!this.file) return;

    try {
      const text = await this.file.text();
      const jsonObj = this.xmlToJson(text);
      const jsonString = JSON.stringify(jsonObj, null, 2);
      
      const blob = new Blob([jsonString], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      const fileName = this.file.name.replace(/\.[^/.]+$/, '.json');
      a.download = fileName;
      a.click();
    } catch (error) {
      console.error('Conversion failed:', error);
      alert('Failed to convert XML file. Please check if the XML is valid.');
    }
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
import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import yamlToXmlConverterStyles from './yaml-to-xml-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import * as yaml from 'js-yaml';

@customElement('yaml-to-xml-converter')
export class YamlToXmlConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, yamlToXmlConverterStyles];

    @property({ type: String }) inputText = '';
    @property({ type: String }) outputText = '';

    private handleInput(e: Event) {
        this.inputText = (e.target as HTMLTextAreaElement).value;
        this.process();
    }

    private jsonToXml(obj: any, rootName = 'root'): string {
        if (typeof obj !== 'object' || obj === null) {
            return String(obj);
        }

        let xml = `<${rootName}>`;
        
        if (Array.isArray(obj)) {
            obj.forEach((item, index) => {
                xml += `<item>${this.jsonToXml(item, 'item')}</item>`;
            });
        } else {
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    const value = obj[key];
                    if (typeof value === 'object' && value !== null) {
                        xml += this.jsonToXml(value, key);
                    } else {
                        xml += `<${key}>${String(value)}</${key}>`;
                    }
                }
            }
        }
        
        xml += `</${rootName}>`;
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
                        class="form-input w-full h-32"
                        placeholder="Enter input..."
                        .value=${this.inputText}
                        @input=${this.handleInput}
                    ></textarea>
                </div>
                <div>
                    <label class="block mb-2 font-semibold">Output:</label>
                    <textarea
                        class="form-input w-full h-32"
                        readonly
                        .value=${this.outputText}
                    ></textarea>
                    ${this.outputText ? html`<t-copy-button .text=${this.outputText}></t-copy-button>` : ''}
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

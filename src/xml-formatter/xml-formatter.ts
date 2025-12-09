import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import xmlFormatterStyles from './xml-formatter.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button/t-copy-button.js';
import '../t-button/t-button.js';

@customElement('xml-formatter')
export class XmlFormatter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, xmlFormatterStyles];

    @property()
    input = '';

    @property()
    output = '';

    @property()
    error = '';

    private handleInputChange(e: CustomEvent) {
        this.input = e.detail.value;
        this.error = '';
    }

    private formatXml() {
        this.error = '';
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(this.input, 'text/xml');
            
            // Check for parsing errors
            const parserError = xmlDoc.querySelector('parsererror');
            if (parserError) {
                throw new Error('Invalid XML');
            }
            
            this.output = this.prettyPrintXml(xmlDoc);
        } catch (e) {
            this.error = `Error formatting XML: ${  (e as Error).message}`;
            this.output = '';
        }
    }

    private prettyPrintXml(xml: Document, indent = '  '): string {
        const serializer = new XMLSerializer();
        const xmlString = serializer.serializeToString(xml);
        
        let formatted = '';
        let level = 0;
        const tokens = xmlString.split(/(<[^>]+>)/g).filter(token => token.trim());
        
        tokens.forEach(token => {
            if (token.match(/^<\/[\w]/)) {
                level--;
                formatted += `${indent.repeat(level) + token  }\n`;
            } else if (token.match(/^<[\w]/)) {
                formatted += `${indent.repeat(level) + token  }\n`;
                if (!token.match(/\/>/)) {
                    level++;
                }
            } else if (token.trim()) {
                formatted += `${indent.repeat(level) + token.trim()  }\n`;
            }
        });
        
        return formatted.trim();
    }

    private minify() {
        this.error = '';
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(this.input, 'text/xml');
            
            const parserError = xmlDoc.querySelector('parsererror');
            if (parserError) {
                throw new Error('Invalid XML');
            }
            
            const serializer = new XMLSerializer();
            this.output = serializer.serializeToString(xmlDoc).replace(/>\s+</g, '><');
        } catch (e) {
            this.error = `Error minifying XML: ${  (e as Error).message}`;
            this.output = '';
        }
    }

    private clear() {
        this.input = '';
        this.output = '';
        this.error = '';
    }

    override render() {
        return html`
            <label class="block py-1">
                <span class="inline-block py-1 font-bold">XML Input:</span>
                <t-textarea placeholder="Paste XML here..." rows="10" class="font-mono text-sm"></t-textarea>
            </label>

            <div class="py-2 flex flex-wrap gap-2">
                <t-button variant="blue" @click=${this.formatXml}>Format XML</t-button>
                <t-button variant="blue" @click=${this.minify}>Minify XML</t-button>
                <t-button variant="red" @click=${this.clear}>Clear</t-button>
            </div>

            ${this.error ? html`
                <div class="py-2">
                    <div class="px-3 py-2 bg-red-100 text-red-800 rounded">
                        ${this.error}
                    </div>
                </div>
            ` : ''}

            ${this.output ? html`
                <label class="block py-1">
                    <span class="inline-block py-1 font-bold">Formatted Output:</span>
                    <t-textarea rows="10" ?readonly=${true} class="font-mono text-sm"></t-textarea>
                    <div class="py-2 text-right">
                        <t-copy-button .isIcon=${false} .text=${this.output}></t-copy-button>
                    </div>
                </label>
            ` : ''}
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'xml-formatter': XmlFormatter;
    }
}

import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import yamlValidatorStyles from './yaml-validator.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';

@customElement('yaml-validator')
export class YamlValidator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, yamlValidatorStyles];

    @property()
    input = '';

    @property()
    isValid = false;

    @property()
    error = '';

    @property()
    lineCount = 0;

    private handleInputChange(e: Event) {
        this.input = (e.target as HTMLTextAreaElement).value;
        this.error = '';
        this.isValid = false;
    }

    private validateYaml() {
        this.error = '';
        this.isValid = false;
        this.lineCount = this.input.split('\n').length;

        try {
            const lines = this.input.split('\n');
            
            for (let i = 0; i < lines.length; i++) {
                this.validateLine(lines[i], i + 1);
            }
            
            this.isValid = true;
        } catch (e) {
            this.error = (e as Error).message;
            this.isValid = false;
        }
    }

    private validateIndentation(line: string, lineNumber: number) {
        const indent = line.search(/\S/);
        if (indent === -1) return;
        
        if (indent % 2 !== 0) {
            throw new Error(`Line ${lineNumber}: Inconsistent indentation (should be multiples of 2 spaces)`);
        }
    }

    private validateColons(line: string, lineNumber: number) {
        if (!line.includes(':')) return;
        
        const parts = line.split(':');
        const hasQuotes = line.includes('"') || line.includes("'");
        const isUrlOrTime = line.match(/https?:\/\//) || line.match(/\d{1,2}:\d{2}/);
        
        if (parts.length > 2 && !hasQuotes && !isUrlOrTime) {
            throw new Error(`Line ${lineNumber}: Multiple colons detected`);
        }
    }

    private validateLine(line: string, lineNumber: number) {
        // Skip empty lines and comments
        if (!line.trim() || line.trim().startsWith('#')) {
            return;
        }
        
        this.validateIndentation(line, lineNumber);
        
        // Check for tabs
        if (line.includes('\t')) {
            throw new Error(`Line ${lineNumber}: Tabs are not allowed in YAML, use spaces`);
        }
        
        this.validateColons(line, lineNumber);
    }

    private clear() {
        this.input = '';
        this.error = '';
        this.isValid = false;
        this.lineCount = 0;
    }

    override render() {
        return html`
            <label class="block py-1">
                <span class="inline-block py-1 font-bold">YAML Input:</span>
                <textarea
                    class="form-textarea font-mono text-sm"
                    placeholder="Paste YAML content here..."
                    rows="15"
                    autofocus
                    .value=${this.input}
                    @input=${this.handleInputChange}
                ></textarea>
            </label>

            <div class="py-2 flex flex-wrap gap-2">
                <button class="btn btn-blue" @click=${this.validateYaml}>Validate YAML</button>
                <button class="btn btn-red" @click=${this.clear}>Clear</button>
            </div>

            ${this.isValid ? html`
                <div class="py-2">
                    <div class="p-3 bg-green-100 text-green-800 rounded">
                        <p class="font-bold">✓ Valid YAML</p>
                        <p class="mt-1">Lines: ${this.lineCount}</p>
                    </div>
                </div>
            ` : ''}

            ${this.error ? html`
                <div class="py-2">
                    <div class="p-3 bg-red-100 text-red-800 rounded">
                        <p class="font-bold">✗ Invalid YAML</p>
                        <p class="mt-1">${this.error}</p>
                    </div>
                </div>
            ` : ''}

            <div class="mt-4 p-3 bg-blue-50 rounded text-sm">
                <p class="font-bold">YAML Tips:</p>
                <ul class="list-disc list-inside mt-2 space-y-1">
                    <li>Use spaces for indentation (not tabs)</li>
                    <li>Indentation should be in multiples of 2 spaces</li>
                    <li>Key-value pairs use colon and space (key: value)</li>
                    <li>Lists start with dash and space (- item)</li>
                    <li>Use quotes for strings with special characters</li>
                </ul>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'yaml-validator': YamlValidator;
    }
}

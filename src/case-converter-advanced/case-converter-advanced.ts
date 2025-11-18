import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import caseConverterAdvancedStyles from './case-converter-advanced.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import '../t-copy-button/t-copy-button.js';

@customElement('case-converter-advanced')
export class CaseConverterAdvanced extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, caseConverterAdvancedStyles];

    @property()
    input = '';

    @property()
    output = '';

    private handleInputChange(e: Event) {
        this.input = (e.target as HTMLTextAreaElement).value;
    }

    private toSentenceCase() {
        this.output = this.input.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
    }

    private toAlternatingCase() {
        this.output = Array.from(this.input).map((c, i) => 
            i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()
        ).join('');
    }

    private toInverseCase() {
        this.output = Array.from(this.input).map(c => 
            c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()
        ).join('');
    }

    private toCamelCase() {
        this.output = this.input
            .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => 
                index === 0 ? letter.toLowerCase() : letter.toUpperCase()
            )
            .replace(/\s+/g, '');
    }

    private toPascalCase() {
        this.output = this.input
            .replace(/(?:^\w|[A-Z]|\b\w)/g, letter => letter.toUpperCase())
            .replace(/\s+/g, '');
    }

    private toSnakeCase() {
        this.output = this.input
            .replace(/\s+/g, '_')
            .replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
            .replace(/^_/, '')
            .toLowerCase();
    }

    private toKebabCase() {
        this.output = this.input
            .replace(/\s+/g, '-')
            .replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
            .replace(/^-/, '')
            .toLowerCase();
    }

    private toConstantCase() {
        this.output = this.input
            .replace(/\s+/g, '_')
            .replace(/[a-z][A-Z]/g, match => `${match[0]}_${match[1]}`)
            .toUpperCase();
    }

    private toDotCase() {
        this.output = this.input
            .replace(/\s+/g, '.')
            .replace(/[A-Z]/g, letter => `.${letter.toLowerCase()}`)
            .replace(/^\./, '')
            .toLowerCase();
    }

    private clear() {
        this.input = '';
        this.output = '';
    }

    override render() {
        return html`
            <label class="block py-1">
                <span class="inline-block py-1 font-bold">Input Text:</span>
                <textarea
                    class="form-textarea"
                    placeholder="Enter text to convert..."
                    rows="6"
                    autofocus
                    .value=${this.input}
                    @input=${this.handleInputChange}
                ></textarea>
            </label>

            <div class="py-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                <button class="btn btn-blue" @click=${this.toSentenceCase}>Sentence case</button>
                <button class="btn btn-blue" @click=${this.toCamelCase}>camelCase</button>
                <button class="btn btn-blue" @click=${this.toPascalCase}>PascalCase</button>
                <button class="btn btn-blue" @click=${this.toSnakeCase}>snake_case</button>
                <button class="btn btn-blue" @click=${this.toKebabCase}>kebab-case</button>
                <button class="btn btn-blue" @click=${this.toConstantCase}>CONSTANT_CASE</button>
                <button class="btn btn-blue" @click=${this.toDotCase}>dot.case</button>
                <button class="btn btn-blue" @click=${this.toAlternatingCase}>aLtErNaTiNg</button>
                <button class="btn btn-blue" @click=${this.toInverseCase}>InVeRsE</button>
                <button class="btn btn-red col-span-2 md:col-span-3" @click=${this.clear}>Clear</button>
            </div>

            ${this.output ? html`
                <label class="block py-1">
                    <span class="inline-block py-1 font-bold">Output:</span>
                    <textarea
                        class="form-textarea"
                        rows="6"
                        readonly
                        .value=${this.output}
                    ></textarea>
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
        'case-converter-advanced': CaseConverterAdvanced;
    }
}

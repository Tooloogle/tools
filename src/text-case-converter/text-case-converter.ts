import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import textCaseConverterStyles from './text-case-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import '../t-copy-button/t-copy-button.js';

@customElement('text-case-converter')
export class TextCaseConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, textCaseConverterStyles];

    @property()
    input = '';

    @property()
    output = '';

    toLower(text: string) {
        return text.toLowerCase();
    }

    toUpper(text: string) {
        return text.toUpperCase();
    }

    toCapitalize(text: string) {
        text = text.toLowerCase();
        return text.replace(/\b\w/g, c => c.toUpperCase());
    }

    toSentenceCase(text: string) {
        return text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
    }

    toAlternate(text: string) {
        return Array.from(text).map((c, i) => 
            i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()
        ).join('');
    }

    toInverse(text: string) {
        return Array.from(text).map(c => 
            c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()
        ).join('');
    }

    toCamelCase(text: string) {
        return text
            .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => 
                index === 0 ? letter.toLowerCase() : letter.toUpperCase()
            )
            .replace(/\s+/g, '');
    }

    toPascalCase(text: string) {
        return text
            .replace(/(?:^\w|[A-Z]|\b\w)/g, letter => letter.toUpperCase())
            .replace(/\s+/g, '');
    }

    toSnakeCase(text: string) {
        return text
            .replace(/([A-Z])/g, '_$1')
            .replace(/\s+/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_/, '')
            .toLowerCase();
    }

    toKebabCase(text: string) {
        return text
            .replace(/([A-Z])/g, '-$1')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-/, '')
            .toLowerCase();
    }

    toConstantCase(text: string) {
        return text
            .replace(/([A-Z])/g, '_$1')
            .replace(/\s+/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_/, '')
            .toUpperCase();
    }

    toDotCase(text: string) {
        return text
            .replace(/([A-Z])/g, '.$1')
            .replace(/\s+/g, '.')
            .replace(/\.+/g, '.')
            .replace(/^\./, '')
            .toLowerCase();
    }

    private clear() {
        this.input = '';
        this.output = '';
    }

    private handleInputChange(e: Event) {
        this.input = (e.target as HTMLTextAreaElement).value;
    }

    private handleLowerClick() {
        this.output = this.toLower(this.input);
    }

    private handleUpperClick() {
        this.output = this.toUpper(this.input);
    }

    private handleCapitalizeClick() {
        this.output = this.toCapitalize(this.input);
    }

    private handleSentenceClick() {
        this.output = this.toSentenceCase(this.input);
    }

    private handleAlternateClick() {
        this.output = this.toAlternate(this.input);
    }

    private handleInverseClick() {
        this.output = this.toInverse(this.input);
    }

    private handleCamelClick() {
        this.output = this.toCamelCase(this.input);
    }

    private handlePascalClick() {
        this.output = this.toPascalCase(this.input);
    }

    private handleSnakeClick() {
        this.output = this.toSnakeCase(this.input);
    }

    private handleKebabClick() {
        this.output = this.toKebabCase(this.input);
    }

    private handleConstantClick() {
        this.output = this.toConstantCase(this.input);
    }

    private handleDotClick() {
        this.output = this.toDotCase(this.input);
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
                <button class="btn btn-blue" @click=${this.handleLowerClick}>lower case</button>
                <button class="btn btn-blue" @click=${this.handleUpperClick}>UPPER CASE</button>
                <button class="btn btn-blue" @click=${this.handleCapitalizeClick}>Capitalized Case</button>
                <button class="btn btn-blue" @click=${this.handleSentenceClick}>Sentence case</button>
                <button class="btn btn-blue" @click=${this.handleAlternateClick}>aLtErNaTiNg cAsE</button>
                <button class="btn btn-blue" @click=${this.handleInverseClick}>iNVERSE cASE</button>
                <button class="btn btn-blue" @click=${this.handleCamelClick}>camelCase</button>
                <button class="btn btn-blue" @click=${this.handlePascalClick}>PascalCase</button>
                <button class="btn btn-blue" @click=${this.handleSnakeClick}>snake_case</button>
                <button class="btn btn-blue" @click=${this.handleKebabClick}>kebab-case</button>
                <button class="btn btn-blue" @click=${this.handleConstantClick}>CONSTANT_CASE</button>
                <button class="btn btn-blue" @click=${this.handleDotClick}>dot.case</button>
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
        'text-case-converter': TextCaseConverter;
    }
}

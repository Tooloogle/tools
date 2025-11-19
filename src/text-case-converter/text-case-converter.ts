import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import textCaseConverterStyles from './text-case-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import { downloadText } from '../_utils/DomUtils.js';
import '../t-copy-button/t-copy-button.js';

@customElement('text-case-converter')
export class TextCaseConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, textCaseConverterStyles];

    @property()
    text = "";

    @property()
    placeholder = "Type or paste your content here.";

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
            .replace(/\s+/g, '_')
            .replace(/[a-z][A-Z]/g, match => `${match[0]}_${match[1]}`)
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

    clear() {
        this.text = "";
        this.placeholder = "Type or paste your content here.";
    }

    private handleTextChange(e: Event) {
        this.text = (e.target as HTMLTextAreaElement).value;
    }

    private handleLowerClick() {
        this.text = this.toLower(this.text);
        this.placeholder = this.toLower(this.placeholder);
    }

    private handleUpperClick() {
        this.text = this.toUpper(this.text);
        this.placeholder = this.toUpper(this.placeholder);
    }

    private handleCapitalizeClick() {
        this.text = this.toCapitalize(this.text);
        this.placeholder = this.toCapitalize(this.placeholder);
    }

    private handleSentenceClick() {
        this.text = this.toSentenceCase(this.text);
        this.placeholder = this.toSentenceCase(this.placeholder);
    }

    private handleAlternateClick() {
        this.text = this.toAlternate(this.text);
        this.placeholder = this.toAlternate(this.placeholder);
    }

    private handleInverseClick() {
        this.text = this.toInverse(this.text);
        this.placeholder = this.toInverse(this.placeholder);
    }

    private handleCamelClick() {
        this.text = this.toCamelCase(this.text);
        this.placeholder = this.toCamelCase(this.placeholder);
    }

    private handlePascalClick() {
        this.text = this.toPascalCase(this.text);
        this.placeholder = this.toPascalCase(this.placeholder);
    }

    private handleSnakeClick() {
        this.text = this.toSnakeCase(this.text);
        this.placeholder = this.toSnakeCase(this.placeholder);
    }

    private handleKebabClick() {
        this.text = this.toKebabCase(this.text);
        this.placeholder = this.toKebabCase(this.placeholder);
    }

    private handleConstantClick() {
        this.text = this.toConstantCase(this.text);
        this.placeholder = this.toConstantCase(this.placeholder);
    }

    private handleDotClick() {
        this.text = this.toDotCase(this.text);
        this.placeholder = this.toDotCase(this.placeholder);
    }

    private handleDownloadClick() {
        downloadText(this.text);
    }

    override render() {
        return html`
    <label class="block py-1">
        <textarea
            name="email"
            class="form-textarea"
            autofocus
            .placeholder=${this.placeholder}
            rows="5"
            .value=${this.text}
            @change=${this.handleTextChange}></textarea>
    </label>

    <div class="col btns">
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

        <t-copy-button .isIcon=${false} .text=${this.text}></t-copy-button>
        <button class="btn btn-green" @click=${this.handleDownloadClick}>Download</button>
        <button class="btn btn-red" @click=${this.clear}>Clear</button>
    </div>
    `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'text-case-converter': TextCaseConverter;
    }
}

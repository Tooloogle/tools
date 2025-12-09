import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import textCaseConverterStyles from './text-case-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import { downloadText } from '../_utils/DomUtils.js';
import '../t-copy-button/t-copy-button.js';
import '../t-button/t-button.js';
import '../t-textarea/t-textarea.js';

@customElement('text-case-converter')
export class TextCaseConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, textCaseConverterStyles];

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

    private handleTextChange(e: CustomEvent) {
        this.text = e.detail.value;
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
        <t-textarea rows="5"></t-textarea>
    </label>

    <div class="col btns">
        <t-button variant="blue" @click=${this.handleLowerClick}>lower case</t-button>
        <t-button variant="blue" @click=${this.handleUpperClick}>UPPER CASE</t-button>
        <t-button variant="blue" @click=${this.handleCapitalizeClick}>Capitalized Case</t-button>
        <t-button variant="blue" @click=${this.handleSentenceClick}>Sentence case</t-button>
        <t-button variant="blue" @click=${this.handleAlternateClick}>aLtErNaTiNg cAsE</t-button>
        <t-button variant="blue" @click=${this.handleInverseClick}>iNVERSE cASE</t-button>
        <t-button variant="blue" @click=${this.handleCamelClick}>camelCase</t-button>
        <t-button variant="blue" @click=${this.handlePascalClick}>PascalCase</t-button>
        <t-button variant="blue" @click=${this.handleSnakeClick}>snake_case</t-button>
        <t-button variant="blue" @click=${this.handleKebabClick}>kebab-case</t-button>
        <t-button variant="blue" @click=${this.handleConstantClick}>CONSTANT_CASE</t-button>
        <t-button variant="blue" @click=${this.handleDotClick}>dot.case</t-button>

        <t-copy-button .isIcon=${false} .text=${this.text}></t-copy-button>
        <t-button variant="green" @click=${this.handleDownloadClick}>Download</t-button>
        <t-button variant="red" @click=${this.clear}>Clear</t-button>
    </div>
    `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'text-case-converter': TextCaseConverter;
    }
}

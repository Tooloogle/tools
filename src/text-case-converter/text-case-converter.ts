import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import textCaseConverterStyles from './text-case-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import { downloadText } from '../_utils/DomUtils.js';

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

    // toTitle(text:string) { // TODO: need to modify logic
    //   text = text.toLowerCase();
    //   return text.replace(/\b(A|An|And|As|At|But|By|En|For|If|In|Of|On|Or|The|To|Vs?\\.?|Via)\b/g, c => {
    //     return c.toLowerCase();
    //   }).replace(/(?:([\.\?!] |\n|^))(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|vs?\\.?|via)/g, str => {
    //     return str.toUpperCase();
    //   })
    // }

    toAlternate(text: string) {
        text = text.toLowerCase();
        let res = "";
        for (let i = 0; i < text.length; i++) {
            const c = text.charAt(i);
            res += i % 2 ? c.toUpperCase() : c;
        }
        return res;
    }

    toInverse(text: string) {
        let res = "";
        for (let i = 0; i < text.length; i++) {
            const c = text.charAt(i);
            res += c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase();
        }
        return res;
    }

    clear() {
        this.text = "";
        this.placeholder = this.toLower(this.placeholder);
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
                @change=${(e: any) => this.text = e.target?.value}></textarea>
        </label>

        <div class="col btns">
            <button class="btn btn-blue" @click=${() => {
                this.text = this.toLower(this.text);
                this.placeholder = this.toLower(this.placeholder)
            }}>lower case</button>
            <button class="btn btn-blue" @click=${() => {
                this.text = this.toUpper(this.text);
                this.placeholder = this.toUpper(this.placeholder)
            }}>UPPER CASE</button>
            <button class="btn btn-blue"  @click=${() => {
                this.text = this.toCapitalize(this.text);
                this.placeholder = this.toCapitalize(this.placeholder)
            }}>Capitalized Case</button>
            <!-- <button class="btn btn-blue" id="title">Title Case</button> -->
            <button class="btn btn-blue"  @click=${() => {
                this.text = this.toAlternate(this.text);
                this.placeholder = this.toAlternate(this.placeholder)
            }}>aLtErNaTiNg cAsE</button>
            <button class="btn btn-blue" @click=${() => {
                this.text = this.toInverse(this.text);
                this.placeholder = this.toInverse(this.placeholder)
            }}>iNVERSE cASE</button>

            <button class="btn btn-green" @click=${() => downloadText(this.text)}>Download</button>
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

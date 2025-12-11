import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { WebComponentBase, IConfigBase } from '../_web-component/WebComponentBase.js';
import regexExpressionTesterStyles from './regex-expression-tester.css.js';
import { createRef, ref, Ref } from 'lit/directives/ref.js';
import '../t-input';
import '../t-textarea';

interface Flag {
    value: string;
    description: string;
}

@customElement('regex-expression-tester')
export class RegexExpressionTester extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, regexExpressionTesterStyles];

    @property({ type: String }) pattern = '';
    @property({ type: String }) flags = '';
    @property({ type: String }) testString = '';
    @state() resultString = '';

    private inputRef: Ref<HTMLInputElement> = createRef();
    private testStringRef: Ref<HTMLTextAreaElement> = createRef();

    private flagsList: Flag[] = [
        { value: 'g', description: 'Global match' },
        { value: 'i', description: 'Case-insensitive matching' },
        { value: 'm', description: 'Multi-line matching' },
        { value: 's', description: 'Dot matches newline' },
        { value: 'u', description: 'Unicode matching' },
        { value: 'y', description: 'Sticky matching' }
    ];

    private onPatternInputChange(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        this.pattern = inputElement.value;
        this.testRegex();
    }

    private onFlagsInputChange(event: Event) {
        const selectElement = event.target as HTMLSelectElement;
        this.flags = Array.from(selectElement.selectedOptions).map(option => option.value).join('');
        this.testRegex();
    }

    private onTestStringInputChange(event: Event) {
        const inputElement = event.target as HTMLTextAreaElement;
        this.testString = inputElement.value;
        this.testRegex();
    }

    private testRegex() {
        try {
            const regex = new RegExp(this.pattern, this.flags);
            const matches = [...this.testString.matchAll(regex)];
            this.resultString = '';

            if (matches.length > 0) {
                let lastIndex = 0;
                this.resultString = matches.reduce((acc, match, index) => {
                    const [matchedText] = match;
                    const start = match.index;
                    if (start === undefined) {
                        return acc;
                    }

                    const end = start + matchedText.length;

                    acc += `${this.testString.slice(lastIndex, start)}<mark title="Match ${index + 1}: ${matchedText} at position ${start}">${matchedText}</mark>`;
                    lastIndex = end;
                    return acc;
                }, '');
                this.resultString += this.testString.slice(lastIndex);
            } else {
                this.resultString = 'No matches found.';
            }
        } catch (error) {
            this.resultString = 'Invalid regex pattern.';
        }
    }

    private getFlagOptions() {
        return this.flagsList.map(
            flag => html`<option value="${flag.value}" title="${flag.description}">${flag.value}</option>`
        );
    }

    render() {
        return html`
        <div class="regex-expression-tester">
            <div class="editor mb-4">
                <label for="pattern">Pattern:</label>
                <t-input placeholder="Enter regex pattern" .value="${this.pattern}" @t-input=${this.onPatternInputChange}></t-input>
                <label for="flags">Flags:</label>
                <select id="flags" class="form-input" @change=${this.onFlagsInputChange} multiple>
                    ${this.getFlagOptions()}
                </select>
                <label for="testString">Test String:</label>
                <t-textarea placeholder="Enter the string to test the regex against" rows="10" .value="${this.testString}" @t-input=${this.onTestStringInputChange}></t-textarea>
            </div>

            <div class="editor mb-4 result-container">
                <label for="resultString">Result:</label>
                <div id="resultString" class="result-string" .innerHTML=${this.resultString}></div>
            </div>
        </div>
    `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'regex-expression-tester': RegexExpressionTester;
    }
}

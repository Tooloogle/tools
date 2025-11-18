import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import diffCheckerStyles from './diff-checker.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';

interface DiffLine {
    type: 'equal' | 'added' | 'removed';
    text: string;
}

@customElement('diff-checker')
export class DiffChecker extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, diffCheckerStyles];

    @property()
    text1 = '';

    @property()
    text2 = '';

    @property()
    diff: DiffLine[] = [];

    private handleText1Change(e: Event) {
        this.text1 = (e.target as HTMLTextAreaElement).value;
    }

    private handleText2Change(e: Event) {
        this.text2 = (e.target as HTMLTextAreaElement).value;
    }

    private compare() {
        const lines1 = this.text1.split('\n');
        const lines2 = this.text2.split('\n');
        const result: DiffLine[] = [];
        const maxLength = Math.max(lines1.length, lines2.length);
        
        for (let i = 0; i < maxLength; i++) {
            const line1 = lines1[i] || '';
            const line2 = lines2[i] || '';
            
            if (line1 === line2) {
                result.push({ type: 'equal', text: line1 });
            } else {
                if (line1) {
                    result.push({ type: 'removed', text: line1 });
                }

                if (line2) {
                    result.push({ type: 'added', text: line2 });
                }
            }
        }

        this.diff = result;
    }

    private clear() {
        this.text1 = '';
        this.text2 = '';
        this.diff = [];
    }

    private renderDiffLines() {
        return this.diff.map(line => html`
            <div class="${
                line.type === 'added' ? 'bg-green-100 text-green-800' :
                line.type === 'removed' ? 'bg-red-100 text-red-800' :
                'text-gray-800'
            } px-2 py-1 font-mono text-sm">
                ${line.type === 'added' ? '+ ' : line.type === 'removed' ? '- ' : '  '}${line.text}
            </div>
        `);
    }

    override render() {
        return html`
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label class="block">
                    <span class="inline-block py-1">Original Text</span>
                    <textarea
                        class="form-textarea"
                        placeholder="Enter original text..."
                        rows="10"
                        .value=${this.text1}
                        @input=${this.handleText1Change}
                    ></textarea>
                </label>

                <label class="block">
                    <span class="inline-block py-1">Modified Text</span>
                    <textarea
                        class="form-textarea"
                        placeholder="Enter modified text..."
                        rows="10"
                        .value=${this.text2}
                        @input=${this.handleText2Change}
                    ></textarea>
                </label>
            </div>

            <div class="py-2 text-right">
                <button class="btn btn-blue" @click=${this.compare}>Compare</button>
                <button class="btn btn-red" @click=${this.clear}>Clear</button>
            </div>

            ${this.diff.length > 0 ? html`
                <div class="mt-4">
                    <h3 class="font-bold mb-2">Differences:</h3>
                    <div class="border rounded p-2 bg-gray-50">
                        ${this.renderDiffLines()}
                    </div>
                </div>
            ` : ''}
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'diff-checker': DiffChecker;
    }
}

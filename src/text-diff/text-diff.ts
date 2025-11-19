import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import textDiffStyles from './text-diff.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';

@customElement('text-diff')
export class TextDiff extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, textDiffStyles];

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

    private buildLCSTable(str1: string[], str2: string[]): number[][] {
        const m = str1.length;
        const n = str2.length;
        const dp: number[][] = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
        
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (str1[i - 1] === str2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }

        return dp;
    }

    private backtrackLCS(str1: string[], str2: string[], dp: number[][]): DiffLine[] {
        const result: DiffLine[] = [];
        let i = str1.length;
        let j = str2.length;
        
        while (i > 0 || j > 0) {
            if (i > 0 && j > 0 && str1[i - 1] === str2[j - 1]) {
                result.unshift({ type: 'equal', text: str1[i - 1] });
                i--;
                j--;
            } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
                result.unshift({ type: 'added', text: str2[j - 1] });
                j--;
            } else if (i > 0) {
                result.unshift({ type: 'removed', text: str1[i - 1] });
                i--;
            }
        }
        
        return result;
    }

    private compareLCS(str1: string[], str2: string[]): DiffLine[] {
        const dp = this.buildLCSTable(str1, str2);
        return this.backtrackLCS(str1, str2, dp);
    }

    private compare() {
        const lines1 = this.text1.split('\n');
        const lines2 = this.text2.split('\n');
        this.diff = this.compareLCS(lines1, lines2);
    }

    private clear() {
        this.text1 = '';
        this.text2 = '';
        this.diff = [];
    }

    private renderDiffLine(line: DiffLine) {
        const bgClass = line.type === 'removed' ? 'bg-red-100 text-red-800' : 
                       line.type === 'added' ? 'bg-green-100 text-green-800' : 
                       'bg-white';
        const symbol = line.type === 'removed' ? '−' : line.type === 'added' ? '+' : ' ';
        
        return html`
            <div class="${bgClass} px-3 py-1 font-mono text-sm border-b">
                <span class="inline-block w-8">${symbol}</span>
                ${line.text}
            </div>
        `;
    }

    override render() {
        return html`
            <div class="grid grid-cols-2 gap-4 py-2">
                <label class="block">
                    <span class="inline-block py-1 font-bold">Original Text:</span>
                    <textarea
                        class="form-textarea font-mono text-sm"
                        placeholder="Enter original text..."
                        rows="12"
                        autofocus
                        .value=${this.text1}
                        @input=${this.handleText1Change}
                    ></textarea>
                </label>

                <label class="block">
                    <span class="inline-block py-1 font-bold">Modified Text:</span>
                    <textarea
                        class="form-textarea font-mono text-sm"
                        placeholder="Enter modified text..."
                        rows="12"
                        .value=${this.text2}
                        @input=${this.handleText2Change}
                    ></textarea>
                </label>
            </div>

            <div class="py-2 flex flex-wrap gap-2">
                <button class="btn btn-blue" @click=${this.compare}>Compare</button>
                <button class="btn btn-red" @click=${this.clear}>Clear</button>
            </div>

            ${this.diff.length > 0 ? html`
                <div class="py-2">
                    <h3 class="font-bold py-2">Differences:</h3>
                    <div class="border rounded overflow-auto max-h-96">
                        ${this.diff.map(line => this.renderDiffLine(line))}
                    </div>
                </div>
            ` : ''}
        `;
    }
}

interface DiffLine {
    type: 'equal' | 'added' | 'removed';
    text: string;
}

declare global {
    interface HTMLElementTagNameMap {
        'text-diff': TextDiff;
    }
}

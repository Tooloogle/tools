import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import characterCounterStyles from './character-counter.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import tableStyles from '../_styles/table.css.js';

@customElement('character-counter')
export class CharacterCounter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, tableStyles, characterCounterStyles];

    @property()
    input = '';

    @property()
    searchChar = '';

    private handleInputChange(e: Event) {
        this.input = (e.target as HTMLTextAreaElement).value;
    }

    private handleSearchChange(e: Event) {
        this.searchChar = (e.target as HTMLInputElement).value;
    }

    private countChar(char: string): number {
        if (!char) return 0;
        return (this.input.match(new RegExp(this.escapeRegex(char), 'g')) || []).length;
    }

    private escapeRegex(str: string): string {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    private getCharFrequency(): Map<string, number> {
        const freq = new Map<string, number>();
        for (const char of this.input) {
            freq.set(char, (freq.get(char) || 0) + 1);
        }

        return freq;
    }

    override render() {
        const totalChars = this.input.length;
        const searchCount = this.countChar(this.searchChar);
        const charFreq = this.getCharFrequency();
        const sortedFreq = Array.from(charFreq.entries()).sort((a, b) => b[1] - a[1]);

        return html`
            <label class="block py-1">
                <span class="inline-block py-1 font-bold">Text to Analyze:</span>
                <textarea
                    class="form-textarea"
                    placeholder="Enter text to count characters..."
                    rows="10"
                    autofocus
                    .value=${this.input}
                    @input=${this.handleInputChange}
                ></textarea>
            </label>

            <div class="py-2">
                <div class="p-3 bg-blue-50 rounded">
                    <p class="font-bold">Total Characters: ${totalChars}</p>
                </div>
            </div>

            <label class="block py-1">
                <span class="inline-block py-1 font-bold">Search for specific character:</span>
                <input
                    type="text"
                    class="form-input"
                    placeholder="Enter a character to count..."
                    maxlength="5"
                    .value=${this.searchChar}
                    @input=${this.handleSearchChange}
                />
            </label>

            ${this.searchChar ? html`
                <div class="py-2">
                    <div class="p-3 bg-green-50 rounded">
                        <p class="font-bold">
                            "${this.searchChar}" appears ${searchCount} time${searchCount !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>
            ` : ''}

            ${sortedFreq.length > 0 ? html`
                <div class="py-2">
                    <h3 class="font-bold py-2">Character Frequency:</h3>
                    <div class="max-h-64 overflow-auto">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Character</th>
                                    <th>Count</th>
                                    <th>Percentage</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${sortedFreq.slice(0, 50).map(([char, count]) => {
                                    const percentage = ((count / totalChars) * 100).toFixed(2);
                                    const displayChar = char === ' ' ? '(space)' : char === '\n' ? '(newline)' : char === '\t' ? '(tab)' : char;
                                    return html`
                                        <tr>
                                            <td>${displayChar}</td>
                                            <td>${count}</td>
                                            <td>${percentage}%</td>
                                        </tr>
                                    `;
                                })}
                            </tbody>
                        </table>
                    </div>
                    ${sortedFreq.length > 50 ? html`
                        <p class="text-sm text-gray-600 mt-2">Showing top 50 characters</p>
                    ` : ''}
                </div>
            ` : ''}
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'character-counter': CharacterCounter;
    }
}

import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import letterFrequencyAnalyzerStyles from './letter-frequency-analyzer.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';

interface LetterFrequency {
    letter: string;
    count: number;
    percentage: number;
}

@customElement('letter-frequency-analyzer')
export class LetterFrequencyAnalyzer extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, letterFrequencyAnalyzerStyles];

    @property()
    text = '';

    @property()
    frequencies: LetterFrequency[] = [];

    @property()
    caseSensitive = false;

    private analyzeFrequency() {
        if (!this.text) {
            this.frequencies = [];
            return;
        }

        const letterMap = new Map<string, number>();
        const processedText = this.caseSensitive ? this.text : this.text.toLowerCase();
        
        // Count only letters
        for (const char of processedText) {
            if (/[a-z]/i.test(char)) {
                letterMap.set(char, (letterMap.get(char) || 0) + 1);
            }
        }

        const totalLetters = Array.from(letterMap.values()).reduce((sum, count) => sum + count, 0);

        this.frequencies = Array.from(letterMap.entries())
            .map(([letter, count]) => ({
                letter,
                count,
                percentage: (count / totalLetters) * 100
            }))
            .sort((a, b) => b.count - a.count);
    }

    private handleTextChange(e: Event) {
        const target = e.target as HTMLTextAreaElement;
        this.text = target.value;
        this.analyzeFrequency();
    }

    private toggleCaseSensitive() {
        this.caseSensitive = !this.caseSensitive;
        this.analyzeFrequency();
    }

    override render() {
        const maxCount = this.frequencies.length > 0 ? this.frequencies[0].count : 1;

        return html`
            <div class="space-y-4">
                <label class="block">
                    <span class="inline-block py-1">Enter your text</span>
                    <textarea
                        class="form-input"
                        rows="6"
                        .value=${this.text}
                        @input=${this.handleTextChange}
                        placeholder="Type or paste your text here to analyze letter frequency..."
                    ></textarea>
                </label>

                <label class="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        class="form-checkbox"
                        .checked=${this.caseSensitive}
                        @change=${this.toggleCaseSensitive}
                    />
                    <span>Case sensitive</span>
                </label>

                ${this.frequencies.length > 0 ? html`
                    <div class="p-4 bg-gray-100 rounded">
                        <div class="text-lg font-semibold mb-2">
                            Total Letters: ${this.frequencies.reduce((sum, f) => sum + f.count, 0)}
                        </div>
                        <div class="text-sm text-gray-600">
                            Unique Letters: ${this.frequencies.length}
                        </div>
                    </div>

                    <div class="space-y-2">
                        ${this.frequencies.map(freq => {
                            const barWidth = (freq.count / maxCount) * 100;
                            return html`
                                <div class="flex items-center gap-2">
                                    <div class="w-12 text-center font-mono font-bold text-lg">
                                        ${freq.letter}
                                    </div>
                                    <div class="flex-1 bg-gray-200 rounded-full h-6 relative">
                                        <div 
                                            class="bg-blue-500 h-6 rounded-full transition-all duration-300"
                                            style="width: ${barWidth}%"
                                        ></div>
                                        <div class="absolute inset-0 flex items-center px-2 text-sm font-semibold">
                                            ${freq.count} (${freq.percentage.toFixed(2)}%)
                                        </div>
                                    </div>
                                </div>
                            `;
                        })}
                    </div>

                    <div class="p-4 bg-blue-50 rounded border border-blue-200">
                        <div class="font-semibold text-blue-900 mb-2">Top 5 Most Frequent Letters</div>
                        <div class="flex gap-4 flex-wrap">
                            ${this.frequencies.slice(0, 5).map((freq, index) => html`
                                <div class="text-center">
                                    <div class="text-3xl font-bold text-blue-600">${freq.letter}</div>
                                    <div class="text-sm text-blue-700">${freq.count} times</div>
                                    <div class="text-xs text-gray-600">#${index + 1}</div>
                                </div>
                            `)}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'letter-frequency-analyzer': LetterFrequencyAnalyzer;
    }
}

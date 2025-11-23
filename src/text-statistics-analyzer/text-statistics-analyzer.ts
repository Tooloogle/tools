import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import textStatisticsAnalyzerStyles from './text-statistics-analyzer.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';

@customElement('text-statistics-analyzer')
export class TextStatisticsAnalyzer extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, textStatisticsAnalyzerStyles];

    @property()
    text = '';

    @property()
    stats = {
        words: 0,
        characters: 0,
        charactersNoSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        syllables: 0,
        readingTime: 0,
        speakingTime: 0,
        fleschScore: 0
    };

    private countSyllables(word: string): number {
        word = word.toLowerCase();
        if (word.length <= 3) return 1;
        
        word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
        word = word.replace(/^y/, '');
        const matches = word.match(/[aeiouy]{1,2}/g);
        return matches ? matches.length : 1;
    }

    private calculateStats() {
        if (!this.text) {
            this.stats = {
                words: 0,
                characters: 0,
                charactersNoSpaces: 0,
                sentences: 0,
                paragraphs: 0,
                syllables: 0,
                readingTime: 0,
                speakingTime: 0,
                fleschScore: 0
            };
            return;
        }

        const words = this.text.match(/\b\w+\b/g) || [];
        const sentences = this.text.match(/[.!?]+/g) || [];
        const paragraphs = this.text.split(/\n\n+/).filter(p => p.trim().length > 0);

        const wordCount = words.length;
        const sentenceCount = Math.max(sentences.length, 1);
        const syllableCount = words.reduce((sum, word) => sum + this.countSyllables(word), 0);

        // Flesch Reading Ease Score
        const avgSyllablesPerWord = syllableCount / Math.max(wordCount, 1);
        const avgWordsPerSentence = wordCount / sentenceCount;
        const fleschScore = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;

        this.stats = {
            words: wordCount,
            characters: this.text.length,
            charactersNoSpaces: this.text.replace(/\s/g, '').length,
            sentences: sentenceCount,
            paragraphs: paragraphs.length,
            syllables: syllableCount,
            readingTime: Math.ceil(wordCount / 200), // avg 200 words per minute
            speakingTime: Math.ceil(wordCount / 125), // avg 125 words per minute
            fleschScore: Math.max(0, Math.min(100, fleschScore))
        };
    }

    private handleTextChange(e: Event) {
        const target = e.target as HTMLTextAreaElement;
        this.text = target.value;
        this.calculateStats();
    }

    private getReadabilityLevel(score: number): string {
        if (score >= 90) return 'Very Easy (5th grade)';
        if (score >= 80) return 'Easy (6th grade)';
        if (score >= 70) return 'Fairly Easy (7th grade)';
        if (score >= 60) return 'Standard (8th-9th grade)';
        if (score >= 50) return 'Fairly Difficult (10th-12th grade)';
        if (score >= 30) return 'Difficult (College)';
        return 'Very Difficult (College graduate)';
    }

    override render() {
        return html`
            <div class="space-y-4">
                <label class="block">
                    <span class="inline-block py-1">Enter your text</span>
                    <textarea
                        class="form-input"
                        rows="8"
                        .value=${this.text}
                        @input=${this.handleTextChange}
                        placeholder="Type or paste your text here to analyze..."
                    ></textarea>
                </label>

                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div class="p-4 bg-gray-100 rounded text-center">
                        <div class="text-2xl font-bold text-blue-600">${this.stats.words}</div>
                        <div class="text-sm text-gray-600">Words</div>
                    </div>
                    <div class="p-4 bg-gray-100 rounded text-center">
                        <div class="text-2xl font-bold text-blue-600">${this.stats.characters}</div>
                        <div class="text-sm text-gray-600">Characters</div>
                    </div>
                    <div class="p-4 bg-gray-100 rounded text-center">
                        <div class="text-2xl font-bold text-blue-600">${this.stats.charactersNoSpaces}</div>
                        <div class="text-sm text-gray-600">Characters (no spaces)</div>
                    </div>
                    <div class="p-4 bg-gray-100 rounded text-center">
                        <div class="text-2xl font-bold text-green-600">${this.stats.sentences}</div>
                        <div class="text-sm text-gray-600">Sentences</div>
                    </div>
                    <div class="p-4 bg-gray-100 rounded text-center">
                        <div class="text-2xl font-bold text-green-600">${this.stats.paragraphs}</div>
                        <div class="text-sm text-gray-600">Paragraphs</div>
                    </div>
                    <div class="p-4 bg-gray-100 rounded text-center">
                        <div class="text-2xl font-bold text-green-600">${this.stats.syllables}</div>
                        <div class="text-sm text-gray-600">Syllables</div>
                    </div>
                    <div class="p-4 bg-gray-100 rounded text-center">
                        <div class="text-2xl font-bold text-purple-600">${this.stats.readingTime} min</div>
                        <div class="text-sm text-gray-600">Reading Time</div>
                    </div>
                    <div class="p-4 bg-gray-100 rounded text-center">
                        <div class="text-2xl font-bold text-purple-600">${this.stats.speakingTime} min</div>
                        <div class="text-sm text-gray-600">Speaking Time</div>
                    </div>
                    <div class="p-4 bg-gray-100 rounded text-center">
                        <div class="text-2xl font-bold text-orange-600">${this.stats.fleschScore.toFixed(1)}</div>
                        <div class="text-sm text-gray-600">Readability Score</div>
                    </div>
                </div>

                ${this.stats.words > 0 ? html`
                    <div class="p-4 bg-blue-50 rounded border border-blue-200">
                        <div class="font-semibold text-blue-900">Readability Level</div>
                        <div class="text-blue-700">${this.getReadabilityLevel(this.stats.fleschScore)}</div>
                        <div class="text-sm text-blue-600 mt-2">
                            Based on Flesch Reading Ease score. Higher scores indicate easier readability.
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'text-statistics-analyzer': TextStatisticsAnalyzer;
    }
}

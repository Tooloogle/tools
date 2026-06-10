import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import loremIpsumGeneratorStyles from './lorem-ipsum-generator.css.js';
import { customElement, state } from 'lit/decorators.js';
import '../t-copy-button/index.js';

const loremWords = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation',
  'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat',
  'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit', 'esse',
  'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat',
  'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt',
  'mollit', 'anim', 'id', 'est', 'laborum'
];

const CANONICAL_OPENING = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

@customElement('lorem-ipsum-generator')
export class LoremIpsumGenerator extends WebComponentBase {
    static override styles = [WebComponentBase.styles, loremIpsumGeneratorStyles];

    @state() private paragraphCount = 3;
    @state() private paragraphs: string[] = [];

    override connectedCallback() {
        super.connectedCallback();
        this.generate();
    }

    private generate() {
        const result: string[] = [];

        for (let i = 0; i < this.paragraphCount; i++) {
            if (i === 0) {
                const extraSentences = this.generateSentences(Math.floor(Math.random() * 3) + 2);
                result.push(`${CANONICAL_OPENING} ${extraSentences}`);
            } else {
                const sentenceCount = Math.floor(Math.random() * 3) + 3;
                result.push(this.generateSentences(sentenceCount));
            }
        }

        this.paragraphs = result;
    }

    private generateSentences(count: number): string {
        const sentences: string[] = [];

        for (let j = 0; j < count; j++) {
            const wordCount = Math.floor(Math.random() * 10) + 5;
            const words: string[] = [];

            for (let k = 0; k < wordCount; k++) {
                words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
            }

            const sentence = words.join(' ');
            sentences.push(`${sentence.charAt(0).toUpperCase()}${sentence.slice(1)}.`);
        }

        return sentences.join(' ');
    }

    private getText(): string {
        return this.paragraphs.join('\n\n');
    }

    private handleCountChange(e: Event) {
        const value = Number((e.target as HTMLInputElement).value);
        this.paragraphCount = Math.max(1, Math.min(100, value));
        this.generate();
    }

    override render() {
        return html`
            <div class="space-y-4">
                <div class="flex items-end gap-4">
                    <label class="block flex-1">
                        <span class="block mb-2 font-semibold">Paragraphs</span>
                        <input
                            class="form-input text-end"
                            type="number"
                            min="1"
                            max="100"
                            .value=${String(this.paragraphCount)}
                            @input=${this.handleCountChange}
                        />
                    </label>
                    <button class="btn btn-blue" @click=${this.generate}>Regenerate</button>
                </div>

                <div class="relative">
                    <div class="absolute top-2 right-4">
                        <t-copy-button .text=${this.getText()}></t-copy-button>
                    </div>
                    <div class="p-4 pr-12 border border-gray-200 dark:border-gray-700 rounded max-h-96 overflow-auto text-sm leading-relaxed">
                        ${this.paragraphs.map(p => html`<p class="mb-3 last:mb-0">${p}</p>`)}
                    </div>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'lorem-ipsum-generator': LoremIpsumGenerator;
    }
}

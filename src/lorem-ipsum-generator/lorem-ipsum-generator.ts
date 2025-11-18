import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import loremIpsumGeneratorStyles from './lorem-ipsum-generator.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import '../t-copy-button/t-copy-button.js';

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

@customElement('lorem-ipsum-generator')
export class LoremIpsumGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, loremIpsumGeneratorStyles];

    @property()
    paragraphs = 3;

    @property()
    text = '';

    connectedCallback() {
        super.connectedCallback();
        this.generate();
    }

    generate() {
        const result: string[] = [];
        for (let i = 0; i < this.paragraphs; i++) {
            const sentenceCount = Math.floor(Math.random() * 3) + 3; // 3-5 sentences
            const sentences: string[] = [];
            
            for (let j = 0; j < sentenceCount; j++) {
                const wordCount = Math.floor(Math.random() * 10) + 5; // 5-14 words
                const words: string[] = [];
                
                for (let k = 0; k < wordCount; k++) {
                    words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
                }
                
                let sentence = words.join(' ');
                sentence = `${sentence.charAt(0).toUpperCase()}${sentence.slice(1)}.`;
                sentences.push(sentence);
            }
            
            result.push(sentences.join(' '));
        }
        
        this.text = result.join('\n\n');
    }

    private handleParagraphsChange(e: Event) {
        const value = Number((e.target as HTMLInputElement).value);
        this.paragraphs = Math.max(1, Math.min(100, value));
    }

    override render() {
        return html`
            <label class="block">
                <span class="inline-block py-1">Number of Paragraphs</span>
                <input
                    class="form-input text-end"
                    type="number"
                    min="1"
                    max="100"
                    .value=${String(this.paragraphs)}
                    @input=${this.handleParagraphsChange}
                />
            </label>
            
            <div class="py-2 text-right">
                <button class="btn btn-blue" @click=${this.generate}>Generate</button>
                <t-copy-button .isIcon=${false} .text=${this.text}></t-copy-button>
            </div>

            <div class="py-2">
                <textarea
                    class="form-textarea"
                    rows="10"
                    readonly
                    .value=${this.text}
                ></textarea>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'lorem-ipsum-generator': LoremIpsumGenerator;
    }
}

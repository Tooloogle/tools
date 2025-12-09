import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import loremIpsumGeneratorStyles from './lorem-ipsum-generator.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-input';
import '../t-button';
import '../t-textarea';
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
    static override styles = [WebComponentBase.styles, loremIpsumGeneratorStyles];

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

    private handleParagraphsChange(e: CustomEvent) {
        const value = Number(e.detail.value);
        this.paragraphs = Math.max(1, Math.min(100, value));
    }

    override render() {
        return html`
            <label class="block">
                <span class="inline-block py-1">Number of Paragraphs</span>
                <t-input
                    class="text-end"
                    type="number"
                    .value=${String(this.paragraphs)}
                    @t-input=${this.handleParagraphsChange}
                ></t-input>
            </label>
            
            <div class="py-2 text-right">
                <t-button variant="blue" @click=${this.generate}>Generate</t-button>
                <t-copy-button .isIcon=${false} .text=${this.text}></t-copy-button>
            </div>

            <div class="py-2">
                <t-textarea
                    rows="10"
                    ?readonly=${true}
                    .value=${this.text}
                ></t-textarea>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'lorem-ipsum-generator': LoremIpsumGenerator;
    }
}

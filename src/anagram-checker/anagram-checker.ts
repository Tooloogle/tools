import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import anagramCheckerStyles from './anagram-checker.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-input';

@customElement('anagram-checker')
export class AnagramChecker extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, anagramCheckerStyles];

    @property({ type: String }) text1 = '';
    @property({ type: String }) text2 = '';
    @property({ type: Boolean }) isAnagram = false;
    @property({ type: Boolean }) hasInput = false;

    private handleInput() {
        this.hasInput = this.text1.trim().length > 0 && this.text2.trim().length > 0;
        if (this.hasInput) {
            this.checkAnagram();
        }
    }

    private checkAnagram() {
        const sort = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '').split('').sort().join('');
        this.isAnagram = sort(this.text1) === sort(this.text2);
    }

    override render() {
        return html`
            <div class="space-y-4">
                <div>
                    <label class="block mb-2 font-semibold">First Word/Phrase:</label>
                    <t-input placeholder="Enter first word or phrase..." class="w-full"></t-input> { this.text1 = e.detail.value; this.handleInput(); }}
                    />
                </div>
                <div>
                    <label class="block mb-2 font-semibold">Second Word/Phrase:</label>
                    <t-input placeholder="Enter second word or phrase..." class="w-full"></t-input> { this.text2 = e.detail.value; this.handleInput(); }}
                    />
                </div>
                ${this.hasInput ? html`
                    <div class="p-4 rounded ${this.isAnagram ? 'bg-green-100' : 'bg-red-100'}">
                        <p class="text-lg font-bold ${this.isAnagram ? 'text-green-700' : 'text-red-700'}">
                            ${this.isAnagram ? '✓ These are anagrams!' : '✗ These are not anagrams.'}
                        </p>
                    </div>
                ` : ''}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'anagram-checker': AnagramChecker;
    }
}

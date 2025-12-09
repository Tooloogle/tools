import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import palindromeCheckerStyles from './palindrome-checker.css.js';
import { customElement, property } from 'lit/decorators.js';

@customElement('palindrome-checker')
export class PalindromeChecker extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, palindromeCheckerStyles];

    @property({ type: String }) inputText = '';
    @property({ type: Boolean }) isPalindrome = false;
    @property({ type: Boolean }) hasInput = false;

    private handleInput(e: CustomEvent) {
        this.inputText = e.detail.value;
        this.hasInput = this.inputText.trim().length > 0;
        if (this.hasInput) {
            this.checkPalindrome();
        }
    }

    private checkPalindrome() {
        const cleaned = this.inputText.toLowerCase().replace(/[^a-z0-9]/g, '');
        this.isPalindrome = cleaned === cleaned.split('').reverse().join('');
    }

    override render() {
        return html`
            <div class="space-y-4">
                <div>
                    <label class="block mb-2 font-semibold">Enter Text:</label>
                    <t-input placeholder="Enter text to check if it's a palindrome..." class="w-full"></t-input>
                </div>
                ${this.hasInput ? html`
                    <div class="p-4 rounded ${this.isPalindrome ? 'bg-green-100' : 'bg-red-100'}">
                        <p class="text-lg font-bold ${this.isPalindrome ? 'text-green-700' : 'text-red-700'}">
                            ${this.isPalindrome ? '✓ This is a palindrome!' : '✗ This is not a palindrome.'}
                        </p>
                    </div>
                ` : ''}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'palindrome-checker': PalindromeChecker;
    }
}

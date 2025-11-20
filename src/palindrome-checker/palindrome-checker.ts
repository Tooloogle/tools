import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import palindromeCheckerStyles from './palindrome-checker.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';

@customElement('palindrome-checker')
export class PalindromeChecker extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, palindromeCheckerStyles];

    @property({ type: String }) inputText = '';
    @property({ type: Boolean }) isPalindrome = false;
    @property({ type: Boolean }) hasInput = false;

    private handleInput(e: Event) {
        this.inputText = (e.target as HTMLInputElement).value;
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
                    <input
                        type="text"
                        class="form-input w-full"
                        placeholder="Enter text to check if it's a palindrome..."
                        .value=${this.inputText}
                        @input=${this.handleInput}
                    />
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

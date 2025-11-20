import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import securePasswordTesterStyles from './secure-password-tester.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';

@customElement('secure-password-tester')
export class SecurePasswordTester extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, securePasswordTesterStyles];

    @property({ type: String }) password = '';
    @property({ type: Object }) strength = { score: 0, level: '', feedback: [] as string[] };

    private handleInput(e: Event) {
        this.password = (e.target as HTMLInputElement).value;
        this.testStrength();
    }

    private testStrength() {
        if (!this.password) {
            this.strength = { score: 0, level: '', feedback: [] };
            return;
        }

        const checks = {
            length: this.password.length >= 12,
            uppercase: /[A-Z]/.test(this.password),
            lowercase: /[a-z]/.test(this.password),
            numbers: /[0-9]/.test(this.password),
            special: /[^A-Za-z0-9]/.test(this.password),
        };

        const score = Object.values(checks).filter(Boolean).length;
        const entropy = this.password.length * Math.log2(this.getCharsetSize());

        const feedback: string[] = [];
        if (!checks.length) feedback.push('✗ At least 12 characters');
        if (!checks.uppercase) feedback.push('✗ Uppercase letters (A-Z)');
        if (!checks.lowercase) feedback.push('✗ Lowercase letters (a-z)');
        if (!checks.numbers) feedback.push('✗ Numbers (0-9)');
        if (!checks.special) feedback.push('✗ Special characters (!@#$%^&*)');

        let level = 'Weak';
        if (score >= 5 && entropy > 60) level = 'Very Strong';
        else if (score >= 4 && entropy > 50) level = 'Strong';
        else if (score >= 3 && entropy > 40) level = 'Good';
        else if (score >= 2) level = 'Fair';

        this.strength = { score, level, feedback };
    }

    private getCharsetSize(): number {
        let size = 0;
        if (/[a-z]/.test(this.password)) size += 26;
        if (/[A-Z]/.test(this.password)) size += 26;
        if (/[0-9]/.test(this.password)) size += 10;
        if (/[^A-Za-z0-9]/.test(this.password)) size += 32;
        return size || 1;
    }

    private getStrengthColor(): string {
        switch (this.strength.level) {
            case 'Very Strong': return 'bg-green-500';
            case 'Strong': return 'bg-green-400';
            case 'Good': return 'bg-yellow-400';
            case 'Fair': return 'bg-orange-400';
            default: return 'bg-red-400';
        }
    }

    override render() {
        return html`
            <div class="space-y-4">
                <div>
                    <label class="block mb-2 font-semibold">Test Password Strength:</label>
                    <input
                        type="password"
                        class="form-input w-full"
                        placeholder="Enter password to test..."
                        .value=${this.password}
                        @input=${this.handleInput}
                    />
                </div>
                ${this.password ? html`
                    <div class="border rounded p-4 space-y-3">
                        <div>
                            <div class="flex justify-between mb-2">
                                <span class="font-semibold">Strength:</span>
                                <span class="font-bold">${this.strength.level}</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded h-3">
                                <div class="${this.getStrengthColor()} h-3 rounded transition-all" 
                                     style="width: ${(this.strength.score / 5) * 100}%"></div>
                            </div>
                        </div>
                        <div>
                            <div class="font-semibold mb-2">Requirements:</div>
                            <ul class="space-y-1 text-sm">
                                ${this.strength.feedback.map(f => html`<li class="text-red-600">${f}</li>`)}
                                ${this.strength.score >= 5 ? html`<li class="text-green-600">✓ All criteria met!</li>` : ''}
                            </ul>
                        </div>
                    </div>
                ` : html`
                    <div class="text-sm text-gray-600">
                        Enter a password to test its strength. Strong passwords should have at least 12 characters 
                        and include uppercase, lowercase, numbers, and special characters.
                    </div>
                `}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'secure-password-tester': SecurePasswordTester;
    }
}

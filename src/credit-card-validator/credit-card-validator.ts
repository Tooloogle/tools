import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import creditCardValidatorStyles from './credit-card-validator.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-button/t-button.js';
import '../t-input/t-input.js';

@customElement('credit-card-validator')
export class CreditCardValidator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, creditCardValidatorStyles];

    @property()
    cardNumber = '';

    @property()
    isValid = false;

    @property()
    cardType = '';

    @property()
    validated = false;

    private handleInputChange(e: CustomEvent) {
        this.cardNumber = e.detail.value.replace(/\s/g, '');
        this.validated = false;
    }

    private luhnCheck(num: string): boolean {
        let sum = 0;
        let isEven = false;
        
        for (let i = num.length - 1; i >= 0; i--) {
            let digit = parseInt(num[i]);
            
            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            
            sum += digit;
            isEven = !isEven;
        }
        
        return sum % 10 === 0;
    }

    private detectCardType(num: string): string {
        // Visa
        if (/^4/.test(num)) {
            return 'Visa';
        }

        // Mastercard
        if (/^5[1-5]/.test(num) || /^2[2-7]/.test(num)) {
            return 'Mastercard';
        }

        // American Express
        if (/^3[47]/.test(num)) {
            return 'American Express';
        }

        // Discover
        if (/^6(?:011|5)/.test(num)) {
            return 'Discover';
        }

        // Diners Club
        if (/^3(?:0[0-5]|[68])/.test(num)) {
            return 'Diners Club';
        }

        // JCB
        if (/^35/.test(num)) {
            return 'JCB';
        }
        
        return 'Unknown';
    }

    private validate() {
        this.validated = true;
        
        if (!/^\d+$/.test(this.cardNumber)) {
            this.isValid = false;
            this.cardType = '';
            return;
        }
        
        if (this.cardNumber.length < 13 || this.cardNumber.length > 19) {
            this.isValid = false;
            this.cardType = '';
            return;
        }
        
        this.isValid = this.luhnCheck(this.cardNumber);
        this.cardType = this.detectCardType(this.cardNumber);
    }

    private clear() {
        this.cardNumber = '';
        this.isValid = false;
        this.cardType = '';
        this.validated = false;
    }

    override render() {
        return html`
            <label class="block py-1">
                <span class="inline-block py-1 font-bold">Card Number:</span>
                <t-input placeholder="Enter card number (spaces allowed)..."></t-input>
            </label>

            <div class="py-2 flex flex-wrap gap-2">
                <t-button variant="blue" @click=${this.validate}>Validate</t-button>
                <t-button variant="red" @click=${this.clear}>Clear</t-button>
            </div>

            ${this.validated ? html`
                <div class="py-2">
                    ${this.isValid ? html`
                        <div class="p-3 bg-green-100 text-green-800 rounded">
                            <p class="font-bold">✓ Valid Card Number</p>
                            <p class="mt-1"><strong>Card Type:</strong> ${this.cardType}</p>
                            <p class="mt-1"><strong>Length:</strong> ${this.cardNumber.length} digits</p>
                        </div>
                    ` : html`
                        <div class="p-3 bg-red-100 text-red-800 rounded">
                            <p class="font-bold">✗ Invalid Card Number</p>
                            <p class="mt-1">The card number failed the Luhn algorithm check.</p>
                        </div>
                    `}
                </div>
            ` : ''}

            <div class="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded text-sm">
                <p class="font-bold">⚠️ Disclaimer:</p>
                <p class="mt-1">This tool validates card number format using the Luhn algorithm. It does NOT verify if the card exists, is active, or has funds. Never use this tool with real card numbers for security testing.</p>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'credit-card-validator': CreditCardValidator;
    }
}

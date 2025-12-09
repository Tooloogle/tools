import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import currencyFormatterStyles from './currency-formatter.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-input';
import '../t-select';

@customElement('currency-formatter')
export class CurrencyFormatter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, currencyFormatterStyles];

    @property()
    amount = '';

    @property()
    currency = 'USD';

    @property()
    locale = 'en-US';

    @property()
    formatted = '';

    private handleAmountChange(e: CustomEvent) {
        this.amount = e.detail.value;
        this.formatCurrency();
    }

    private handleCurrencyChange(e: CustomEvent) {
        this.currency = e.detail.value;
        this.formatCurrency();
    }

    private handleLocaleChange(e: CustomEvent) {
        this.locale = e.detail.value;
        this.formatCurrency();
    }

    private formatCurrency() {
        const num = parseFloat(this.amount);
        if (isNaN(num)) {
            this.formatted = '';
            return;
        }

        try {
            this.formatted = new Intl.NumberFormat(this.locale, {
                style: 'currency',
                currency: this.currency
            }).format(num);
        } catch (e) {
            this.formatted = 'Error formatting currency';
        }
    }

    // TODO: Refactor render method to be under 50 lines by extracting sub-components
    // eslint-disable-next-line max-lines-per-function
    override render() {
        return html`
            <div class="space-y-4 py-2">
                <label class="block">
                    <span class="inline-block py-1 font-bold">Amount:</span>
                    <t-input type="number" placeholder="Enter amount..."></t-input>
                </label>

                <div class="grid grid-cols-2 gap-4">
                    <label class="block">
                        <span class="inline-block py-1 font-bold">Currency:</span>
                        <t-select .value=${String(this.currency)} @t-change=${this.handleCurrencyChange}>
                            <option value="USD">USD - US Dollar</option>
                            <option value="EUR">EUR - Euro</option>
                            <option value="GBP">GBP - British Pound</option>
                            <option value="JPY">JPY - Japanese Yen</option>
                            <option value="CNY">CNY - Chinese Yuan</option>
                            <option value="INR">INR - Indian Rupee</option>
                            <option value="AUD">AUD - Australian Dollar</option>
                            <option value="CAD">CAD - Canadian Dollar</option>
                            <option value="CHF">CHF - Swiss Franc</option>
                            <option value="SEK">SEK - Swedish Krona</option>
                            <option value="NZD">NZD - New Zealand Dollar</option>
                        </t-select>
                    </label>

                    <label class="block">
                        <span class="inline-block py-1 font-bold">Locale:</span>
                        <t-select .value=${String(this.locale)} @t-change=${this.handleLocaleChange}>
                            <option value="en-US">English (US)</option>
                            <option value="en-GB">English (UK)</option>
                            <option value="de-DE">German (Germany)</option>
                            <option value="fr-FR">French (France)</option>
                            <option value="es-ES">Spanish (Spain)</option>
                            <option value="it-IT">Italian (Italy)</option>
                            <option value="ja-JP">Japanese (Japan)</option>
                            <option value="zh-CN">Chinese (China)</option>
                            <option value="hi-IN">Hindi (India)</option>
                        </t-select>
                    </label>
                </div>

                ${this.formatted ? html`
                    <div class="p-4 bg-green-50 rounded">
                        <p class="font-bold">Formatted Currency:</p>
                        <p class="text-2xl mt-2">${this.formatted}</p>
                    </div>
                ` : ''}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'currency-formatter': CurrencyFormatter;
    }
}

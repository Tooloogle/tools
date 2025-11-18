import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import currencyFormatterStyles from './currency-formatter.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';

@customElement('currency-formatter')
export class CurrencyFormatter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, currencyFormatterStyles];

    @property()
    amount = '';

    @property()
    currency = 'USD';

    @property()
    locale = 'en-US';

    @property()
    formatted = '';

    private handleAmountChange(e: Event) {
        this.amount = (e.target as HTMLInputElement).value;
        this.formatCurrency();
    }

    private handleCurrencyChange(e: Event) {
        this.currency = (e.target as HTMLSelectElement).value;
        this.formatCurrency();
    }

    private handleLocaleChange(e: Event) {
        this.locale = (e.target as HTMLSelectElement).value;
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

    override render() {
        return html`
            <div class="space-y-4 py-2">
                <label class="block">
                    <span class="inline-block py-1 font-bold">Amount:</span>
                    <input
                        type="number"
                        class="form-input"
                        placeholder="Enter amount..."
                        step="0.01"
                        autofocus
                        .value=${this.amount}
                        @input=${this.handleAmountChange}
                    />
                </label>

                <div class="grid grid-cols-2 gap-4">
                    <label class="block">
                        <span class="inline-block py-1 font-bold">Currency:</span>
                        <select
                            class="form-select"
                            .value=${this.currency}
                            @change=${this.handleCurrencyChange}
                        >
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
                        </select>
                    </label>

                    <label class="block">
                        <span class="inline-block py-1 font-bold">Locale:</span>
                        <select
                            class="form-select"
                            .value=${this.locale}
                            @change=${this.handleLocaleChange}
                        >
                            <option value="en-US">English (US)</option>
                            <option value="en-GB">English (UK)</option>
                            <option value="de-DE">German (Germany)</option>
                            <option value="fr-FR">French (France)</option>
                            <option value="es-ES">Spanish (Spain)</option>
                            <option value="it-IT">Italian (Italy)</option>
                            <option value="ja-JP">Japanese (Japan)</option>
                            <option value="zh-CN">Chinese (China)</option>
                            <option value="hi-IN">Hindi (India)</option>
                        </select>
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

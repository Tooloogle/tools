import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import temperatureConverterStyles from './temperature-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';

@customElement('temperature-converter')
export class TemperatureConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, temperatureConverterStyles];

    @property()
    c = 0;

    @property()
    f = 32;

    @property()
    k = 273.15;

    onCelsiusChange(e: any) {
        this.c = parseFloat(e.target?.value);
        if (isNaN(this.c)) {
            return;
        }

        this.f = this.c * 9 / 5 + 32;
        this.k = this.c + 273.15;
    }

    onFahrenheitChange(e: any) {
        this.f = parseFloat(e.target?.value);
        if (isNaN(this.f)) {
            return;
        }

        this.c = (this.f - 32) * 5 / 9;
        this.k = (this.f + 459.67) * 5 / 9;

    }

    onKelvinChange(e: any) {
        this.k = parseFloat(e.target?.value);
        if (isNaN(this.k)) {
            return;
        }

        this.c = this.k - 273.15;
        this.f = this.k * 9 / 5 - 459.67;

    }

    toNumber(num: number) {
        return parseFloat(num.toFixed(2))
    }

    override render() {
        return html`
            <lable class="block">
                <span class="inline-block py-1">Degree Celsius</span>
                <input
                    name="email"
                    class="form-input text-center"
                    autofocus
                    placeholder="Enter email to validate"
                    .value=${this.toNumber(this.c)}
                    @keyup=${this.onCelsiusChange}
                    />
            </lable>

            <lable class="block">
                <span class="inline-block py-1">Fahrenheit</span>
                <input
                    name="email"
                    class="form-input text-center"
                    autofocus
                    placeholder="Enter email to validate"
                    .value=${this.toNumber(this.f)}
                    @keyup=${this.onFahrenheitChange}
                    />
            </lable>

            <lable class="block">
                <span class="inline-block py-1">Kelvin</span>
                <input
                    name="email"
                    class="form-input text-center"
                    autofocus
                    placeholder="Enter email to validate"
                    .value=${this.toNumber(this.k)}
                    @keyup=${this.onKelvinChange}
                    />
            </lable>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'temperature-converter': TemperatureConverter;
    }
}

import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import unitConverterStyles from './unit-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';

interface ConversionUnit {
    name: string;
    toBase: (value: number) => number;
    fromBase: (value: number) => number;
}

interface UnitCategory {
    name: string;
    units: { [key: string]: ConversionUnit };
}

@customElement('unit-converter')
export class UnitConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, unitConverterStyles];

    @property({ type: Number }) inputValue = 1;
    @property({ type: String }) fromUnit = 'meter';
    @property({ type: String }) toUnit = 'foot';
    @property({ type: String }) category = 'length';
    @property({ type: String }) result = '';

    private categories: { [key: string]: UnitCategory } = {
        length: {
            name: 'Length',
            units: {
                meter: { name: 'Meter (m)', toBase: (v) => v, fromBase: (v) => v },
                kilometer: { name: 'Kilometer (km)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
                centimeter: { name: 'Centimeter (cm)', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
                millimeter: { name: 'Millimeter (mm)', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
                mile: { name: 'Mile (mi)', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
                yard: { name: 'Yard (yd)', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
                foot: { name: 'Foot (ft)', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
                inch: { name: 'Inch (in)', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
            }
        },
        weight: {
            name: 'Weight/Mass',
            units: {
                kilogram: { name: 'Kilogram (kg)', toBase: (v) => v, fromBase: (v) => v },
                gram: { name: 'Gram (g)', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
                milligram: { name: 'Milligram (mg)', toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
                ton: { name: 'Metric Ton (t)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
                pound: { name: 'Pound (lb)', toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
                ounce: { name: 'Ounce (oz)', toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
            }
        },
        temperature: {
            name: 'Temperature',
            units: {
                celsius: { name: 'Celsius (°C)', toBase: (v) => v, fromBase: (v) => v },
                fahrenheit: { name: 'Fahrenheit (°F)', toBase: (v) => (v - 32) * 5/9, fromBase: (v) => v * 9/5 + 32 },
                kelvin: { name: 'Kelvin (K)', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
            }
        },
        volume: {
            name: 'Volume',
            units: {
                liter: { name: 'Liter (L)', toBase: (v) => v, fromBase: (v) => v },
                milliliter: { name: 'Milliliter (mL)', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
                gallon: { name: 'Gallon (US)', toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
                quart: { name: 'Quart (US)', toBase: (v) => v * 0.946353, fromBase: (v) => v / 0.946353 },
                pint: { name: 'Pint (US)', toBase: (v) => v * 0.473176, fromBase: (v) => v / 0.473176 },
                cup: { name: 'Cup (US)', toBase: (v) => v * 0.236588, fromBase: (v) => v / 0.236588 },
                fluidounce: { name: 'Fluid Ounce (US)', toBase: (v) => v * 0.0295735, fromBase: (v) => v / 0.0295735 },
            }
        },
        time: {
            name: 'Time',
            units: {
                second: { name: 'Second (s)', toBase: (v) => v, fromBase: (v) => v },
                minute: { name: 'Minute (min)', toBase: (v) => v * 60, fromBase: (v) => v / 60 },
                hour: { name: 'Hour (h)', toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
                day: { name: 'Day (d)', toBase: (v) => v * 86400, fromBase: (v) => v / 86400 },
                week: { name: 'Week (wk)', toBase: (v) => v * 604800, fromBase: (v) => v / 604800 },
                year: { name: 'Year (yr)', toBase: (v) => v * 31536000, fromBase: (v) => v / 31536000 },
            }
        },
        speed: {
            name: 'Speed',
            units: {
                mps: { name: 'Meters/second (m/s)', toBase: (v) => v, fromBase: (v) => v },
                kph: { name: 'Kilometers/hour (km/h)', toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
                mph: { name: 'Miles/hour (mph)', toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
                knot: { name: 'Knot (kn)', toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 },
            }
        }
    };

    connectedCallback() {
        super.connectedCallback();
        this.convert();
    }

    private convert() {
        if (!this.inputValue && this.inputValue !== 0) {
            this.result = '';
            return;
        }

        const categoryUnits = this.categories[this.category]?.units;
        if (!categoryUnits) {
            this.result = 'Invalid category';
            return;
        }

        const fromUnitDef = categoryUnits[this.fromUnit];
        const toUnitDef = categoryUnits[this.toUnit];

        if (!fromUnitDef || !toUnitDef) {
            this.result = 'Invalid units';
            return;
        }

        const baseValue = fromUnitDef.toBase(this.inputValue);
        const resultValue = toUnitDef.fromBase(baseValue);
        
        this.result = `${resultValue.toFixed(6)} ${toUnitDef.name.match(/\(([^)]+)\)/)?.[1] || this.toUnit}`;
    }

    private handleCategoryChange(e: Event) {
        this.category = (e.target as HTMLSelectElement).value;
        const firstUnit = Object.keys(this.categories[this.category].units)[0];
        const secondUnit = Object.keys(this.categories[this.category].units)[1] || firstUnit;
        this.fromUnit = firstUnit;
        this.toUnit = secondUnit;
        this.convert();
    }

    private handleValueInput(e: Event) {
        this.inputValue = Number((e.target as HTMLInputElement).value);
        this.convert();
    }

    private handleFromUnitChange(e: Event) {
        this.fromUnit = (e.target as HTMLSelectElement).value;
        this.convert();
    }

    private handleToUnitChange(e: Event) {
        this.toUnit = (e.target as HTMLSelectElement).value;
        this.convert();
    }

    private renderCategoryOptions() {
        return Object.entries(this.categories).map(([key, cat]) => html`
            <option value="${key}">${cat.name}</option>
        `);
    }

    private renderUnitOptions(units: { [key: string]: ConversionUnit }) {
        return Object.entries(units).map(([key, unit]) => html`
            <option value="${key}">${unit.name}</option>
        `);
    }

    override render() {
        const categoryUnits = this.categories[this.category]?.units || {};
        const categoryOptions = this.renderCategoryOptions();
        const fromUnitOptions = this.renderUnitOptions(categoryUnits);
        const toUnitOptions = this.renderUnitOptions(categoryUnits);
        
        return html`
            <div class="space-y-4">
                <div>
                    <label class="block mb-2 font-semibold">Category:</label>
                    <select class="form-input w-full" .value=${this.category} @change=${this.handleCategoryChange}>
                        ${categoryOptions}
                    </select>
                </div>
                <div>
                    <label class="block mb-2 font-semibold">Value:</label>
                    <input
                        type="number"
                        step="any"
                        class="form-input w-full"
                        .value=${String(this.inputValue)}
                        @input=${this.handleValueInput}
                    />
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block mb-2 font-semibold">From:</label>
                        <select class="form-input w-full" .value=${this.fromUnit} @change=${this.handleFromUnitChange}>
                            ${fromUnitOptions}
                        </select>
                    </div>
                    <div>
                        <label class="block mb-2 font-semibold">To:</label>
                        <select class="form-input w-full" .value=${this.toUnit} @change=${this.handleToUnitChange}>
                            ${toUnitOptions}
                        </select>
                    </div>
                </div>
                <div class="bg-blue-50 p-4 rounded-lg">
                    <div class="text-sm text-gray-600 mb-1">Result:</div>
                    <div class="text-2xl font-bold text-blue-600">${this.result}</div>
                    ${this.result ? html`<t-copy-button .text=${this.result}></t-copy-button>` : ''}
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'unit-converter': UnitConverter;
    }
}

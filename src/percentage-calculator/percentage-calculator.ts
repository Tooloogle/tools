import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import percentageCalculatorStyles from './percentage-calculator.css.js';
import { customElement, state } from 'lit/decorators.js';
import '../t-copy-button/t-copy-button.js';

type Tone = 'neutral' | 'positive' | 'negative';

type FieldKey =
    | 'c1Percent' | 'c1Value'
    | 'c2X' | 'c2Y'
    | 'c3From' | 'c3To'
    | 'c4X' | 'c4Percent'
    | 'c5A' | 'c5B';

interface PanelResult {
    text: string;
    tone: Tone;
    subtitle?: string;
}

interface PanelField {
    label: string;
    placeholder: string;
    key: FieldKey;
}

interface PanelConfig {
    id: number;
    title: string;
    formula: string;
    fields: PanelField[];
    result: PanelResult;
}

const EMPTY: PanelResult = { text: '—', tone: 'neutral' };

const TONE_BG: Record<Tone, string> = {
    neutral: 'bg-gray-100 dark:bg-gray-700',
    positive: 'bg-green-100 dark:bg-green-900/30',
    negative: 'bg-red-100 dark:bg-red-900/30',
};

const PANEL_META: Array<Omit<PanelConfig, 'result'>> = [
    {
        id: 1,
        title: 'What is X% of Y?',
        formula: 'X ÷ 100 × Y',
        fields: [
            { label: 'Percentage (%)', placeholder: '10', key: 'c1Percent' },
            { label: 'Of Value', placeholder: '200', key: 'c1Value' },
        ],
    },
    {
        id: 2,
        title: 'X is what % of Y?',
        formula: 'X ÷ Y × 100',
        fields: [
            { label: 'Value X', placeholder: '25', key: 'c2X' },
            { label: 'Of Value Y', placeholder: '200', key: 'c2Y' },
        ],
    },
    {
        id: 3,
        title: '% Change from X to Y',
        formula: '(Y − X) ÷ X × 100',
        fields: [
            { label: 'From Value', placeholder: '80', key: 'c3From' },
            { label: 'To Value', placeholder: '100', key: 'c3To' },
        ],
    },
    {
        id: 4,
        title: 'X is Y% of what?',
        formula: 'X ÷ (Y ÷ 100)',
        fields: [
            { label: 'Value X', placeholder: '25', key: 'c4X' },
            { label: 'Percentage (%)', placeholder: '50', key: 'c4Percent' },
        ],
    },
    {
        id: 5,
        title: '% Difference between X and Y',
        formula: '|X − Y| ÷ |(X + Y) ÷ 2| × 100',
        fields: [
            { label: 'Value X', placeholder: '40', key: 'c5A' },
            { label: 'Value Y', placeholder: '60', key: 'c5B' },
        ],
    },
];

@customElement('percentage-calculator')
export class PercentageCalculator extends WebComponentBase {
    static override styles = [WebComponentBase.styles, percentageCalculatorStyles];

    // Calc 1: What is X% of Y?
    @state() private c1Percent = '';
    @state() private c1Value = '';

    // Calc 2: X is what % of Y?
    @state() private c2X = '';
    @state() private c2Y = '';

    // Calc 3: % change from X to Y
    @state() private c3From = '';
    @state() private c3To = '';

    // Calc 4: X is Y% of what?
    @state() private c4X = '';
    @state() private c4Percent = '';

    // Calc 5: % difference between X and Y
    @state() private c5A = '';
    @state() private c5B = '';

    private parse(value: string): number | null {
        if (value.trim() === '') {
            return null;
        }

        const num = Number(value);

        if (!Number.isFinite(num)) {
            return null;
        }

        return num;
    }

    private fmt(n: number): string {
        return String(Math.round(n * 1e6) / 1e6);
    }

    private setField(key: FieldKey, value: string) {
        this[key] = value;
    }

    private getResult1(): PanelResult {
        const pct = this.parse(this.c1Percent);
        const val = this.parse(this.c1Value);

        if (pct === null || val === null) {
            return EMPTY;
        }

        return { text: this.fmt((pct / 100) * val), tone: 'neutral' };
    }

    private getResult2(): PanelResult {
        const x = this.parse(this.c2X);
        const y = this.parse(this.c2Y);

        if (x === null || y === null || y === 0) {
            return EMPTY;
        }

        return { text: `${this.fmt((x / y) * 100)}%`, tone: 'neutral' };
    }

    private getResult3(): PanelResult {
        const from = this.parse(this.c3From);
        const to = this.parse(this.c3To);

        if (from === null || to === null || from === 0) {
            return EMPTY;
        }

        // Round first, then pick the tone/label from the value the user actually
        // sees — otherwise a tiny change like 0.0000001% renders as "+0%" yet is
        // still labelled "Increase".
        const display = this.fmt(((to - from) / from) * 100);
        const rounded = Number(display);

        if (rounded > 0) {
            return { text: `+${display}%`, tone: 'positive', subtitle: 'Increase' };
        }

        if (rounded < 0) {
            return { text: `${display}%`, tone: 'negative', subtitle: 'Decrease' };
        }

        return { text: '0%', tone: 'neutral', subtitle: 'No change' };
    }

    private getResult4(): PanelResult {
        const x = this.parse(this.c4X);
        const pct = this.parse(this.c4Percent);

        if (x === null || pct === null || pct === 0) {
            return EMPTY;
        }

        return { text: this.fmt(x / (pct / 100)), tone: 'neutral' };
    }

    private getResult5(): PanelResult {
        const a = this.parse(this.c5A);
        const b = this.parse(this.c5B);

        if (a === null || b === null) {
            return EMPTY;
        }

        const average = (a + b) / 2;

        if (average === 0) {
            return EMPTY;
        }

        const diff = (Math.abs(a - b) / Math.abs(average)) * 100;
        return { text: `${this.fmt(diff)}%`, tone: 'neutral' };
    }

    private get panels(): PanelConfig[] {
        const results = [
            this.getResult1(),
            this.getResult2(),
            this.getResult3(),
            this.getResult4(),
            this.getResult5(),
        ];

        return PANEL_META.map((meta, index) => ({ ...meta, result: results[index] }));
    }

    private renderField(field: PanelField) {
        return html`
            <label class="block">
                <span class="text-sm">${field.label}</span>
                <input
                    class="form-input text-end"
                    type="number"
                    inputmode="decimal"
                    step="0.01"
                    placeholder=${field.placeholder}
                    .value=${this[field.key]}
                    @input=${(e: Event) =>
                        this.setField(field.key, (e.target as HTMLInputElement).value)}
                />
            </label>
        `;
    }

    private renderResult(id: number, result: PanelResult) {
        const hasResult = result.text !== '—';

        return html`
            <div
                class="mt-3 p-3 ${TONE_BG[result.tone]} rounded text-center"
                role="status"
                aria-live="polite"
            >
                <div class="text-sm text-gray-500 dark:text-gray-400">Result</div>
                <div class="flex items-center justify-center gap-2">
                    <div class="text-2xl font-bold break-all" data-testid="result-${id}">
                        ${result.text}
                    </div>
                    ${hasResult
                        ? html`<t-copy-button .text=${result.text}></t-copy-button>`
                        : ''}
                </div>
                ${result.subtitle
                    ? html`<div class="text-xs text-gray-500 dark:text-gray-400">${result.subtitle}</div>`
                    : ''}
            </div>
        `;
    }

    private renderPanel(config: PanelConfig) {
        return html`
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded">
                <h3 class="font-bold mb-1">${config.title}</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">${config.formula}</p>
                <div class="grid grid-cols-2 gap-2">
                    ${config.fields.map((field) => this.renderField(field))}
                </div>
                ${this.renderResult(config.id, config.result)}
            </div>
        `;
    }

    override render() {
        return html`
            <div class="space-y-6 text-gray-900 dark:text-gray-100">
                ${this.panels.map((panel) => this.renderPanel(panel))}

                <div class="text-xs text-gray-500 dark:text-gray-400">
                    <strong>Note:</strong> Each calculator operates independently.
                    Enter values and results update instantly.
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'percentage-calculator': PercentageCalculator;
    }
}

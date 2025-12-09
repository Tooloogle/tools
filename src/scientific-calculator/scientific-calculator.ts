import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import scientificCalculatorStyles from './scientific-calculator.css.js';
import { customElement, property } from 'lit/decorators.js';

@customElement('scientific-calculator')
export class ScientificCalculator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, scientificCalculatorStyles];

    @property({ type: String }) inputText = '';
    @property({ type: String }) outputText = '';

    private handleInput(e: CustomEvent) {
        this.inputText = e.detail.value;
        this.process();
    }

    private process() {
        if (!this.inputText) {
            this.outputText = '';
            return;
        }
        
        try {
            const expr = this.inputText
                .replace(/\^/g, '**')
                .replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)')
                .replace(/sin\(([^)]+)\)/g, 'Math.sin($1)')
                .replace(/cos\(([^)]+)\)/g, 'Math.cos($1)')
                .replace(/tan\(([^)]+)\)/g, 'Math.tan($1)')
                .replace(/log\(([^)]+)\)/g, 'Math.log10($1)')
                .replace(/ln\(([^)]+)\)/g, 'Math.log($1)')
                .replace(/abs\(([^)]+)\)/g, 'Math.abs($1)')
                .replace(/ceil\(([^)]+)\)/g, 'Math.ceil($1)')
                .replace(/floor\(([^)]+)\)/g, 'Math.floor($1)')
                .replace(/round\(([^)]+)\)/g, 'Math.round($1)')
                .replace(/\bpi\b/g, 'Math.PI')
                .replace(/\be\b/g, 'Math.E');
            
            const result = Function(`"use strict"; return (${  expr  })`)();
            this.outputText = String(result);
        } catch (error) {
            this.outputText = 'Error: Invalid expression';
        }
    }

    override render() {
        return html`
            <div class="space-y-4">
                <div>
                    <label class="block mb-2 font-semibold">Expression:</label>
                    <t-input placeholder="e.g., 2 + 3 * 4, sqrt(16), sin(pi/2)..." class="w-full"></t-input>
                </div>
                
                <div>
                    <label class="block mb-2 font-semibold">Result:</label>
                    <t-input ?readonly=${true} class="w-full text-2xl font-bold"></t-input>
                </div>
                
                <div class="text-sm text-gray-600">
                    <div class="font-semibold mb-1">Supported functions:</div>
                    <div>Operators: +, -, *, /, ^</div>
                    <div>Functions: sqrt, sin, cos, tan, log, ln, abs, ceil, floor, round</div>
                    <div>Constants: pi, e</div>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'scientific-calculator': ScientificCalculator;
    }
}

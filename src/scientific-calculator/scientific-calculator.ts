import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import scientificCalculatorStyles from './scientific-calculator.css.js';
import { customElement, property } from 'lit/decorators.js';

type TokenType = 'number' | 'operator' | 'lparen' | 'rparen' | 'func';
interface Token { type: TokenType; value: string; }

const OPERATORS: Record<string, { prec: number; assoc: 'L' | 'R'; args: 1 | 2 }> = {
    '+': { prec: 1, assoc: 'L', args: 2 },
    '-': { prec: 1, assoc: 'L', args: 2 },
    '*': { prec: 2, assoc: 'L', args: 2 },
    '/': { prec: 2, assoc: 'L', args: 2 },
    '^': { prec: 3, assoc: 'R', args: 2 },
    'u-': { prec: 4, assoc: 'R', args: 1 },
};

const FUNCTIONS: Record<string, (x: number) => number> = {
    sqrt: Math.sqrt, sin: Math.sin, cos: Math.cos, tan: Math.tan,
    log: Math.log10, ln: Math.log, abs: Math.abs,
    ceil: Math.ceil, floor: Math.floor, round: Math.round,
};

const CONSTANTS: Record<string, number> = { pi: Math.PI, e: Math.E };

function tokenize(input: string): Token[] {
    const tokens: Token[] = [];
    let prev: Token | null = null;
    let i = 0;

    while (i < input.length) {
        const ch = input[i];
        if (/\s/.test(ch)) { i++; continue; }

        if (/[0-9.]/.test(ch)) {
            const start = i;
            while (i < input.length && /[0-9.]/.test(input[i])) i++;
            const t: Token = { type: 'number', value: input.slice(start, i) };
            if (!Number.isFinite(Number(t.value))) throw new Error('Invalid number');
            tokens.push(t); prev = t; continue;
        }

        if (/[a-zA-Z]/.test(ch)) {
            const start = i;
            while (i < input.length && /[a-zA-Z]/.test(input[i])) i++;
            const id = input.slice(start, i).toLowerCase();
            if (id in CONSTANTS) {
                const t: Token = { type: 'number', value: String(CONSTANTS[id]) };
                tokens.push(t); prev = t; continue;
            }
            if (id in FUNCTIONS) {
                const t: Token = { type: 'func', value: id };
                tokens.push(t); prev = t; continue;
            }
            throw new Error(`Unknown: ${id}`);
        }

        if (ch === '(') { const t: Token = { type: 'lparen', value: ch }; tokens.push(t); prev = t; i++; continue; }
        if (ch === ')') { const t: Token = { type: 'rparen', value: ch }; tokens.push(t); prev = t; i++; continue; }

        if ('+-*/^'.includes(ch)) {
            const isUnary = !prev || prev.type === 'operator' || prev.type === 'lparen' || prev.type === 'func';
            if (ch === '-' && isUnary) {
                const t: Token = { type: 'operator', value: 'u-' }; tokens.push(t); prev = t; i++; continue;
            }
            if (ch === '+' && isUnary) { i++; continue; }
            const t: Token = { type: 'operator', value: ch }; tokens.push(t); prev = t; i++; continue;
        }

        throw new Error(`Invalid character: ${ch}`);
    }
    return tokens;
}

function evaluate(input: string): number {
    const tokens = tokenize(input.trim());
    const out: Token[] = [];
    const ops: Token[] = [];

    for (const t of tokens) {
        if (t.type === 'number') { out.push(t); }
        else if (t.type === 'func') { ops.push(t); }
        else if (t.type === 'operator') {
            const o1 = OPERATORS[t.value];
            while (ops.length) {
                const top = ops[ops.length - 1];
                if (top.type === 'func') { out.push(ops.pop()!); continue; }
                if (top.type !== 'operator') break;
                const o2 = OPERATORS[top.value];
                if ((o1.assoc === 'L' && o1.prec <= o2.prec) || (o1.assoc === 'R' && o1.prec < o2.prec)) {
                    out.push(ops.pop()!);
                } else break;
            }
            ops.push(t);
        }
        else if (t.type === 'lparen') { ops.push(t); }
        else if (t.type === 'rparen') {
            let found = false;
            while (ops.length) { const top = ops[ops.length - 1]; if (top.type === 'lparen') { ops.pop(); found = true; break; } out.push(ops.pop()!); }
            if (!found) throw new Error('Mismatched parentheses');
            if (ops.length && ops[ops.length - 1].type === 'func') out.push(ops.pop()!);
        }
    }
    while (ops.length) { const top = ops.pop()!; if (top.type === 'lparen') throw new Error('Mismatched parentheses'); out.push(top); }

    const stack: number[] = [];
    for (const t of out) {
        if (t.type === 'number') { stack.push(Number(t.value)); }
        else if (t.type === 'operator') {
            const op = OPERATORS[t.value];
            if (op.args === 1) { stack.push(-stack.pop()!); }
            else { const b = stack.pop()!, a = stack.pop()!; switch (t.value) { case '+': stack.push(a + b); break; case '-': stack.push(a - b); break; case '*': stack.push(a * b); break; case '/': stack.push(a / b); break; case '^': stack.push(Math.pow(a, b)); break; } }
        }
        else if (t.type === 'func') { stack.push(FUNCTIONS[t.value](stack.pop()!)); }
    }
    if (stack.length !== 1) throw new Error('Invalid expression');
    return stack[0];
}

@customElement('scientific-calculator')
export class ScientificCalculator extends WebComponentBase {
    static override styles = [WebComponentBase.styles, scientificCalculatorStyles];

    @property({ type: String }) inputText = '';
    @property({ type: String }) outputText = '';

    private handleInput(e: Event) {
        this.inputText = (e.target as HTMLInputElement).value;
        this.process();
    }

    private process() {
        if (!this.inputText?.trim()) {
            this.outputText = '';
            return;
        }
        try {
            this.outputText = String(evaluate(this.inputText));
        } catch {
            this.outputText = 'Error: Invalid expression';
        }
    }

    override render() {
        return html`
            <div class="space-y-4">
                <div>
                    <label class="block mb-2 font-semibold">Expression:</label>
                    <input
                        type="text"
                        class="form-input w-full"
                        placeholder="e.g., 2 + 3 * 4, sqrt(16), sin(pi/2)..."
                        .value=${this.inputText}
                        @input=${this.handleInput}
                    />
                </div>
                
                <div>
                    <label class="block mb-2 font-semibold">Result:</label>
                    <input
                        type="text"
                        class="form-input w-full text-2xl font-bold"
                        readonly
                        .value=${this.outputText}
                    />
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

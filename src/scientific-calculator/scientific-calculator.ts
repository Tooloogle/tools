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
    '^': { prec: 4, assoc: 'R', args: 2 },
    'u-': { prec: 3, assoc: 'R', args: 1 },
};

const FUNCTIONS: Record<string, (x: number) => number> = {
    sqrt: Math.sqrt, sin: Math.sin, cos: Math.cos, tan: Math.tan,
    log: Math.log10, ln: Math.log, abs: Math.abs,
    ceil: Math.ceil, floor: Math.floor, round: Math.round,
};

const CONSTANTS: Record<string, number> = { pi: Math.PI, e: Math.E };

function safePop<T>(arr: T[]): T {
    if (!arr.length) {
        throw new Error('Invalid expression');
    }

    return arr.pop() as T;
}

function readNumber(input: string, start: number): [Token, number] {
    let i = start;
    while (i < input.length && /[0-9.]/.test(input[i])) { i++; }

    const value = input.slice(start, i);
    if (!Number.isFinite(Number(value))) {
        throw new Error('Invalid number');
    }

    return [{ type: 'number', value }, i];
}

function readIdentifier(input: string, start: number): [Token, number] {
    let i = start;
    while (i < input.length && /[a-zA-Z]/.test(input[i])) { i++; }

    const id = input.slice(start, i).toLowerCase();
    if (id in CONSTANTS) {
        return [{ type: 'number', value: String(CONSTANTS[id]) }, i];
    }

    if (id in FUNCTIONS) {
        return [{ type: 'func', value: id }, i];
    }

    throw new Error(`Unknown: ${id}`);
}

function isUnaryPosition(prev: Token | null): boolean {
    return !prev || prev.type === 'operator' || prev.type === 'lparen' || prev.type === 'func';
}

function tokenize(input: string): Token[] {
    const tokens: Token[] = [];
    let prev: Token | null = null;
    let i = 0;

    while (i < input.length) {
        if (/\s/.test(input[i])) { i++; continue; }

        const ch = input[i];
        let token: Token;

        if (/[0-9.]/.test(ch)) {
            [token, i] = readNumber(input, i);
        } else if (/[a-zA-Z]/.test(ch)) {
            [token, i] = readIdentifier(input, i);
        } else if (ch === '(' || ch === ')') {
            token = { type: ch === '(' ? 'lparen' : 'rparen', value: ch }; i++;
        } else if ('+-*/^'.includes(ch)) {
            token = readOperator(ch, prev); i++;
        } else {
            throw new Error(`Invalid character: ${ch}`);
        }

        tokens.push(token);
        prev = token;
    }

    return tokens;
}

function readOperator(ch: string, prev: Token | null): Token {
    if (ch === '-' && isUnaryPosition(prev)) {
        return { type: 'operator', value: 'u-' };
    }

    if (ch === '+' && isUnaryPosition(prev)) {
        return { type: 'number', value: '0' };
    }

    return { type: 'operator', value: ch };
}

function shouldPopOperator(o1: typeof OPERATORS[string], top: Token): boolean {
    if (top.type === 'func') { return true; }

    if (top.type !== 'operator') { return false; }

    const o2 = OPERATORS[top.value];
    return (o1.assoc === 'L' && o1.prec <= o2.prec) || (o1.assoc === 'R' && o1.prec < o2.prec);
}

function toPostfix(tokens: Token[]): Token[] {
    const out: Token[] = [];
    const ops: Token[] = [];

    for (const t of tokens) {
        if (t.type === 'number') { out.push(t); continue; }

        if (t.type === 'func') { ops.push(t); continue; }

        if (t.type === 'lparen') { ops.push(t); continue; }

        if (t.type === 'operator') {
            shuntOperator(t, ops, out);
            continue;
        }

        if (t.type === 'rparen') {
            shuntRparen(ops, out);
        }
    }

    drainOps(ops, out);
    return out;
}

function shuntOperator(t: Token, ops: Token[], out: Token[]) {
    const o1 = OPERATORS[t.value];
    while (ops.length && shouldPopOperator(o1, ops[ops.length - 1])) {
        out.push(safePop(ops));
    }

    ops.push(t);
}

function shuntRparen(ops: Token[], out: Token[]) {
    while (ops.length && ops[ops.length - 1].type !== 'lparen') {
        out.push(safePop(ops));
    }

    if (!ops.length) { throw new Error('Mismatched parentheses'); }

    ops.pop();
    if (ops.length && ops[ops.length - 1].type === 'func') { out.push(safePop(ops)); }
}

function drainOps(ops: Token[], out: Token[]) {
    while (ops.length) {
        const top = safePop(ops);
        if (top.type === 'lparen') { throw new Error('Mismatched parentheses'); }

        out.push(top);
    }
}

function applyBinary(op: string, a: number, b: number): number {
    switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return a / b;
        case '^': return Math.pow(a, b);
        default: throw new Error('Unknown operator');
    }
}

function evalPostfix(rpn: Token[]): number {
    const stack: number[] = [];

    for (const t of rpn) {
        if (t.type === 'number') { stack.push(Number(t.value)); continue; }

        if (t.type === 'func') { stack.push(FUNCTIONS[t.value](safePop(stack))); continue; }

        const op = OPERATORS[t.value];
        if (op.args === 1) { stack.push(-safePop(stack)); }
        else { const b = safePop(stack), a = safePop(stack); stack.push(applyBinary(t.value, a, b)); }
    }

    if (stack.length !== 1) { throw new Error('Invalid expression'); }

    return stack[0];
}

function evaluate(input: string): number {
    return evalPostfix(toPostfix(tokenize(input.trim())));
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

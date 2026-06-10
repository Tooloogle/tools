import { html, TemplateResult } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import ipAddressConverterStyles from './ip-address-converter.css.js';
import { customElement, state } from 'lit/decorators.js';
import '../t-copy-button/index.js';

interface ConversionResult {
    label: string;
    value: string;
    small?: boolean;
}

@customElement('ip-address-converter')
export class IpAddressConverter extends WebComponentBase {
    static override styles = [WebComponentBase.styles, ipAddressConverterStyles];

    @state() private input = '';
    @state() private results: ConversionResult[] = [];
    @state() private error = '';
    @state() private ipVersion = '';

    private handleInputChange(e: Event) {
        this.input = (e.target as HTMLInputElement).value;
        this.error = '';
        this.convert();
    }

    private convert() {
        this.error = '';
        this.results = [];
        this.ipVersion = '';

        if (!this.input.trim()) {
            return;
        }

        try {
            if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(this.input)) {
                this.convertFromDottedV4();
            } else if (/^\d+$/.test(this.input) && this.input.length <= 10) {
                this.convertFromDecimalV4();
            } else if (/^0x[0-9a-fA-F]{1,8}$/i.test(this.input)) {
                this.convertFromHexV4();
            } else if (this.isIPv6(this.input)) {
                this.convertFromV6();
            } else {
                throw new Error('Invalid format. Enter IPv4 (dotted/decimal/hex) or IPv6 address.');
            }
        } catch (e) {
            this.error = (e as Error).message;
        }
    }

    private convertFromDottedV4() {
        const parts = this.input.split('.').map(p => parseInt(p));

        if (parts.some(p => p < 0 || p > 255)) {
            throw new Error('Each octet must be between 0 and 255');
        }

        const decimalValue = ((parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3]) >>> 0;
        const v6Hex1 = ((parts[0] << 8) | parts[1]).toString(16);
        const v6Hex2 = ((parts[2] << 8) | parts[3]).toString(16);

        this.ipVersion = 'IPv4';
        this.results = [
            { label: 'Dotted Decimal', value: this.input },
            { label: 'Decimal', value: decimalValue.toString() },
            { label: 'Hexadecimal', value: `0x${parts.map(p => p.toString(16).padStart(2, '0').toUpperCase()).join('')}` },
            { label: 'Binary', value: parts.map(p => p.toString(2).padStart(8, '0')).join('.'), small: true },
            { label: 'IPv6 Mapped', value: `::ffff:${v6Hex1}:${v6Hex2}` },
        ];
    }

    private convertFromDecimalV4() {
        const num = parseInt(this.input);

        if (num < 0 || num > 4294967295) {
            throw new Error('Decimal value must be between 0 and 4294967295');
        }

        const octets = [
            (num >>> 24) & 255,
            (num >>> 16) & 255,
            (num >>> 8) & 255,
            num & 255,
        ];
        const dotted = octets.join('.');
        const v6Hex1 = ((octets[0] << 8) | octets[1]).toString(16);
        const v6Hex2 = ((octets[2] << 8) | octets[3]).toString(16);

        this.ipVersion = 'IPv4';
        this.results = [
            { label: 'Dotted Decimal', value: dotted },
            { label: 'Decimal', value: num.toString() },
            { label: 'Hexadecimal', value: `0x${num.toString(16).toUpperCase().padStart(8, '0')}` },
            { label: 'Binary', value: octets.map(o => o.toString(2).padStart(8, '0')).join('.'), small: true },
            { label: 'IPv6 Mapped', value: `::ffff:${v6Hex1}:${v6Hex2}` },
        ];
    }

    private convertFromHexV4() {
        const num = parseInt(this.input, 16);

        if (num > 4294967295) {
            throw new Error('Hex value must represent a valid 32-bit IP');
        }

        const octets = [
            (num >>> 24) & 255,
            (num >>> 16) & 255,
            (num >>> 8) & 255,
            num & 255,
        ];
        const dotted = octets.join('.');
        const v6Hex1 = ((octets[0] << 8) | octets[1]).toString(16);
        const v6Hex2 = ((octets[2] << 8) | octets[3]).toString(16);

        this.ipVersion = 'IPv4';
        this.results = [
            { label: 'Dotted Decimal', value: dotted },
            { label: 'Decimal', value: num.toString() },
            { label: 'Hexadecimal', value: `0x${num.toString(16).toUpperCase().padStart(8, '0')}` },
            { label: 'Binary', value: octets.map(o => o.toString(2).padStart(8, '0')).join('.'), small: true },
            { label: 'IPv6 Mapped', value: `::ffff:${v6Hex1}:${v6Hex2}` },
        ];
    }

    private isIPv6(input: string): boolean {
        return /^[0-9a-fA-F:]+$/.test(input) && input.includes(':');
    }

    private expandIPv6(input: string): string[] {
        // Reject multiple :: occurrences (invalid IPv6)
        if ((input.match(/::/g) || []).length > 1) {
            throw new Error('Invalid IPv6: multiple "::" not allowed');
        }

        let groups = input.split(':');

        const doubleColonIdx = input.indexOf('::');

        if (doubleColonIdx !== -1) {
            const left = input.substring(0, doubleColonIdx).split(':').filter(g => g !== '');
            const right = input.substring(doubleColonIdx + 2).split(':').filter(g => g !== '');
            const missing = 8 - left.length - right.length;

            if (missing < 0) {
                throw new Error('Invalid IPv6: too many groups');
            }

            groups = [...left, ...Array(missing).fill('0'), ...right];
        }

        if (groups.length !== 8) {
            throw new Error('IPv6 must have exactly 8 groups');
        }

        return groups.map(g => {
            if (!/^[0-9a-fA-F]{1,4}$/.test(g)) {
                throw new Error(`Invalid IPv6 group: "${g}"`);
            }

            return g.padStart(4, '0').toLowerCase();
        });
    }

    private compressIPv6(groups: string[]): string {
        const short = groups.map(g => g.replace(/^0+/, '') || '0');

        let bestStart = -1;
        let bestLen = 0;
        let curStart = -1;
        let curLen = 0;

        for (let i = 0; i < 8; i++) {
            if (short[i] === '0') {
                if (curStart === -1) {
                    curStart = i;
                    curLen = 1;
                } else {
                    curLen++;
                }
            } else {
                if (curLen > bestLen) {
                    bestStart = curStart;
                    bestLen = curLen;
                }

                curStart = -1;
                curLen = 0;
            }
        }

        if (curLen > bestLen) {
            bestStart = curStart;
            bestLen = curLen;
        }

        if (bestLen < 2) {
            return short.join(':');
        }

        const left = short.slice(0, bestStart).join(':');
        const right = short.slice(bestStart + bestLen).join(':');
        return `${left}::${right}`;
    }

    private convertFromV6() {
        const groups = this.expandIPv6(this.input);
        const expanded = groups.join(':');
        const compressed = this.compressIPv6(groups);
        const binary = groups
            .map(g => parseInt(g, 16).toString(2).padStart(16, '0'))
            .join(':');
        const decimal = BigInt(`0x${groups.join('')}`).toString();

        this.ipVersion = 'IPv6';
        this.results = [
            { label: 'Expanded', value: expanded },
            { label: 'Compressed', value: compressed },
            { label: 'Decimal', value: decimal },
            { label: 'Binary', value: binary, small: true },
        ];

        if (groups.slice(0, 5).every(g => g === '0000') && groups[5] === 'ffff') {
            const hi = parseInt(groups[6], 16);
            const lo = parseInt(groups[7], 16);
            const mapped = `${(hi >> 8) & 0xff}.${hi & 0xff}.${(lo >> 8) & 0xff}.${lo & 0xff}`;
            this.results.push({ label: 'IPv4 Mapped', value: mapped });
        }
    }

    private renderResultRow(label: string, value: string, small?: boolean): TemplateResult {
        return html`
            <tr>
                <td class="p-2 border-t border-gray-200 dark:border-gray-700">${label}</td>
                <td class="p-2 border-t border-gray-200 dark:border-gray-700 font-mono">
                    <div class="flex items-center justify-between gap-2">
                        <span class="${small ? 'text-xs break-all' : 'text-sm'}">${value}</span>
                        <t-copy-button .text=${value}></t-copy-button>
                    </div>
                </td>
            </tr>
        `;
    }

    override render() {
        return html`
            <div class="space-y-4">
                <label class="block">
                    <span class="block mb-2 font-semibold">IP Address</span>
                    <input
                        type="text"
                        class="form-input"
                        placeholder="e.g. 192.168.1.1, 2001:db8::1, or 0xC0A80101"
                        .value=${this.input}
                        @input=${this.handleInputChange}
                    />
                </label>

                ${this.error ? html`
                    <div class="p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded text-sm">
                        ${this.error}
                    </div>
                ` : ''}

                ${this.results.length > 0 ? html`
                    <div class="flex items-center gap-2 mb-1">
                        <span class="text-xs font-medium px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                            ${this.ipVersion}
                        </span>
                    </div>
                    <table class="w-full">
                        <thead>
                            <tr>
                                <th class="p-2 text-left text-sm text-gray-500 w-1/3">Format</th>
                                <th class="p-2 text-left text-sm text-gray-500">Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.results.map(r => this.renderResultRow(r.label, r.value, r.small))}
                        </tbody>
                    </table>
                ` : ''}

                <div class="text-xs text-gray-500">
                    <strong>Note:</strong> Supports IPv4 (dotted/decimal/hex) and
                    IPv6 (full, compressed, or :: notation). Converts live as you type.
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'ip-address-converter': IpAddressConverter;
    }
}

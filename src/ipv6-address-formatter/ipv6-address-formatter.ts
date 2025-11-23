import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import ipv6AddressFormatterStyles from './ipv6-address-formatter.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import '../t-copy-button/t-copy-button.js';

@customElement('ipv6-address-formatter')
export class Ipv6AddressFormatter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, ipv6AddressFormatterStyles];

    @property()
    input = '';

    @property()
    expanded = '';

    @property()
    compressed = '';

    @property()
    error = '';

    @property()
    isValid = false;

    private expandIPv6(address: string): string {
        // Handle :: expansion
        if (address.includes('::')) {
            const parts = address.split('::');
            const leftParts = parts[0] ? parts[0].split(':') : [];
            const rightParts = parts[1] ? parts[1].split(':') : [];
            const missingParts = 8 - leftParts.length - rightParts.length;
            const middleParts = Array(missingParts).fill('0000');
            const allParts = [...leftParts, ...middleParts, ...rightParts];
            return allParts.map(part => part.padStart(4, '0')).join(':');
        }
        
        // Already expanded, just pad each part
        return address.split(':').map(part => part.padStart(4, '0')).join(':');
    }

    private compressIPv6(address: string): string {
        const expanded = this.expandIPv6(address);
        const parts = expanded.split(':');
        
        // Remove leading zeros
        const withoutLeadingZeros = parts.map(part => part.replace(/^0+/, '') || '0');
        
        // Find longest sequence of zeros
        let maxZeroStart = -1;
        let maxZeroLength = 0;
        let currentZeroStart = -1;
        let currentZeroLength = 0;
        
        withoutLeadingZeros.forEach((part, i) => {
            if (part === '0') {
                if (currentZeroStart === -1) {
                    currentZeroStart = i;
                    currentZeroLength = 1;
                } else {
                    currentZeroLength++;
                }
            } else {
                if (currentZeroLength > maxZeroLength) {
                    maxZeroStart = currentZeroStart;
                    maxZeroLength = currentZeroLength;
                }
                currentZeroStart = -1;
                currentZeroLength = 0;
            }
        });
        
        // Check the last sequence
        if (currentZeroLength > maxZeroLength) {
            maxZeroStart = currentZeroStart;
            maxZeroLength = currentZeroLength;
        }
        
        // Replace longest zero sequence with ::
        if (maxZeroLength > 1) {
            const before = withoutLeadingZeros.slice(0, maxZeroStart);
            const after = withoutLeadingZeros.slice(maxZeroStart + maxZeroLength);
            
            if (before.length === 0 && after.length === 0) {
                return '::';
            } else if (before.length === 0) {
                return '::' + after.join(':');
            } else if (after.length === 0) {
                return before.join(':') + '::';
            } else {
                return before.join(':') + '::' + after.join(':');
            }
        }
        
        return withoutLeadingZeros.join(':');
    }

    private isValidIPv6(address: string): boolean {
        // IPv6 validation regex - supports various formats:
        // - Full format: 8 groups of 4 hex digits separated by colons
        // - Compressed format: Using :: to represent consecutive zero groups
        // - Mixed format: IPv4-mapped addresses
        const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|::)$/;
        return ipv6Regex.test(address);
    }

    private handleInputChange(e: Event) {
        const target = e.target as HTMLInputElement;
        this.input = target.value.trim();
        this.process();
    }

    private process() {
        this.error = '';
        this.expanded = '';
        this.compressed = '';
        this.isValid = false;

        if (!this.input) {
            return;
        }

        if (!this.isValidIPv6(this.input)) {
            this.error = 'Invalid IPv6 address format';
            return;
        }

        try {
            this.expanded = this.expandIPv6(this.input);
            this.compressed = this.compressIPv6(this.input);
            this.isValid = true;
        } catch (e) {
            this.error = 'Error processing IPv6 address';
        }
    }

    override render() {
        return html`
            <div class="space-y-4">
                <label class="block">
                    <span class="inline-block py-1">IPv6 Address</span>
                    <input
                        type="text"
                        class="form-input font-mono"
                        .value=${this.input}
                        @input=${this.handleInputChange}
                        placeholder="e.g., 2001:0db8:0000:0000:0000:ff00:0042:8329 or 2001:db8::ff00:42:8329"
                        autofocus
                    />
                </label>

                ${this.error ? html`
                    <div class="p-4 bg-red-50 border border-red-200 rounded text-red-700">
                        ${this.error}
                    </div>
                ` : ''}

                ${this.isValid ? html`
                    <div class="space-y-3">
                        <div class="p-4 bg-green-50 rounded border border-green-200">
                            <div class="flex items-center justify-between mb-2">
                                <div class="font-semibold text-green-900">Expanded Format</div>
                                <t-copy-button .text=${this.expanded}></t-copy-button>
                            </div>
                            <div class="text-lg font-mono break-all text-green-700">${this.expanded}</div>
                            <div class="text-sm text-green-600 mt-1">Full representation with all zeros shown</div>
                        </div>

                        <div class="p-4 bg-blue-50 rounded border border-blue-200">
                            <div class="flex items-center justify-between mb-2">
                                <div class="font-semibold text-blue-900">Compressed Format</div>
                                <t-copy-button .text=${this.compressed}></t-copy-button>
                            </div>
                            <div class="text-lg font-mono break-all text-blue-700">${this.compressed}</div>
                            <div class="text-sm text-blue-600 mt-1">Shortest valid representation using "::"</div>
                        </div>

                        <div class="p-4 bg-gray-50 rounded border border-gray-200">
                            <div class="font-semibold text-gray-900 mb-2">IPv6 Formatting Rules</div>
                            <div class="text-sm text-gray-700 space-y-1">
                                <div>• Each group is 16 bits (4 hex digits)</div>
                                <div>• 8 groups total (128 bits)</div>
                                <div>• Leading zeros in a group can be omitted</div>
                                <div>• Longest sequence of zero groups can be replaced with "::"</div>
                                <div>• "::" can only appear once in an address</div>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div class="p-3 bg-purple-50 rounded text-center">
                                <div class="text-sm text-purple-700">Total Bits</div>
                                <div class="text-2xl font-bold text-purple-900">128</div>
                            </div>
                            <div class="p-3 bg-purple-50 rounded text-center">
                                <div class="text-sm text-purple-700">Groups</div>
                                <div class="text-2xl font-bold text-purple-900">8</div>
                            </div>
                        </div>
                    </div>
                ` : ''}

                ${!this.input && !this.error ? html`
                    <div class="p-4 bg-blue-50 rounded border border-blue-200">
                        <div class="font-semibold text-blue-900 mb-2">Example IPv6 Addresses</div>
                        <div class="text-sm text-blue-700 space-y-1 font-mono">
                            <div>2001:0db8:0000:0000:0000:ff00:0042:8329</div>
                            <div>2001:db8::ff00:42:8329</div>
                            <div>::1 (loopback)</div>
                            <div>::ffff:192.0.2.1 (IPv4-mapped)</div>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'ipv6-address-formatter': Ipv6AddressFormatter;
    }
}

import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import regexPatternLibraryStyles from './regex-pattern-library.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import '../t-copy-button/t-copy-button.js';

interface RegexPattern {
    name: string;
    pattern: string;
    description: string;
    example: string;
    category: string;
}

@customElement('regex-pattern-library')
export class RegexPatternLibrary extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, regexPatternLibraryStyles];

    @property()
    searchTerm = '';

    @property()
    selectedCategory = 'all';

    private patterns: RegexPattern[] = [
        // Email & Web
        { name: 'Email Address', pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', description: 'Matches valid email addresses', example: 'user@example.com', category: 'Email & Web' },
        { name: 'URL', pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)', description: 'Matches HTTP and HTTPS URLs', example: 'https://www.example.com', category: 'Email & Web' },
        { name: 'Domain Name', pattern: '^([a-zA-Z0-9]([a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,}$', description: 'Matches domain names', example: 'example.com', category: 'Email & Web' },
        
        // Numbers
        { name: 'Integer', pattern: '^-?\\d+$', description: 'Matches positive or negative integers', example: '42 or -123', category: 'Numbers' },
        { name: 'Decimal Number', pattern: '^-?\\d*\\.?\\d+$', description: 'Matches decimal numbers', example: '3.14 or -0.5', category: 'Numbers' },
        { name: 'Positive Integer', pattern: '^[1-9]\\d*$', description: 'Matches positive integers (no zero)', example: '42', category: 'Numbers' },
        { name: 'Currency', pattern: '^\\$?\\d{1,3}(,\\d{3})*(\\.\\d{2})?$', description: 'Matches currency amounts', example: '$1,234.56', category: 'Numbers' },
        
        // Phone
        { name: 'US Phone', pattern: '^\\(?([0-9]{3})\\)?[-.\\s]?([0-9]{3})[-.\\s]?([0-9]{4})$', description: 'Matches US phone numbers', example: '(555) 123-4567', category: 'Phone' },
        { name: 'International Phone', pattern: '^\\+?[1-9]\\d{1,14}$', description: 'Matches E.164 international phone numbers', example: '+14155552671', category: 'Phone' },
        
        // Date & Time
        { name: 'Date (YYYY-MM-DD)', pattern: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$', description: 'Matches ISO date format', example: '2024-12-31', category: 'Date & Time' },
        { name: 'Date (MM/DD/YYYY)', pattern: '^(0[1-9]|1[0-2])\\/(0[1-9]|[12]\\d|3[01])\\/\\d{4}$', description: 'Matches US date format', example: '12/31/2024', category: 'Date & Time' },
        { name: 'Time (24h)', pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$', description: 'Matches 24-hour time format', example: '23:59', category: 'Date & Time' },
        
        // Text
        { name: 'Alphanumeric', pattern: '^[a-zA-Z0-9]+$', description: 'Matches only letters and numbers', example: 'Test123', category: 'Text' },
        { name: 'Letters Only', pattern: '^[a-zA-Z]+$', description: 'Matches only letters', example: 'Hello', category: 'Text' },
        { name: 'Whitespace', pattern: '\\s+', description: 'Matches whitespace characters', example: 'spaces and tabs', category: 'Text' },
        
        // Security
        { name: 'Strong Password', pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$', description: 'Min 8 chars, uppercase, lowercase, number, special char', example: 'Pass123!', category: 'Security' },
        { name: 'Hex Color', pattern: '^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$', description: 'Matches hex color codes', example: '#FF5733', category: 'Security' },
        
        // IP & Network
        { name: 'IPv4 Address', pattern: '^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$', description: 'Matches IPv4 addresses', example: '192.168.1.1', category: 'IP & Network' },
        { name: 'MAC Address', pattern: '^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$', description: 'Matches MAC addresses', example: '00:1B:44:11:3A:B7', category: 'IP & Network' },
    ];

    private get filteredPatterns(): RegexPattern[] {
        return this.patterns.filter(pattern => {
            const matchesSearch = !this.searchTerm || 
                pattern.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                pattern.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                pattern.pattern.toLowerCase().includes(this.searchTerm.toLowerCase());
            
            const matchesCategory = this.selectedCategory === 'all' || pattern.category === this.selectedCategory;
            
            return matchesSearch && matchesCategory;
        });
    }

    private get categories(): string[] {
        return Array.from(new Set(this.patterns.map(p => p.category))).sort();
    }

    private handleSearchChange(e: Event) {
        const target = e.target as HTMLInputElement;
        this.searchTerm = target.value;
    }

    private handleCategoryChange(e: Event) {
        const target = e.target as HTMLSelectElement;
        this.selectedCategory = target.value;
    }

    override render() {
        return html`
            <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label class="block">
                        <span class="inline-block py-1">Search Patterns</span>
                        <input
                            type="text"
                            class="form-input"
                            .value=${this.searchTerm}
                            @input=${this.handleSearchChange}
                            placeholder="Search by name or description"
                            autofocus
                        />
                    </label>

                    <label class="block">
                        <span class="inline-block py-1">Category</span>
                        <select class="form-select" .value=${this.selectedCategory} @change=${this.handleCategoryChange}>
                            <option value="all">All Categories</option>
                            ${this.categories.map(cat => html`
                                <option value="${cat}">${cat}</option>
                            `)}
                        </select>
                    </label>
                </div>

                <div class="space-y-3">
                    ${this.filteredPatterns.map(pattern => html`
                        <div class="p-4 bg-gray-50 rounded border border-gray-200">
                            <div class="flex items-start justify-between mb-2">
                                <div>
                                    <div class="font-semibold text-lg text-gray-900">${pattern.name}</div>
                                    <div class="text-sm text-gray-600">${pattern.category}</div>
                                </div>
                                <t-copy-button .text=${pattern.pattern}></t-copy-button>
                            </div>
                            
                            <div class="mb-2">
                                <div class="text-sm font-semibold text-gray-700 mb-1">Pattern:</div>
                                <div class="p-2 bg-white rounded font-mono text-sm break-all border border-gray-300">
                                    ${pattern.pattern}
                                </div>
                            </div>
                            
                            <div class="mb-2">
                                <div class="text-sm font-semibold text-gray-700 mb-1">Description:</div>
                                <div class="text-sm text-gray-600">${pattern.description}</div>
                            </div>
                            
                            <div>
                                <div class="text-sm font-semibold text-gray-700 mb-1">Example:</div>
                                <div class="text-sm text-blue-600 font-mono">${pattern.example}</div>
                            </div>
                        </div>
                    `)}
                </div>

                ${this.filteredPatterns.length === 0 ? html`
                    <div class="text-center py-8 text-gray-500">
                        No patterns found matching your search.
                    </div>
                ` : ''}

                <div class="p-4 bg-blue-50 rounded border border-blue-200">
                    <div class="font-semibold text-blue-900 mb-2">Using These Patterns</div>
                    <div class="text-sm text-blue-700 space-y-1">
                        <div>• Copy the pattern and use it in your programming language</div>
                        <div>• Escape backslashes when needed (e.g., in JavaScript strings)</div>
                        <div>• Test patterns with sample data before production use</div>
                        <div>• Some patterns may need adjustment for specific use cases</div>
                    </div>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'regex-pattern-library': RegexPatternLibrary;
    }
}

import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import characterEntityReferenceStyles from './character-entity-reference.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import '../t-copy-button/t-copy-button.js';

interface Entity {
    char: string;
    name: string;
    number: string;
    description: string;
    category: string;
}

@customElement('character-entity-reference')
export class CharacterEntityReference extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, characterEntityReferenceStyles];

    @property()
    searchTerm = '';

    @property()
    selectedCategory = 'all';

    private entities: Entity[] = [
        // Common
        { char: ' ', name: '&nbsp;', number: '&#160;', description: 'Non-breaking space', category: 'Common' },
        { char: '<', name: '&lt;', number: '&#60;', description: 'Less than', category: 'Common' },
        { char: '>', name: '&gt;', number: '&#62;', description: 'Greater than', category: 'Common' },
        { char: '&', name: '&amp;', number: '&#38;', description: 'Ampersand', category: 'Common' },
        { char: '"', name: '&quot;', number: '&#34;', description: 'Double quote', category: 'Common' },
        { char: "'", name: '&apos;', number: '&#39;', description: 'Single quote (apostrophe)', category: 'Common' },
        
        // Currency
        { char: '¢', name: '&cent;', number: '&#162;', description: 'Cent sign', category: 'Currency' },
        { char: '£', name: '&pound;', number: '&#163;', description: 'Pound sign', category: 'Currency' },
        { char: '¥', name: '&yen;', number: '&#165;', description: 'Yen sign', category: 'Currency' },
        { char: '€', name: '&euro;', number: '&#8364;', description: 'Euro sign', category: 'Currency' },
        
        // Math
        { char: '×', name: '&times;', number: '&#215;', description: 'Multiplication sign', category: 'Math' },
        { char: '÷', name: '&divide;', number: '&#247;', description: 'Division sign', category: 'Math' },
        { char: '±', name: '&plusmn;', number: '&#177;', description: 'Plus-minus sign', category: 'Math' },
        { char: '≠', name: '&ne;', number: '&#8800;', description: 'Not equal to', category: 'Math' },
        { char: '≈', name: '&asymp;', number: '&#8776;', description: 'Approximately equal', category: 'Math' },
        { char: '≤', name: '&le;', number: '&#8804;', description: 'Less than or equal', category: 'Math' },
        { char: '≥', name: '&ge;', number: '&#8805;', description: 'Greater than or equal', category: 'Math' },
        { char: '∞', name: '&infin;', number: '&#8734;', description: 'Infinity', category: 'Math' },
        { char: '√', name: '&radic;', number: '&#8730;', description: 'Square root', category: 'Math' },
        
        // Arrows
        { char: '←', name: '&larr;', number: '&#8592;', description: 'Left arrow', category: 'Arrows' },
        { char: '→', name: '&rarr;', number: '&#8594;', description: 'Right arrow', category: 'Arrows' },
        { char: '↑', name: '&uarr;', number: '&#8593;', description: 'Up arrow', category: 'Arrows' },
        { char: '↓', name: '&darr;', number: '&#8595;', description: 'Down arrow', category: 'Arrows' },
        { char: '↔', name: '&harr;', number: '&#8596;', description: 'Left-right arrow', category: 'Arrows' },
        
        // Symbols
        { char: '©', name: '&copy;', number: '&#169;', description: 'Copyright', category: 'Symbols' },
        { char: '®', name: '&reg;', number: '&#174;', description: 'Registered trademark', category: 'Symbols' },
        { char: '™', name: '&trade;', number: '&#8482;', description: 'Trademark', category: 'Symbols' },
        { char: '§', name: '&sect;', number: '&#167;', description: 'Section sign', category: 'Symbols' },
        { char: '¶', name: '&para;', number: '&#182;', description: 'Paragraph sign', category: 'Symbols' },
        { char: '•', name: '&bull;', number: '&#8226;', description: 'Bullet', category: 'Symbols' },
        { char: '…', name: '&hellip;', number: '&#8230;', description: 'Horizontal ellipsis', category: 'Symbols' },
        { char: '†', name: '&dagger;', number: '&#8224;', description: 'Dagger', category: 'Symbols' },
        { char: '‡', name: '&Dagger;', number: '&#8225;', description: 'Double dagger', category: 'Symbols' },
        
        // Greek
        { char: 'α', name: '&alpha;', number: '&#945;', description: 'Greek small letter alpha', category: 'Greek' },
        { char: 'β', name: '&beta;', number: '&#946;', description: 'Greek small letter beta', category: 'Greek' },
        { char: 'γ', name: '&gamma;', number: '&#947;', description: 'Greek small letter gamma', category: 'Greek' },
        { char: 'δ', name: '&delta;', number: '&#948;', description: 'Greek small letter delta', category: 'Greek' },
        { char: 'π', name: '&pi;', number: '&#960;', description: 'Greek small letter pi', category: 'Greek' },
        { char: 'Σ', name: '&Sigma;', number: '&#931;', description: 'Greek capital letter sigma', category: 'Greek' },
        { char: 'Ω', name: '&Omega;', number: '&#937;', description: 'Greek capital letter omega', category: 'Greek' },
    ];

    private get filteredEntities(): Entity[] {
        return this.entities.filter(entity => {
            const matchesSearch = !this.searchTerm || 
                entity.char.includes(this.searchTerm) ||
                entity.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                entity.number.includes(this.searchTerm) ||
                entity.description.toLowerCase().includes(this.searchTerm.toLowerCase());
            
            const matchesCategory = this.selectedCategory === 'all' || entity.category === this.selectedCategory;
            
            return matchesSearch && matchesCategory;
        });
    }

    private get categories(): string[] {
        return Array.from(new Set(this.entities.map(e => e.category))).sort();
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
                        <span class="inline-block py-1">Search</span>
                        <input
                            type="text"
                            class="form-input"
                            .value=${this.searchTerm}
                            @input=${this.handleSearchChange}
                            placeholder="Search by character, name, or description"
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

                <div class="overflow-x-auto">
                    <table class="w-full border-collapse">
                        <thead>
                            <tr class="bg-gray-100">
                                <th class="border border-gray-300 px-4 py-2 text-left">Character</th>
                                <th class="border border-gray-300 px-4 py-2 text-left">Named Entity</th>
                                <th class="border border-gray-300 px-4 py-2 text-left">Numeric Entity</th>
                                <th class="border border-gray-300 px-4 py-2 text-left">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.filteredEntities.map(entity => html`
                                <tr class="hover:bg-gray-50">
                                    <td class="border border-gray-300 px-4 py-2 text-center text-2xl">
                                        ${entity.char}
                                    </td>
                                    <td class="border border-gray-300 px-4 py-2">
                                        <div class="flex items-center justify-between">
                                            <code class="font-mono text-sm">${entity.name}</code>
                                            <t-copy-button .text=${entity.name}></t-copy-button>
                                        </div>
                                    </td>
                                    <td class="border border-gray-300 px-4 py-2">
                                        <div class="flex items-center justify-between">
                                            <code class="font-mono text-sm">${entity.number}</code>
                                            <t-copy-button .text=${entity.number}></t-copy-button>
                                        </div>
                                    </td>
                                    <td class="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                                        ${entity.description}
                                    </td>
                                </tr>
                            `)}
                        </tbody>
                    </table>
                </div>

                ${this.filteredEntities.length === 0 ? html`
                    <div class="text-center py-8 text-gray-500">
                        No entities found matching your search.
                    </div>
                ` : ''}

                <div class="p-4 bg-blue-50 rounded border border-blue-200">
                    <div class="font-semibold text-blue-900 mb-2">About HTML Entities</div>
                    <div class="text-sm text-blue-700 space-y-1">
                        <div>• <strong>Named entities</strong> are easier to remember (e.g., &amp;copy; for ©)</div>
                        <div>• <strong>Numeric entities</strong> work for any Unicode character (e.g., &amp;#169; for ©)</div>
                        <div>• Use entities in HTML/XML to display special characters correctly</div>
                        <div>• Essential for characters like &lt;, &gt;, and &amp; in HTML content</div>
                    </div>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'character-entity-reference': CharacterEntityReference;
    }
}

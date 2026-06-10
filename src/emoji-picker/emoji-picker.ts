import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import emojiPickerStyles from './emoji-picker.css.js';
import tooltipStyles from '../_styles/tooltip.css.js';
import { customElement, property, state } from 'lit/decorators.js';
import { hasClipboard } from '../_utils/DomUtils.js';
import { emojiCategories, emojiData, IEmojiCategory, IEmojiItem } from './emoji-data.js';
import '../t-copy-button/index.js';

@customElement('emoji-picker')
export class EmojiPicker extends WebComponentBase {
    static override styles = [WebComponentBase.styles, emojiPickerStyles, tooltipStyles];

    @property()
    searchQuery = '';

    @property()
    selectedCategory = 'all';

    @state()
    private copiedEmoji = '';

    private copyTimeoutId?: number;

    private emojiData: Record<string, IEmojiItem[]> = emojiData;

    private categories: IEmojiCategory[] = emojiCategories;

    private handleSearchChange(e: Event) {
        this.searchQuery = (e.target as HTMLInputElement).value;
    }

    private selectCategory(id: string) {
        this.selectedCategory = id;
    }

    private async copyEmoji(emoji: string) {
        if (!hasClipboard()) {
            return;
        }

        try {
            await navigator.clipboard.writeText(emoji);
            this.copiedEmoji = emoji;

            if (this.copyTimeoutId) {
                clearTimeout(this.copyTimeoutId);
            }

            this.copyTimeoutId = window.setTimeout(() => {
                this.copiedEmoji = '';
            }, 1500);
        } catch (error) {
            console.error('Failed to copy emoji:', error);
        }
    }

    private renderCategoryTab(category: IEmojiCategory) {
        const isActive = this.selectedCategory === category.id;
        return html`
            <button
                type="button"
                role="tab"
                aria-selected=${isActive ? 'true' : 'false'}
                aria-label=${category.label}
                title=${category.label}
                class="category-tab inline-flex items-center justify-center leading-none text-2xl p-2 rounded cursor-pointer transition tooltip-wrapper ${isActive
                    ? 'bg-blue-100 dark:bg-blue-900'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'}"
                @click=${() => this.selectCategory(category.id)}
            >
                ${category.icon}
                <span class="tooltip" role="status">${category.label}</span>
            </button>
        `;
    }

    private renderEmojiButton(item: IEmojiItem) {
        const isCopied = this.copiedEmoji === item.char;
        return html`
            <button
                type="button"
                class="emoji-btn relative inline-flex items-center justify-center leading-none text-4xl p-2 rounded cursor-pointer transition hover:bg-gray-100 dark:hover:bg-gray-700 tooltip-wrapper"
                @click=${() => this.copyEmoji(item.char)}
                aria-label="Copy ${item.keywords}"
                title=${item.keywords}
            >
                ${item.char}
                ${isCopied ? html`<span class="copied-badge absolute top-0 right-0 text-xs">✅</span>` : ''}
                <span class="tooltip" role="status">${isCopied ? 'Copied!' : item.keywords}</span>
            </button>
        `;
    }

    private filterByQuery(items: IEmojiItem[]): IEmojiItem[] {
        const query = this.searchQuery.trim().toLowerCase();
        if (!query) {
            return items;
        }

        return items.filter(item => item.keywords.includes(query) || item.char.includes(query));
    }

    private renderEmojiGrid(items: IEmojiItem[]) {
        return html`
            <div class="grid grid-cols-8 gap-2" role="list" aria-label="Emoji results">
                ${items.map(item => this.renderEmojiButton(item))}
            </div>
        `;
    }

    private renderCategorySection(category: IEmojiCategory) {
        const items = this.filterByQuery(this.emojiData[category.id] || []);
        if (items.length === 0) {
            return '';
        }

        return html`
            <section class="space-y-2" data-category=${category.id}>
                <h3 class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    ${category.label}
                </h3>
                ${this.renderEmojiGrid(items)}
            </section>
        `;
    }

    private renderBody() {
        const dataCategories = this.categories.filter(category => category.id !== 'all');
        const sections = this.selectedCategory === 'all'
            ? dataCategories
            : dataCategories.filter(category => category.id === this.selectedCategory);

        const renderedSections = sections
            .map(category => this.renderCategorySection(category))
            .filter(section => section !== '');

        if (renderedSections.length === 0) {
            return html`
                <div class="p-4 text-center text-gray-500 dark:text-gray-400">
                    No emojis found
                </div>
            `;
        }

        return html`<div class="space-y-5">${renderedSections}</div>`;
    }

    override render() {
        return html`
            <div class="space-y-4 py-2">
                <label class="block">
                    <span class="inline-block py-1 font-bold">Search Emoji:</span>
                    <input
                        type="text"
                        class="form-input"
                        placeholder="Search emojis..."
                        .value=${this.searchQuery}
                        @input=${this.handleSearchChange}
                    />
                </label>

                <div
                    class="flex flex-wrap gap-1 p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                    role="tablist"
                    aria-label="Emoji categories"
                >
                    ${this.categories.map(category => this.renderCategoryTab(category))}
                </div>

                ${this.renderBody()}

                <p class="pt-1 text-xs text-center text-gray-400 dark:text-gray-500">
                    💡 Click any emoji to copy it to your clipboard
                </p>
            </div>
        `;
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        if (this.copyTimeoutId) {
            clearTimeout(this.copyTimeoutId);
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'emoji-picker': EmojiPicker;
    }
}

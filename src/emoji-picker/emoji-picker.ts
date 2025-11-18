import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import emojiPickerStyles from './emoji-picker.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import '../t-copy-button/t-copy-button.js';

@customElement('emoji-picker')
export class EmojiPicker extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, emojiPickerStyles];

    @property()
    searchQuery = '';

    @property()
    selectedCategory = 'all';

    private emojiData = {
        smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '🥲'],
        gestures: ['👋', '🤚', '🖐', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌'],
        hearts: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '❤️‍🩹', '💕', '💞', '💓', '💗', '💖', '💘', '💝'],
        animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗'],
        food: ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶', '🌽', '🥕', '🧄', '🧅'],
        activities: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿'],
        travel: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🏍', '🛵', '🚲', '🛴', '🛹', '✈️', '🚁', '🚂', '🚆', '🚇', '🚊'],
        objects: ['⌚', '📱', '💻', '⌨️', '🖥', '🖨', '🖱', '🖲', '🕹', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙', '🎚', '🎛'],
        symbols: ['❤️', '💛', '💚', '💙', '💜', '🖤', '🤍', '💯', '💢', '💬', '👁️‍🗨️', '🗨', '🗯', '💭', '💤', '✅', '⭕', '❌', '⚠️', '❗', '❓', '❔', '❕']
    };

    private handleSearchChange(e: Event) {
        this.searchQuery = (e.target as HTMLInputElement).value.toLowerCase();
    }

    private handleCategoryChange(e: Event) {
        this.selectedCategory = (e.target as HTMLSelectElement).value;
    }

    private copyEmoji(emoji: string) {
        navigator.clipboard.writeText(emoji);
    }

    private getFilteredEmojis(): string[] {
        let emojis: string[] = [];
        
        if (this.selectedCategory === 'all') {
            emojis = Object.values(this.emojiData).flat();
        } else {
            emojis = this.emojiData[this.selectedCategory as keyof typeof this.emojiData] || [];
        }
        
        return emojis;
    }

    override render() {
        const filteredEmojis = this.getFilteredEmojis();

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

                <label class="block">
                    <span class="inline-block py-1 font-bold">Category:</span>
                    <select
                        class="form-select"
                        .value=${this.selectedCategory}
                        @change=${this.handleCategoryChange}
                    >
                        <option value="all">All</option>
                        <option value="smileys">Smileys & Emotions</option>
                        <option value="gestures">Hand Gestures</option>
                        <option value="hearts">Hearts</option>
                        <option value="animals">Animals</option>
                        <option value="food">Food & Drink</option>
                        <option value="activities">Activities & Sports</option>
                        <option value="travel">Travel & Places</option>
                        <option value="objects">Objects</option>
                        <option value="symbols">Symbols</option>
                    </select>
                </label>

                <div class="grid grid-cols-8 gap-2">
                    ${filteredEmojis.map(emoji => html`
                        <button
                            class="text-4xl p-2 hover:bg-gray-100 rounded cursor-pointer transition"
                            @click=${() => this.copyEmoji(emoji)}
                            title="Click to copy ${emoji}"
                        >
                            ${emoji}
                        </button>
                    `)}
                </div>

                ${filteredEmojis.length === 0 ? html`
                    <div class="p-4 text-center text-gray-500">
                        No emojis found
                    </div>
                ` : ''}

                <div class="mt-4 p-3 bg-blue-50 rounded text-sm">
                    <p class="font-bold">💡 Tip:</p>
                    <p class="mt-1">Click on any emoji to copy it to your clipboard!</p>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'emoji-picker': EmojiPicker;
    }
}

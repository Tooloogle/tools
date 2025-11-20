import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import openGraphGeneratorStyles from './open-graph-generator.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';

@customElement('open-graph-generator')
export class OpenGraphGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, openGraphGeneratorStyles];

    @property({ type: String }) title = '';
    @property({ type: String }) description = '';
    @property({ type: String }) url = '';
    @property({ type: String }) image = '';
    @property({ type: String }) siteName = '';
    @property({ type: String }) type = 'website';
    @property({ type: String }) outputText = '';

    override connectedCallback() {
        super.connectedCallback();
        this.process();
    }

    private handleInput(field: string) {
        return (e: Event) => {
            (this as any)[field] = (e.target as HTMLInputElement | HTMLTextAreaElement).value;
            this.process();
        };
    }

    private process() {
        let output = '';

        if (this.title) {
            output += `<meta property="og:title" content="${this.escapeHtml(this.title)}">\n`;
        }

        if (this.description) {
            output += `<meta property="og:description" content="${this.escapeHtml(this.description)}">\n`;
        }

        if (this.url) {
            output += `<meta property="og:url" content="${this.escapeHtml(this.url)}">\n`;
        }

        if (this.image) {
            output += `<meta property="og:image" content="${this.escapeHtml(this.image)}">\n`;
        }

        if (this.siteName) {
            output += `<meta property="og:site_name" content="${this.escapeHtml(this.siteName)}">\n`;
        }

        if (this.type) {
            output += `<meta property="og:type" content="${this.escapeHtml(this.type)}">\n`;
        }

        // Add Twitter Card tags
        if (this.title) {
            output += `\n<!-- Twitter Card -->\n`;
            output += `<meta name="twitter:card" content="summary_large_image">\n`;
            output += `<meta name="twitter:title" content="${this.escapeHtml(this.title)}">\n`;
        }

        if (this.description) {
            output += `<meta name="twitter:description" content="${this.escapeHtml(this.description)}">\n`;
        }

        if (this.image) {
            output += `<meta name="twitter:image" content="${this.escapeHtml(this.image)}">`;
        }

        this.outputText = output;
    }

    private escapeHtml(text: string): string {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    override render() {
        return html`
            <div class="space-y-4">
                <div>
                    <label class="block mb-2 font-semibold">Title:</label>
                    <input
                        type="text"
                        class="form-input w-full"
                        placeholder="Page Title"
                        .value=${this.title}
                        @input=${this.handleInput('title')}
                    />
                </div>

                <div>
                    <label class="block mb-2 font-semibold">Description:</label>
                    <textarea
                        class="form-input w-full h-20"
                        placeholder="Page description for social media sharing"
                        .value=${this.description}
                        @input=${this.handleInput('description')}
                    ></textarea>
                </div>

                <div>
                    <label class="block mb-2 font-semibold">URL:</label>
                    <input
                        type="url"
                        class="form-input w-full"
                        placeholder="https://example.com/page"
                        .value=${this.url}
                        @input=${this.handleInput('url')}
                    />
                </div>

                <div>
                    <label class="block mb-2 font-semibold">Image URL:</label>
                    <input
                        type="url"
                        class="form-input w-full"
                        placeholder="https://example.com/image.jpg"
                        .value=${this.image}
                        @input=${this.handleInput('image')}
                    />
                </div>

                <div>
                    <label class="block mb-2 font-semibold">Site Name:</label>
                    <input
                        type="text"
                        class="form-input w-full"
                        placeholder="My Website"
                        .value=${this.siteName}
                        @input=${this.handleInput('siteName')}
                    />
                </div>

                <div>
                    <label class="block mb-2 font-semibold">Type:</label>
                    <select
                        class="form-input w-full"
                        .value=${this.type}
                        @change=${this.handleInput('type')}
                    >
                        <option value="website">Website</option>
                        <option value="article">Article</option>
                        <option value="profile">Profile</option>
                        <option value="video.movie">Video - Movie</option>
                        <option value="music.song">Music - Song</option>
                        <option value="book">Book</option>
                    </select>
                </div>

                <div>
                    <label class="block mb-2 font-semibold">Generated Open Graph Tags:</label>
                    <textarea
                        class="form-input w-full h-48"
                        readonly
                        .value=${this.outputText}
                    ></textarea>
                    ${this.outputText ? html`<t-copy-button .text=${this.outputText}></t-copy-button>` : ''}
                </div>

                <div class="text-sm text-gray-600">
                    Includes both Open Graph and Twitter Card meta tags for optimal social media sharing.
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'open-graph-generator': OpenGraphGenerator;
    }
}

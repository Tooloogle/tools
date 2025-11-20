import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import metaTagsGeneratorStyles from './meta-tags-generator.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';

@customElement('meta-tags-generator')
export class MetaTagsGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, metaTagsGeneratorStyles];

    @property({ type: String }) title = '';
    @property({ type: String }) description = '';
    @property({ type: String }) keywords = '';
    @property({ type: String }) author = '';
    @property({ type: String }) viewport = 'width=device-width, initial-scale=1.0';
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
            output += `<title>${this.escapeHtml(this.title)}</title>\n`;
        }

        if (this.description) {
            output += `<meta name="description" content="${this.escapeHtml(this.description)}">\n`;
        }

        if (this.keywords) {
            output += `<meta name="keywords" content="${this.escapeHtml(this.keywords)}">\n`;
        }

        if (this.author) {
            output += `<meta name="author" content="${this.escapeHtml(this.author)}">\n`;
        }

        if (this.viewport) {
            output += `<meta name="viewport" content="${this.escapeHtml(this.viewport)}">\n`;
        }

        output += '<meta charset="UTF-8">\n';
        output += '<meta http-equiv="X-UA-Compatible" content="IE=edge">';

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
                    <label class="block mb-2 font-semibold">Page Title:</label>
                    <input
                        type="text"
                        class="form-input w-full"
                        placeholder="My Website - Home"
                        .value=${this.title}
                        @input=${this.handleInput('title')}
                    />
                </div>

                <div>
                    <label class="block mb-2 font-semibold">Description:</label>
                    <textarea
                        class="form-input w-full h-20"
                        placeholder="A brief description of your page for search engines"
                        .value=${this.description}
                        @input=${this.handleInput('description')}
                    ></textarea>
                </div>

                <div>
                    <label class="block mb-2 font-semibold">Keywords (comma-separated):</label>
                    <input
                        type="text"
                        class="form-input w-full"
                        placeholder="web development, HTML, CSS, JavaScript"
                        .value=${this.keywords}
                        @input=${this.handleInput('keywords')}
                    />
                </div>

                <div>
                    <label class="block mb-2 font-semibold">Author:</label>
                    <input
                        type="text"
                        class="form-input w-full"
                        placeholder="Your Name"
                        .value=${this.author}
                        @input=${this.handleInput('author')}
                    />
                </div>

                <div>
                    <label class="block mb-2 font-semibold">Viewport:</label>
                    <input
                        type="text"
                        class="form-input w-full"
                        .value=${this.viewport}
                        @input=${this.handleInput('viewport')}
                    />
                </div>

                <div>
                    <label class="block mb-2 font-semibold">Generated HTML Meta Tags:</label>
                    <textarea
                        class="form-input w-full h-32"
                        readonly
                        .value=${this.outputText}
                    ></textarea>
                    ${this.outputText ? html`<t-copy-button .text=${this.outputText}></t-copy-button>` : ''}
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'meta-tags-generator': MetaTagsGenerator;
    }
}

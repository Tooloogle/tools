import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import robotsTxtGeneratorStyles from './robots-txt-generator.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';

@customElement('robots-txt-generator')
export class RobotsTxtGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, robotsTxtGeneratorStyles];

    @property({ type: String }) userAgent = '*';
    @property({ type: Boolean }) allowAll = false;
    @property({ type: Boolean }) disallowAll = false;
    @property({ type: String }) disallowPaths = '';
    @property({ type: String }) allowPaths = '';
    @property({ type: String }) sitemapUrl = '';
    @property({ type: String }) outputText = '';

    override connectedCallback() {
        super.connectedCallback();
        this.process();
    }

    private handleUserAgent(e: Event) {
        this.userAgent = (e.target as HTMLInputElement).value || '*';
        this.process();
    }

    private handleAllowAll(e: Event) {
        this.allowAll = (e.target as HTMLInputElement).checked;
        if (this.allowAll) this.disallowAll = false;
        this.process();
    }

    private handleDisallowAll(e: Event) {
        this.disallowAll = (e.target as HTMLInputElement).checked;
        if (this.disallowAll) this.allowAll = false;
        this.process();
    }

    private handleDisallowPaths(e: Event) {
        this.disallowPaths = (e.target as HTMLTextAreaElement).value;
        this.process();
    }

    private handleAllowPaths(e: Event) {
        this.allowPaths = (e.target as HTMLTextAreaElement).value;
        this.process();
    }

    private handleSitemap(e: Event) {
        this.sitemapUrl = (e.target as HTMLInputElement).value;
        this.process();
    }

    private process() {
        let output = `User-agent: ${this.userAgent}\n`;

        if (this.allowAll) {
            output += 'Allow: /\n';
        } else if (this.disallowAll) {
            output += 'Disallow: /\n';
        } else {
            if (this.disallowPaths) {
                const paths = this.disallowPaths.split('\n').filter(p => p.trim());
                paths.forEach(path => {
                    output += `Disallow: ${path.trim()}\n`;
                });
            }
            if (this.allowPaths) {
                const paths = this.allowPaths.split('\n').filter(p => p.trim());
                paths.forEach(path => {
                    output += `Allow: ${path.trim()}\n`;
                });
            }
        }

        if (this.sitemapUrl) {
            output += `\nSitemap: ${this.sitemapUrl}`;
        }

        this.outputText = output;
    }

    override render() {
        return html`
            <div class="space-y-4">
                <div>
                    <label class="block mb-2 font-semibold">User-Agent:</label>
                    <input
                        type="text"
                        class="form-input w-full"
                        placeholder="*"
                        .value=${this.userAgent}
                        @input=${this.handleUserAgent}
                    />
                </div>
                
                <div class="flex gap-4">
                    <label class="flex items-center">
                        <input
                            type="checkbox"
                            .checked=${this.allowAll}
                            @change=${this.handleAllowAll}
                        />
                        <span class="ml-2">Allow All</span>
                    </label>
                    <label class="flex items-center">
                        <input
                            type="checkbox"
                            .checked=${this.disallowAll}
                            @change=${this.handleDisallowAll}
                        />
                        <span class="ml-2">Disallow All</span>
                    </label>
                </div>

                ${!this.allowAll && !this.disallowAll ? html`
                    <div>
                        <label class="block mb-2 font-semibold">Disallow Paths (one per line):</label>
                        <textarea
                            class="form-input w-full h-24"
                            placeholder="/admin&#10;/private&#10;/tmp"
                            .value=${this.disallowPaths}
                            @input=${this.handleDisallowPaths}
                        ></textarea>
                    </div>

                    <div>
                        <label class="block mb-2 font-semibold">Allow Paths (one per line):</label>
                        <textarea
                            class="form-input w-full h-24"
                            placeholder="/public&#10;/images"
                            .value=${this.allowPaths}
                            @input=${this.handleAllowPaths}
                        ></textarea>
                    </div>
                ` : ''}

                <div>
                    <label class="block mb-2 font-semibold">Sitemap URL (optional):</label>
                    <input
                        type="url"
                        class="form-input w-full"
                        placeholder="https://example.com/sitemap.xml"
                        .value=${this.sitemapUrl}
                        @input=${this.handleSitemap}
                    />
                </div>

                <div>
                    <label class="block mb-2 font-semibold">Generated robots.txt:</label>
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
        'robots-txt-generator': RobotsTxtGenerator;
    }
}

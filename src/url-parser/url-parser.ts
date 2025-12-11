import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import urlParserStyles from './url-parser.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-button';
import '../t-input';

@customElement('url-parser')
export class UrlParser extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, urlParserStyles];

    @property()
    input = '';

    @property()
    parsed: URLComponents | null = null;

    @property()
    error = '';

    private handleInputChange(e: CustomEvent) {
        this.input = e.detail.value;
    }

    private parseUrl() {
        this.error = '';
        this.parsed = null;

        try {
            const url = new URL(this.input);
            const params: Record<string, string> = {};
            url.searchParams.forEach((value, key) => {
                params[key] = value;
            });

            this.parsed = {
                href: url.href,
                protocol: url.protocol,
                hostname: url.hostname,
                port: url.port,
                pathname: url.pathname,
                search: url.search,
                hash: url.hash,
                origin: url.origin,
                host: url.host,
                params
            };
        } catch (e) {
            this.error = `Invalid URL: ${  (e as Error).message}`;
        }
    }

    private clear() {
        this.input = '';
        this.parsed = null;
        this.error = '';
    }

    private renderParamRow([key, value]: [string, string]) {
        return html`
            <tr>
                <td>${key}</td>
                <td>${value}</td>
            </tr>
        `;
    }

    // TODO: Refactor render method to be under 50 lines by extracting sub-components
    // eslint-disable-next-line max-lines-per-function
    override render() {
        return html`
            <label class="block py-1">
                <span class="inline-block py-1 font-bold">URL:</span>
                <t-input placeholder="https://example.com/path?key=value#hash" .value="${this.input}" @t-input=${this.handleInputChange}></t-input>
            </label>

            <div class="py-2 flex flex-wrap gap-2">
                <t-button variant="blue" @click=${this.parseUrl}>Parse URL</t-button>
                <t-button variant="red" @click=${this.clear}>Clear</t-button>
            </div>

            ${this.error ? html`
                <div class="py-2">
                    <div class="px-3 py-2 bg-red-100 text-red-800 rounded">
                        ${this.error}
                    </div>
                </div>
            ` : ''}

            ${this.parsed ? html`
                <div class="py-2">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Component</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Full URL</td>
                                <td>${this.parsed.href}</td>
                            </tr>
                            <tr>
                                <td>Protocol</td>
                                <td>${this.parsed.protocol}</td>
                            </tr>
                            <tr>
                                <td>Hostname</td>
                                <td>${this.parsed.hostname}</td>
                            </tr>
                            <tr>
                                <td>Port</td>
                                <td>${this.parsed.port || '(default)'}</td>
                            </tr>
                            <tr>
                                <td>Pathname</td>
                                <td>${this.parsed.pathname}</td>
                            </tr>
                            <tr>
                                <td>Search/Query</td>
                                <td>${this.parsed.search || '(none)'}</td>
                            </tr>
                            <tr>
                                <td>Hash</td>
                                <td>${this.parsed.hash || '(none)'}</td>
                            </tr>
                            <tr>
                                <td>Origin</td>
                                <td>${this.parsed.origin}</td>
                            </tr>
                            <tr>
                                <td>Host</td>
                                <td>${this.parsed.host}</td>
                            </tr>
                        </tbody>
                    </table>

                    ${Object.keys(this.parsed.params).length > 0 ? html`
                        <div class="mt-4">
                            <h3 class="font-bold py-2">Query Parameters:</h3>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Key</th>
                                        <th>Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${Object.entries(this.parsed.params).map(entry => this.renderParamRow(entry))}
                                </tbody>
                            </table>
                        </div>
                    ` : ''}
                </div>
            ` : ''}
        `;
    }
}

interface URLComponents {
    href: string;
    protocol: string;
    hostname: string;
    port: string;
    pathname: string;
    search: string;
    hash: string;
    origin: string;
    host: string;
    params: Record<string, string>;
}

declare global {
    interface HTMLElementTagNameMap {
        'url-parser': UrlParser;
    }
}

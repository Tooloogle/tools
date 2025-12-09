import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import userAgentParserStyles from './user-agent-parser.css.js';
import { customElement, property } from 'lit/decorators.js';
import { isBrowser } from '../_utils/DomUtils.js';
import '../t-button/t-button.js';

@customElement('user-agent-parser')
export class UserAgentParser extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, userAgentParserStyles];

    @property()
    input = '';

    @property()
    parsed: UAInfo | null = null;

    private handleInputChange(e: CustomEvent) {
        this.input = e.detail.value;
    }

    private parseUA() {
        const ua = this.input || (isBrowser() ? navigator.userAgent : '');
        
        this.parsed = {
            browser: this.getBrowser(ua),
            os: this.getOS(ua),
            device: this.getDevice(ua),
            engine: this.getEngine(ua),
            full: ua
        };
    }

    private getBrowser(ua: string): string {
        if (ua.includes('Firefox/')) {
            return `Firefox ${  ua.match(/Firefox\/([\d.]+)/)?.[1]}`;
        }

        if (ua.includes('Chrome/') && !ua.includes('Edg')) {
            return `Chrome ${  ua.match(/Chrome\/([\d.]+)/)?.[1]}`;
        }

        if (ua.includes('Edg/')) {
            return `Edge ${  ua.match(/Edg\/([\d.]+)/)?.[1]}`;
        }

        if (ua.includes('Safari/') && !ua.includes('Chrome')) {
            return `Safari ${  ua.match(/Version\/([\d.]+)/)?.[1]}`;
        }

        if (ua.includes('OPR/')) {
            return `Opera ${  ua.match(/OPR\/([\d.]+)/)?.[1]}`;
        }

        return 'Unknown';
    }

    private getOS(ua: string): string {
        if (ua.includes('Windows NT 10.0')) {
            return 'Windows 10/11';
        }

        if (ua.includes('Windows NT 6.3')) {
            return 'Windows 8.1';
        }

        if (ua.includes('Windows NT 6.2')) {
            return 'Windows 8';
        }

        if (ua.includes('Windows NT 6.1')) {
            return 'Windows 7';
        }

        if (ua.includes('Mac OS X')) {
            return `macOS ${  ua.match(/Mac OS X ([\d_]+)/)?.[1]?.replace(/_/g, '.')}`;
        }

        if (ua.includes('Android')) {
            return `Android ${  ua.match(/Android ([\d.]+)/)?.[1]}`;
        }

        if (ua.includes('iPhone')) {
            return `iOS (iPhone) ${  ua.match(/OS ([\d_]+)/)?.[1]?.replace(/_/g, '.')}`;
        }

        if (ua.includes('iPad')) {
            return `iOS (iPad) ${  ua.match(/OS ([\d_]+)/)?.[1]?.replace(/_/g, '.')}`;
        }

        if (ua.includes('Linux')) {
            return 'Linux';
        }

        return 'Unknown';
    }

    private getDevice(ua: string): string {
        if (ua.includes('Mobile') || ua.includes('Android')) {
            return 'Mobile';
        }

        if (ua.includes('Tablet') || ua.includes('iPad')) {
            return 'Tablet';
        }

        return 'Desktop';
    }

    private getEngine(ua: string): string {
        if (ua.includes('Gecko/')) {
            return 'Gecko';
        }

        if (ua.includes('WebKit/')) {
            return 'WebKit';
        }

        if (ua.includes('Blink')) {
            return 'Blink';
        }

        if (ua.includes('Trident/')) {
            return 'Trident';
        }

        return 'Unknown';
    }

    private useCurrentUA() {
        if (!isBrowser()) {
            return;
        }

        this.input = navigator.userAgent;
        this.parseUA();
    }

    private clear() {
        this.input = '';
        this.parsed = null;
    }

    // TODO: Refactor render method to be under 50 lines by extracting sub-components
    // eslint-disable-next-line max-lines-per-function
    override render() {
        return html`
            <label class="block py-1">
                <span class="inline-block py-1 font-bold">User Agent String:</span>
                <t-textarea placeholder="Paste user agent string or click 'Use Current Browser' button..." rows="4" class="font-mono text-sm"></t-textarea>
            </label>

            <div class="py-2 flex flex-wrap gap-2">
                <t-button variant="blue" @click=${this.parseUA}>Parse</t-button>
                <t-button variant="blue" @click=${this.useCurrentUA}>Use Current Browser</t-button>
                <t-button variant="red" @click=${this.clear}>Clear</t-button>
            </div>

            ${this.parsed ? html`
                <div class="py-2">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Property</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Browser</td>
                                <td>${this.parsed.browser}</td>
                            </tr>
                            <tr>
                                <td>Operating System</td>
                                <td>${this.parsed.os}</td>
                            </tr>
                            <tr>
                                <td>Device Type</td>
                                <td>${this.parsed.device}</td>
                            </tr>
                            <tr>
                                <td>Rendering Engine</td>
                                <td>${this.parsed.engine}</td>
                            </tr>
                            <tr>
                                <td>Full UA</td>
                                <td class="font-mono text-sm break-all">${this.parsed.full}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ` : ''}
        `;
    }
}

interface UAInfo {
    browser: string;
    os: string;
    device: string;
    engine: string;
    full: string;
}

declare global {
    interface HTMLElementTagNameMap {
        'user-agent-parser': UserAgentParser;
    }
}

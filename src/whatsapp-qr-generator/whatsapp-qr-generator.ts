import { html, type PropertyValues } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import whatsappQrGeneratorStyles from './whatsapp-qr-generator.css.js';
import { customElement, property } from 'lit/decorators.js';
import type QRCodeStyling from 'qr-code-styling';
import { buildWhatsAppUrl } from '../_utils/messaging-links.js';
import '../t-copy-button/index.js';

@customElement('whatsapp-qr-generator')
export class WhatsappQrGenerator extends WebComponentBase {
    static override styles = [WebComponentBase.styles, whatsappQrGeneratorStyles];

    @property() phone = '';
    @property() message = '';
    @property() output = '';
    @property() error = '';
    @property({ type: Boolean }) ready = false;
    private qr?: QRCodeStyling;
    private revision = 0;

    protected override updated(changed: PropertyValues) {
        if (changed.has('output')) {
            void this.renderQr();
        }
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        this.revision++;
        this.ready = false;
        this.qr = undefined;
    }

    override connectedCallback() {
        super.connectedCallback();
        if (this.hasUpdated) {
            void this.updateComplete.then(() => this.renderQr());
        }
    }

    private isCurrent(revision: number) {
        return revision === this.revision && this.isConnected;
    }

    private mountQr(container: HTMLDivElement, QRCode: typeof QRCodeStyling) {
        if (!this.qr) {
            this.qr = new QRCode({ width: 300, height: 300, type: 'svg', margin: 16,
                qrOptions: { errorCorrectionLevel: 'M' }, data: this.output,
                dotsOptions: { color: '#000000' }, backgroundOptions: { color: '#ffffff' } });
            container.replaceChildren();
            this.qr.append(container);
        } else {
            this.qr.update({ data: this.output });
        }

        return this.qr;
    }

    private async renderQr() {
        const revision = ++this.revision;
        this.ready = false;
        const container = this.shadowRoot?.querySelector<HTMLDivElement>('.qr-preview');
        if (!container || !this.output || !this.isConnected) {
            container?.replaceChildren();
            this.qr = undefined;
            return;
        }

        try {
            const { default: QRCode } = await import('qr-code-styling');
            if (!this.isCurrent(revision)) {
                return;
            }

            await this.mountQr(container, QRCode).getRawData('svg');
            if (this.isCurrent(revision)) {
                this.ready = true;
            }
        } catch {
            if (revision === this.revision) {
                this.error = 'Unable to generate this QR code. Try a shorter message.';
                container.replaceChildren();
                this.qr = undefined;
            }
        }
    }

    private changeInput(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.name === 'phone') {
            this.phone = input.value;
        } else {
            this.message = input.value;
        }

        this.refreshLink();
    }

    private refreshLink() {
        this.ready = false;
        this.output = '';
        this.error = '';
        if (!this.phone.trim()) {
            return;
        }

        try {
            this.output = buildWhatsAppUrl(this.phone, this.message);
        } catch (error) {
            this.error = (error as Error).message;
        }
    }

    private download(event: Event) {
        if (!this.ready || !this.qr || !this.output) {
            return;
        }

        const extension = (event.currentTarget as HTMLButtonElement).dataset.extension as 'png' | 'svg';
        void this.qr.download({ name: 'whatsapp-qr', extension }).catch(() => {
            this.error = 'Unable to download the QR code.';
        });
    }

    private reset() {
        this.phone = '';
        this.message = '';
        this.refreshLink();
    }

    override render() {
        return html`
            <div class="space-y-4 text-gray-900 dark:text-gray-100">
                <label class="block">Phone number with country code
                    <input class="form-input" name="phone" type="tel" placeholder="+1 202 555 0123"
                        .value=${this.phone} @input=${this.changeInput} />
                </label>
                <label class="block">Message (optional)
                    <textarea class="form-textarea" name="message" rows="3" .value=${this.message} @input=${this.changeInput}></textarea>
                </label>
                ${this.error ? html`<p role="alert" class="text-red-700 dark:text-red-300">${this.error}</p>` : ''}
                <div class="qr-preview" role="img" aria-label="WhatsApp chat QR code" ?hidden=${!this.output}></div>
                <label class="block">WhatsApp link
                    <input type="text" data-output class="form-input font-mono text-sm" readonly .value=${this.output} />
                </label>
                <div class="flex flex-wrap items-center justify-end gap-2">
                    <button class="btn btn-red" @click=${this.reset}>Reset</button>
                    <button class="btn btn-blue" data-extension="png" ?disabled=${!this.ready} @click=${this.download}>Download PNG</button>
                    <button class="btn btn-blue" data-extension="svg" ?disabled=${!this.ready} @click=${this.download}>Download SVG</button>
                    <t-copy-button .isIcon=${false} .text=${this.output} .disabled=${!this.output}></t-copy-button>
                    <a class="btn btn-green" href=${this.output || '#'} target="_blank" rel="noopener noreferrer"
                        aria-disabled=${!this.output} tabindex=${this.output ? 0 : -1}>Open WhatsApp</a>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'whatsapp-qr-generator': WhatsappQrGenerator;
    }
}

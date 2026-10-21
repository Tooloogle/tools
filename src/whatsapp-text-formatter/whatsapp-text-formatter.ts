import { html, svg } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import whatsappTextFormatterStyles from './whatsapp-text-formatter.css.js';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { buildWhatsAppUrl } from '../_utils/messaging-links.js';
import { formatSelection, renderMessagePreview, type TextSelection } from './formatting.js';
import '../t-copy-button/index.js';

const TOOLS = [
    { command: 'bold', label: 'Bold',
        icon: svg`<path stroke-width="2" d="M5 3h3a2.5 2.5 0 0 1 0 5H5m3 0a2.5 2.5 0 0 1 0 5H5V3"/>` },
    { command: 'italic', label: 'Italic',
        icon: svg`<path d="M7 3h5M4 13h5M10 3 6 13"/>` },
    { command: 'strike', label: 'Strikethrough',
        icon: svg`<path d="M11 4c-1-2-6-2-6 1 0 1.5 2 2 3 2.5M5 11c1 3 6 2 6 0 0-1-1-1.5-2-2M2 8.5h12"/>` },
    { command: 'monospace', label: 'Monospace',
        icon: svg`<rect x="1.5" y="1.5" width="13" height="13" rx="2"/>
            <path d="m6 5-3 3 3 3m4-6 3 3-3 3"/>` },
    { command: 'code', label: 'Inline code',
        icon: svg`<path d="m5 4-4 4 4 4m6-8 4 4-4 4M9 3 7 13"/>` },
    { command: 'bullet', label: 'Bulleted list',
        icon: svg`<path d="M6 3h8M6 8h8M6 13h8"/>
            <path stroke-width="3" d="M2 3h.01M2 8h.01M2 13h.01"/>` },
    { command: 'numbered', label: 'Numbered list',
        icon: svg`<path d="M7 4h7M7 12h7M2 2h1v4M2 6h2M1.5 10a1.5 1.5 0 0 1 3 0c0 1-3 2-3 3H5"/>` },
    { command: 'quote', label: 'Quote',
        icon: svg`<path d="M2 4h4v5c0 2-1 3-3 3M2 4v4h4m4-4h4v5c0 2-1 3-3 3m-1-8v4h4"/>` },
    { command: 'undo', label: 'Undo',
        icon: svg`<path d="m5 2-4 4 4 4M1 6h8a4 4 0 0 1 0 8H7"/>` },
    { command: 'redo', label: 'Redo',
        icon: svg`<path d="m11 2 4 4-4 4m4-4H7a4 4 0 0 0 0 8h2"/>` },
];

@customElement('whatsapp-text-formatter')
export class WhatsappTextFormatter extends WebComponentBase {
    static override styles = [WebComponentBase.styles, whatsappTextFormatterStyles];

    @property() text = '';
    @property() phone = '';
    @property() sendUrl = '';
    @property() error = '';
    @state() private past: TextSelection[] = [];
    @state() private future: TextSelection[] = [];
    private beforeEdit?: TextSelection;

    private get editor() {
        return this.shadowRoot?.querySelector<HTMLTextAreaElement>('textarea[name="message"]');
    }

    private selection(): TextSelection {
        return { text: this.text, start: this.editor?.selectionStart ?? 0, end: this.editor?.selectionEnd ?? 0 };
    }

    private remember(selection: TextSelection) {
        this.past = [...this.past.slice(-99), selection];
        this.future = [];
    }

    private beforeInput() {
        this.beforeEdit = this.selection();
    }

    private changeText(event: Event) {
        this.remember(this.beforeEdit ?? { text: this.text, start: this.text.length, end: this.text.length });
        this.beforeEdit = undefined;
        this.text = (event.target as HTMLTextAreaElement).value;
        this.refreshSend();
    }

    private changePhone(event: Event) {
        this.phone = (event.target as HTMLInputElement).value;
        this.refreshSend();
    }

    private refreshSend() {
        this.error = '';
        this.sendUrl = '';
        try {
            const url = buildWhatsAppUrl(this.phone, this.text);
            this.sendUrl = this.text.trim() ? url : '';
        } catch (error) {
            this.error = (error as Error).message;
        }
    }

    private apply(selection: TextSelection) {
        this.text = selection.text;
        this.refreshSend();
        void this.updateComplete.then(() => {
            if (this.isConnected) {
                this.editor?.focus();
                this.editor?.setSelectionRange(selection.start, selection.end);
            }
        });
    }

    private history(command: string) {
        const undo = command === 'undo';
        const source = undo ? this.past : this.future;
        const previous = source[source.length - 1];
        if (!previous) {
            return;
        }

        if (undo) {
            this.future = [...this.future, this.selection()];
            this.past = source.slice(0, -1);
        } else {
            this.past = [...this.past, this.selection()];
            this.future = source.slice(0, -1);
        }

        this.apply(previous);
    }

    private command(event: Event) {
        const command = (event.currentTarget as HTMLButtonElement).dataset.command!;
        if (command === 'undo' || command === 'redo') {
            this.history(command);
            return;
        }

        const selection = this.selection();
        this.remember(selection);
        this.apply(formatSelection(selection, command));
    }

    private keepSelection(event: Event) {
        event.preventDefault();
    }

    private keydown(event: KeyboardEvent) {
        if (!(event.ctrlKey || event.metaKey)) {
            return;
        }

        const key = event.key.toLowerCase();
        if (key === 'z' || key === 'y') {
            event.preventDefault();
            this.history(key === 'y' || event.shiftKey ? 'redo' : 'undo');
        }
    }

    private reset() {
        this.remember(this.selection());
        this.phone = '';
        this.apply({ text: '', start: 0, end: 0 });
    }

    private toolKey = (tool: typeof TOOLS[number]) => tool.command;

    private renderTool = (tool: typeof TOOLS[number]) => html`
        <button type="button" class="tool-button" title=${tool.label} aria-label=${tool.label}
            data-command=${tool.command} @pointerdown=${this.keepSelection} @click=${this.command}
            ?disabled=${(tool.command === 'undo' && !this.past.length) || (tool.command === 'redo' && !this.future.length)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"
                fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                stroke-linejoin="round" aria-hidden="true" focusable="false">${tool.icon}</svg>
            <span class="tool-tooltip" role="tooltip">${tool.label}</span>
        </button>`;

    override render() {
        return html`
            <div class="space-y-4 text-gray-900 dark:text-gray-100">
                <div class="toolbar" role="group" aria-label="Message formatting">
                    ${repeat(TOOLS, this.toolKey, this.renderTool)}
                </div>
                <label class="block">Message
                    <textarea name="message" class="form-textarea" rows="8" .value=${this.text}
                        @beforeinput=${this.beforeInput} @input=${this.changeText} @keydown=${this.keydown}></textarea>
                </label>
                <div>
                    <span class="block py-1 font-bold">Preview</span>
                    <div class="card-muted message-preview">${renderMessagePreview(this.text)}</div>
                </div>
                <label class="block">Recipient with country code (optional)
                    <input name="phone" type="tel" class="form-input" placeholder="+1 202 555 0123"
                        .value=${this.phone} @input=${this.changePhone} />
                </label>
                ${this.error ? html`<p role="alert" class="text-red-700 dark:text-red-300">${this.error}</p>` : ''}
                <div class="flex flex-wrap items-center justify-end gap-2">
                    <button class="btn btn-red" @click=${this.reset}>Reset</button>
                    <t-copy-button .isIcon=${false} .text=${this.text} .disabled=${!this.text}></t-copy-button>
                    <a class="btn btn-green" href=${this.sendUrl || '#'} target="_blank" rel="noopener noreferrer"
                        aria-disabled=${!this.sendUrl} tabindex=${this.sendUrl ? 0 : -1}>Send to WhatsApp</a>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'whatsapp-text-formatter': WhatsappTextFormatter;
    }
}

import { html, nothing } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import tFileDropzoneStyles from './t-file-dropzone.css.js';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

export interface TFileDropzoneChangeDetail {
    file: File | null;
    files: File[];
}

@customElement('t-file-dropzone')
export class TFileDropzone extends WebComponentBase {
    static override styles = [WebComponentBase.styles, tFileDropzoneStyles];

    @property({ type: String })
    accept = '';

    @property({ type: Boolean })
    multiple = false;

    @property({ type: Boolean })
    disabled = false;

    @property({ type: String })
    label = 'Drop a file here or click to browse';

    @property({ type: String })
    hint = '';

    @property({ attribute: false })
    file: File | null = null;

    @property({ attribute: false })
    files: File[] = [];

    @state()
    private isDragging = false;

    private get inputEl(): HTMLInputElement | null {
        return this.renderRoot.querySelector('input[type="file"]');
    }

    private openPicker = () => {
        if (this.disabled) {
            return;
        }

        this.inputEl?.click();
    };

    private onKeyDown = (e: KeyboardEvent) => {
        if (this.disabled) {
            return;
        }

        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.openPicker();
        }
    };

    private onInputChange = (e: Event) => {
        const input = e.target as HTMLInputElement;
        const list = input.files ? Array.from(input.files) : [];
        this.commitFiles(list);
    };

    private onDragOver = (e: DragEvent) => {
        // Always preventDefault so the browser doesn't navigate to the dropped
        // file when this dropzone is disabled.
        e.preventDefault();
        if (this.disabled) {
            return;
        }

        if (e.dataTransfer) {
            e.dataTransfer.dropEffect = 'copy';
        }

        if (!this.isDragging) {
            this.isDragging = true;
        }
    };

    private onDragLeave = (e: DragEvent) => {
        if (e.currentTarget === e.target) {
            this.isDragging = false;
        }
    };

    private onDrop = (e: DragEvent) => {
        // Always preventDefault so a disabled dropzone doesn't let the browser
        // open/navigate to the dropped file.
        e.preventDefault();
        if (this.disabled) {
            return;
        }

        this.isDragging = false;
        const dropped = e.dataTransfer?.files ? Array.from(e.dataTransfer.files) : [];
        const accepted = dropped.filter(f => this.matchesAccept(f));
        const rejectedCount = dropped.length - accepted.length;
        if (rejectedCount > 0) {
            console.warn(`t-file-dropzone: ${rejectedCount} file(s) rejected (did not match accept="${this.accept}")`);
        }

        if (!accepted.length) {
            return;
        }

        this.commitFiles(accepted);
    };

    private matchesAccept(file: File): boolean {
        if (!this.accept || this.accept === '*' || this.accept === '*/*') {
            return true;
        }

        const tokens = this.accept.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
        if (!tokens.length) {
            return true;
        }

        const name = file.name.toLowerCase();
        const type = file.type.toLowerCase();
        // File.type can be empty for some dropped files (e.g. unknown ext).
        // Stay lenient and fall back to extension-only matching in that case so
        // the drop UX matches what the native picker would have allowed.
        if (!type) {
            const extTokens = tokens.filter(t => t.startsWith('.'));
            if (!extTokens.length) {
                return true;
            }

            return extTokens.some(t => name.endsWith(t));
        }

        return tokens.some(token => {
            if (token.startsWith('.')) {
                return name.endsWith(token);
            }

            if (token.endsWith('/*')) {
                const prefix = token.slice(0, -1);
                return type.startsWith(prefix);
            }

            return type === token;
        });
    }

    private commitFiles(list: File[]) {
        const trimmed = this.multiple ? list : list.slice(0, 1);
        this.files = trimmed;
        this.file = trimmed[0] ?? null;
        this.dispatchEvent(new CustomEvent<TFileDropzoneChangeDetail>('change', {
            detail: { file: this.file, files: this.files },
            bubbles: true,
            composed: true,
        }));
    }

    override render() {
        const fileLabel = this.files.length > 1
            ? `${this.files.length} files selected`
            : this.file?.name ?? '';

        return html`
            <div
                class=${classMap({ dropzone: true, 'is-dragging': this.isDragging })}
                role="button"
                tabindex=${this.disabled ? -1 : 0}
                aria-disabled=${this.disabled ? 'true' : 'false'}
                aria-label=${this.label}
                @click=${this.openPicker}
                @keydown=${this.onKeyDown}
                @dragenter=${this.onDragOver}
                @dragover=${this.onDragOver}
                @dragleave=${this.onDragLeave}
                @drop=${this.onDrop}
            >
                <span class="dropzone-label">${this.label}</span>
                ${this.hint ? html`<span class="dropzone-hint">${this.hint}</span>` : null}
                ${fileLabel ? html`<span class="dropzone-file">${fileLabel}</span>` : null}
                <input
                    class="dropzone-input"
                    type="file"
                    accept=${this.accept || nothing}
                    ?multiple=${this.multiple}
                    ?disabled=${this.disabled}
                    @change=${this.onInputChange}
                />
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        't-file-dropzone': TFileDropzone;
    }
}

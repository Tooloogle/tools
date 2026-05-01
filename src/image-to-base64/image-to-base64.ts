import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import imageToBase64Styles from './image-to-base64.css.js';
import { customElement, property } from 'lit/decorators.js';
import { downloadText } from '../_utils/DomUtils.js';
import { when } from 'lit/directives/when.js';
import '../t-copy-button/index.js';
import '../t-file-dropzone/index.js';
import type { TFileDropzoneChangeDetail } from '../t-file-dropzone/t-file-dropzone.js';

@customElement('image-to-base64')
export class ImageToBase64 extends WebComponentBase {
    static override styles = [WebComponentBase.styles, imageToBase64Styles];

    @property()
    image = "";

    @property()
    base64 = "";

    async onImageChange(e: CustomEvent<TFileDropzoneChangeDetail>) {
        const file = e.detail.file;
        if (file) {
            this.base64 = await this.getBase64(file) || "";
        } else {
            this.base64 = "";
        }
    }

    getBase64(file: File): Promise<string | undefined> {
        return new Promise((resove, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                resove(reader.result?.toString());
            };

            reader.onerror = function (error) {
                reject(error);
            };
        });
    }

    private downloadBase64() {
        downloadText(this.base64);
    }

    override render() {
        return html`
            <div>
                <t-file-dropzone
                    accept="image/*"
                    label="Drop an image here or click to browse"
                    @change=${this.onImageChange}
                ></t-file-dropzone>
                ${when(this.base64, () => html`
                    <div class="py-3">
                        <img class="w-full" src=${this.base64} />
                    </div>
                `)}
                <label class="block">
                    <span class="inline-block py-1">Base64 string</span>
                    <textarea
                        name="base64"
                        class="form-textarea"
                        rows="5"
                        placeholder="Base64 string"
                        .value=${this.base64}
                        readonly></textarea>
                </label>

                <div class="text-right">
                    <button class="btn btn-blue btn-sm" @click=${this.downloadBase64}>Download Base64 text</button>
                    <t-copy-button .isIcon=${false} .text=${this.base64}></t-copy-button>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'image-to-base64': ImageToBase64;
    }
}

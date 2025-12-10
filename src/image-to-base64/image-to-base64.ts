import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import imageToBase64Styles from './image-to-base64.css.js';
import { customElement, property } from 'lit/decorators.js';
import { downloadText } from '../_utils/DomUtils.js';
import { when } from 'lit/directives/when.js';
import "../t-copy-button/t-copy-button.js";
import '../t-button';
import '../t-textarea';

@customElement('image-to-base64')
export class ImageToBase64 extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, imageToBase64Styles];

    @property()
    image = "";

    @property()
    base64 = "";

    async onImageChange(e: Event) {
        const input = e.target as HTMLInputElement;
        if (input?.files?.length && input.files[0]) {
            this.base64 = await this.getBase64(input.files[0]) || "";
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
                <label class="block">
                    <span class="inline-block py-1">Image: </span>
                    <input
                        name="image"
                        accept="image/*"
                        type="file"
                        .value=${this.image}
                        @change=${this.onImageChange}></input>
                </label>
                ${when(this.base64, () => html`
                    <div class="py-3">
                        <img class="w-full" src=${this.base64} />
                    </div>
                `)}
                <label class="block">
                    <span class="inline-block py-1">Base64 string</span>
                    <t-textarea placeholder="Base64 string" rows="5" ?readonly=${true}></t-textarea>
                </label>

                <div class="text-right">
                    <t-button variant="blue" class="btn-sm">Download Base64 text</t-button>
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

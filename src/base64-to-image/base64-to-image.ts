import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import base64ToImageStyles from './base64-to-image.css.js';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { downloadImage } from '../_utils/DomUtils.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';

@customElement('base64-to-image')
export class Base64ToImage extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, base64ToImageStyles, inputStyles, buttonStyles];

    @property()
    base64 = "";

    getFileType(base64Data: string) {
        if (base64Data.indexOf('data:image/') === -1) {
            return;
        }

        return base64Data.substring("data:image/".length, base64Data.indexOf(";base64"));
    }

    override render() {
        return html`
            <div>
                <label class="block">
                    <span class="inline-block py-1">Base64 string to decode (encoded)</span>
                    <textarea
                        name="email"
                        class="form-textarea"
                        rows="5"
                        placeholder="Enter base64 string to decode"
                        .value=${this.base64}
                        @keyup=${(e: any) => this.base64 = e.target?.value}></textarea>
                </label>

                ${when(this.base64, () => html`
                    <div class="py-3">
                        <img class="w-full" src=${this.base64} />
                    </div>
                `)}
                
                <div class="text-right">
                    <a id="download-btn" class="btn btn-green cursor-pointer" @click=${() => downloadImage(`result.${this.getFileType(this.base64)}`, this.base64)}>Download image</a>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'base64-to-image': Base64ToImage;
    }
}

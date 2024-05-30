import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import qrCodeGeneratorStyles from './qr-code-generator.css.js';
import { customElement, property } from 'lit/decorators.js';
import { Extension, QRCodeStyling } from "../_libs/qr-code-styling/qr-code-styling.js";
import { Ref, createRef, ref } from 'lit/directives/ref.js';
import inputStyles from '../_styles/input.css.js';
import { repeat } from 'lit/directives/repeat.js';
import { IQrStyleListItem, QrStyleList } from './qr-style-list.js';
import { Logo } from './logo.js';
import buttonStyles from '../_styles/button.css.js';

@customElement('qr-code-generator')
export class QrCodeGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, qrCodeGeneratorStyles, inputStyles, buttonStyles];
    container: Ref<HTMLDivElement> = createRef();
    qrCode = new QRCodeStyling({ ...QrStyleList[2].qrCfg, width: 300, height: 300 });

    @property()
    text = "";

    @property()
    image = Logo;

    @property()
    selected = 2;

    @property()
    width = 300;

    @property()
    height = 300;

    @property()
    margin = 5;

    @property()
    bgColor = "#ffffff";

    @property()
    dotColor = "#4267b2";

    @property()
    squareColor = "#4267b2";

    @property()
    downloadExt: Extension = "jpeg";

    async connectedCallback() {
        super.connectedCallback();
        setTimeout(() => {
            this.text = "https://www.tooloogle.com/";
            this.qrCode.append(this.container.value);
            this.onTextChange();
        }, 0);
    }

    onTextChange(e?: any) {
        if (e?.target?.value) {
            this.text = e.target.value;
        }

        this.qrCode.update({ data: this.text, margin: this.margin });
    }

    renderQrListItem(el: HTMLSpanElement, qr: IQrStyleListItem) {
        if (!el || el.querySelector("canvas")) {
            return;
        }

        const qrCode = new QRCodeStyling({
            ...qr.qrCfg,
            image: this.image
        });
        qrCode.append(el);
    }

    onQrListItemClick(qr: IQrStyleListItem, index: number) {
        this.selected = index;
        this.qrCode.update({
            ...qr.qrCfg,
            width: this.width,
            height: this.height,
            data: this.text,
            image: this.image,
            margin: this.margin,
        });

        this.qrCode.update({
            backgroundOptions: {
                color: this.bgColor
            },
            dotsOptions: {
                color: this.dotColor
            },
            cornersSquareOptions: {
                color: this.squareColor
            },
            margin: this.margin
        });
    }

    async onImageUpload(e: any) {
        if (!e?.target?.files?.length) {
            return;
        } else {
            this.image = this.downloadExt;
        }

        this.image = await this.fileToBase64(e.target.files[0]);
        this.qrCode.update({ image: this.image });
    }

    download() {
        this.qrCode.download({
            name: "qr-tooloogle",
            extension: this.downloadExt
        });
    }

    private fileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result?.toString() || "");
            reader.onerror = reject;
        });
    }

    override render() {
        return html`
            <div class="qr-code-generator">
                <div class="grid grid-cols-1 gap-4">
                    <lable>
                        URL/Plain Text
                        <textarea
                            placeholder="Please enter the contents to be encoded into the QR Code."
                            rows="3"
                            class="form-textarea"
                            .value=${this.text}
                            @keyup=${this.onTextChange}
                            @change=${this.onTextChange}></textarea>
                    </lable>
                    <div class="flex justify-between gap-2">
                        <lable>
                            Width
                            <input
                                class="form-input"
                                type="number"
                                .value=${this.width}
                                @keyup=${(e: any) => { this.width = e.target?.value || 300; this.qrCode.update({ width: this.width }) }} />
                        </lable>
                        <lable>
                            Height
                            <input
                                class="form-input"
                                type="number"
                                .value=${this.height}
                                @keyup=${(e: any) => { this.height = e.target?.value || 300; this.qrCode.update({ height: this.height }) }} />
                        </lable>
                    </div>
                    <lable>
                        Margin
                        <input
                            class="w-full"
                            .value=${this.margin}
                            type="range"
                            min="0"
                            max="100"
                            @change=${(e: any) => { this.margin = e?.target?.value; this.qrCode.update({ margin: this.margin }); }}></textarea>
                    </lable>
                    <div class="grid grid-cols-3 gap-4">
                        <lable>
                            Background
                            <input
                                class="w-full"
                                type="color"
                                .value=${this.bgColor}
                                @change=${(e: any) => { this.bgColor = e.target?.value || "#ffffff"; this.qrCode.update({ backgroundOptions: { color: this.bgColor } }) }} />
                        </lable>
                        <lable>
                            Dot/Pixel
                            <input
                                class="w-full"
                                type="color"
                                .value=${this.dotColor}
                                @change=${(e: any) => { this.dotColor = e.target?.value || "#4267b2"; this.qrCode.update({ dotsOptions: { color: this.dotColor } }) }} />
                        </lable>
                        <lable>
                            Corners
                            <input
                                class="w-full"
                                type="color"
                                .value=${this.squareColor}
                                @change=${(e: any) => { this.squareColor = e.target?.value || "#4267b2"; this.qrCode.update({ cornersSquareOptions: { color: this.squareColor } }) }} />
                        </lable>
                    </div>
                    <div class="flex justify-between items-center">
                        <lable>
                            Logo
                            <input
                                class="w-full"
                                type="file"
                                accept="image/*"
                                @change=${this.onImageUpload} />
                        </lable>
                        <button class="btn btn-red btn-sm btn-remove" @click=${() => { this.image = ""; this.qrCode.update({ image: "" }) }}>Remove logo</button>
                    </div>
                    <div class="qr-style-list">
                        ${repeat(QrStyleList, (qr, i) => html`
                            <span 
                                ${ref(el => { this.renderQrListItem(el as HTMLSpanElement, qr); })}
                                class=${i === this.selected ? "selected" : ""}
                                @click=${() => this.onQrListItemClick(qr, i)}>
                            </span>
                        `)}
                    </div>
                </div>
                <div>
                    <div class="text-center qr" ${ref(this.container)}></div>
                    <div class="grid grid-cols-2 gap-4">
                        <select class="form-select" @change=${(e: any) => this.downloadExt = e.target?.value || "jpeg"}>
                            <option>jpeg</option>
                            <option>png</option>
                            <option>svg</option>
                            <option>webp</option>
                        </select>
                        <button class="btn btn-green btn-sm" @click=${this.download}>Download</button>
                    </div>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'qr-code-generator': QrCodeGenerator;
    }
}

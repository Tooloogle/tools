import { html, svg } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import { hasClipboard } from '../_utils/DomUtils.js';
import tCopyButtonStyles from './t-copy-button.css.js';
import tooltipStyles from '../_styles/tooltip.css.js';
import { when } from 'lit/directives/when.js';
import buttonStyles from '../_styles/button.css.js';

@customElement('t-copy-button')
export class TCopyButton extends WebComponentBase<IConfigBase> {
    static override styles = [tCopyButtonStyles, tooltipStyles, buttonStyles];

    @property()
    isIcon = true;

    @property()
    text = "";

    @property()
    copying = false;

    @property()
    title = "Copy to clipboard";

    onClick() {
        if (!this.text) {
            return;
        }

        this.copying = true;
        if (hasClipboard()) {
            setTimeout(() => {
                navigator.clipboard.writeText(this.text).finally(() => {
                    this.copying = false;
                    this.title = "Copied to clipboard!";
                });
            }, 100);
        }
    }

    override render() {
        return html`
            <span 
                class="inline-block ${this.isIcon ? "px-1" : ""} cursor-pointer text-slate-400 tooltip-wrapper"
                @click=${this.onClick}
                @mouseleave=${() => this.title = "Copy to clipboard"}>
                ${when(this.isIcon, () => html`
                    <span class="text-lg">
                        ${!this.copying ? "❏" : ""}
                        ${this.copying ? "✅" : ""}
                    </span>
                `)}

                ${when(!this.isIcon, () => html`
                    <button class="btn btn-green btn-sm">Copy</button>
                `)}

                <div class="tooltip" style="min-width: 130px">${this.title}</div>
            </span>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        't-copy-button': TCopyButton;
    }
}

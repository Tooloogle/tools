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
    size = "20px";

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
                navigator.clipboard.writeText(this.text);
                this.copying = false;
                this.title = "Copied to clipboard!";
            }, 100);
        }
    }

    override render() {
        return html`
            <span 
                class="inline-block ${this.isIcon ? "px-3" : ""} cursor-pointer stroke-slate-400 fill-slate-400 tooltip-wrapper"
                style="line-height: ${this.size}"
                @click=${this.onClick}
                @mouseleave=${() => this.title = "Copy to clipboard"}>
                ${when(this.isIcon, () => html`
                    ${!this.copying ? svg`<?xml version="1.0" encoding="utf-8"?>
                        <svg width=${this.size} height=${this.size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 11C6 8.17157 6 6.75736 6.87868 5.87868C7.75736 5 9.17157 5 12 5H15C17.8284 5 19.2426 5 20.1213 5.87868C21 6.75736 21 8.17157 21 11V16C21 18.8284 21 20.2426 20.1213 21.1213C19.2426 22 17.8284 22 15 22H12C9.17157 22 7.75736 22 6.87868 21.1213C6 20.2426 6 18.8284 6 16V11Z" stroke-width="1.5"/>
                            <path d="M6 19C4.34315 19 3 17.6569 3 16V10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H15C16.6569 2 18 3.34315 18 5" stroke-width="1.5"/>
                        </svg>
                        `: ""}

                    ${this.copying ? svg`
                        <?xml version="1.0" encoding="utf-8"?>
                        <svg width=${this.size} height=${this.size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.59961 11.3974C6.59961 8.67119 6.59961 7.3081 7.44314 6.46118C8.28667 5.61426 9.64432 5.61426 12.3596 5.61426H15.2396C17.9549 5.61426 19.3125 5.61426 20.1561 6.46118C20.9996 7.3081 20.9996 8.6712 20.9996 11.3974V16.2167C20.9996 18.9429 20.9996 20.306 20.1561 21.1529C19.3125 21.9998 17.9549 21.9998 15.2396 21.9998H12.3596C9.64432 21.9998 8.28667 21.9998 7.44314 21.1529C6.59961 20.306 6.59961 18.9429 6.59961 16.2167V11.3974Z" fill="#1C274C"/>
                            <path opacity="0.5" d="M4.17157 3.17157C3 4.34315 3 6.22876 3 10V12C3 15.7712 3 17.6569 4.17157 18.8284C4.78913 19.446 5.6051 19.738 6.79105 19.8761C6.59961 19.0353 6.59961 17.8796 6.59961 16.2167V11.3974C6.59961 8.6712 6.59961 7.3081 7.44314 6.46118C8.28667 5.61426 9.64432 5.61426 12.3596 5.61426H15.2396C16.8915 5.61426 18.0409 5.61426 18.8777 5.80494C18.7403 4.61146 18.4484 3.79154 17.8284 3.17157C16.6569 2 14.7712 2 11 2C7.22876 2 5.34315 2 4.17157 3.17157Z" fill="#1C274C"/>
                        </svg>
                    `: ""}
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

import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import colorMixerStyles from './color-mixer.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('color-mixer')
export class ColorMixer extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, colorMixerStyles];

    override render() {
        return html`
            <h2>
                color-mixer
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'color-mixer': ColorMixer;
    }
}

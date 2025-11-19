import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import colorBlindnessSimulatorStyles from './color-blindness-simulator.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('color-blindness-simulator')
export class ColorBlindnessSimulator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, colorBlindnessSimulatorStyles];

    override render() {
        return html`
            <h2>
                color-blindness-simulator
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'color-blindness-simulator': ColorBlindnessSimulator;
    }
}

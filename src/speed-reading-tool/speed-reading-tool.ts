import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import speedReadingToolStyles from './speed-reading-tool.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('speed-reading-tool')
export class SpeedReadingTool extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, speedReadingToolStyles];

    override render() {
        return html`
            <h2>
                speed-reading-tool
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'speed-reading-tool': SpeedReadingTool;
    }
}

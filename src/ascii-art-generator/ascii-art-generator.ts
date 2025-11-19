import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import asciiArtGeneratorStyles from './ascii-art-generator.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('ascii-art-generator')
export class AsciiArtGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, asciiArtGeneratorStyles];

    override render() {
        return html`
            <h2>
                ascii-art-generator
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'ascii-art-generator': AsciiArtGenerator;
    }
}

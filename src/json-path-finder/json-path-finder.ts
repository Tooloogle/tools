import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import jsonPathFinderStyles from './json-path-finder.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('json-path-finder')
export class JsonPathFinder extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, jsonPathFinderStyles];

    override render() {
        return html`
            <h2>
                json-path-finder
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'json-path-finder': JsonPathFinder;
    }
}

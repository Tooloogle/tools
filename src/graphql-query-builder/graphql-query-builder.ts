import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import graphqlQueryBuilderStyles from './graphql-query-builder.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('graphql-query-builder')
export class GraphqlQueryBuilder extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, graphqlQueryBuilderStyles];

    override render() {
        return html`
            <h2>
                graphql-query-builder
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'graphql-query-builder': GraphqlQueryBuilder;
    }
}

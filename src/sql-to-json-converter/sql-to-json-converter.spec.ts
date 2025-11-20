import { LitElement } from 'lit';
import { SqlToJsonConverter } from "./sql-to-json-converter.js";

describe('sql-to-json-converter web component test', () => {

    const componentTag = "sql-to-json-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of SqlToJsonConverter', () => {
        const component = window.document.createElement(componentTag) as SqlToJsonConverter;
        expect(component).toBeInstanceOf(SqlToJsonConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

import { LitElement } from 'lit';
import { JsonToSqlConverter } from "./json-to-sql-converter.js";

describe('json-to-sql-converter web component test', () => {

    const componentTag = "json-to-sql-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of JsonToSqlConverter', () => {
        const component = window.document.createElement(componentTag) as JsonToSqlConverter;
        expect(component).toBeInstanceOf(JsonToSqlConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

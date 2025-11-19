import { LitElement } from 'lit';
import { SqlFormatter } from "./sql-formatter.js";

describe('sql-formatter web component test', () => {

    const componentTag = "sql-formatter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of SqlFormatter', () => {
        const component = window.document.createElement(componentTag) as SqlFormatter;
        expect(component).toBeInstanceOf(SqlFormatter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

import { LitElement } from 'lit';
import { UrlParser } from "./url-parser.js";

describe('url-parser web component test', () => {

    const componentTag = "url-parser";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of UrlParser', () => {
        const component = window.document.createElement(componentTag) as UrlParser;
        expect(component).toBeInstanceOf(UrlParser);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

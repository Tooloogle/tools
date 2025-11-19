import { LitElement } from 'lit';
import { XmlFormatter } from "./xml-formatter.js";

describe('xml-formatter web component test', () => {

    const componentTag = "xml-formatter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of XmlFormatter', () => {
        const component = window.document.createElement(componentTag) as XmlFormatter;
        expect(component).toBeInstanceOf(XmlFormatter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

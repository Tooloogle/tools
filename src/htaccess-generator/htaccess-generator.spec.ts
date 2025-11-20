import { LitElement } from 'lit';
import { HtaccessGenerator } from "./htaccess-generator.js";

describe('htaccess-generator web component test', () => {

    const componentTag = "htaccess-generator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of HtaccessGenerator', () => {
        const component = window.document.createElement(componentTag) as HtaccessGenerator;
        expect(component).toBeInstanceOf(HtaccessGenerator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

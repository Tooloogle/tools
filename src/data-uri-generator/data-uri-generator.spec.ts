import { LitElement } from 'lit';
import { DataUriGenerator } from "./data-uri-generator.js";

describe('data-uri-generator web component test', () => {

    const componentTag = "data-uri-generator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of DataUriGenerator', () => {
        const component = window.document.createElement(componentTag) as DataUriGenerator;
        expect(component).toBeInstanceOf(DataUriGenerator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

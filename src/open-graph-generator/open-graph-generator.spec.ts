import { LitElement } from 'lit';
import { OpenGraphGenerator } from "./open-graph-generator.js";

describe('open-graph-generator web component test', () => {

    const componentTag = "open-graph-generator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of OpenGraphGenerator', () => {
        const component = window.document.createElement(componentTag) as OpenGraphGenerator;
        expect(component).toBeInstanceOf(OpenGraphGenerator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

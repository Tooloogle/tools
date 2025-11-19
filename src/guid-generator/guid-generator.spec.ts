import { LitElement } from 'lit';
import { GuidGenerator } from "./guid-generator.js";

describe('guid-generator web component test', () => {

    const componentTag = "guid-generator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of GuidGenerator', () => {
        const component = window.document.createElement(componentTag) as GuidGenerator;
        expect(component).toBeInstanceOf(GuidGenerator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

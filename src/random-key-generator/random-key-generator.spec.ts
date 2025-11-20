import { LitElement } from 'lit';
import { RandomKeyGenerator } from "./random-key-generator.js";

describe('random-key-generator web component test', () => {

    const componentTag = "random-key-generator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of RandomKeyGenerator', () => {
        const component = window.document.createElement(componentTag) as RandomKeyGenerator;
        expect(component).toBeInstanceOf(RandomKeyGenerator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

import { LitElement } from 'lit';
import { RandomDataGenerator } from "./random-data-generator.js";

describe('random-data-generator web component test', () => {

    const componentTag = "random-data-generator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of RandomDataGenerator', () => {
        const component = window.document.createElement(componentTag) as RandomDataGenerator;
        expect(component).toBeInstanceOf(RandomDataGenerator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

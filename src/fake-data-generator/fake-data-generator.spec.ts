import { LitElement } from 'lit';
import { FakeDataGenerator } from "./fake-data-generator.js";

describe('fake-data-generator web component test', () => {

    const componentTag = "fake-data-generator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of FakeDataGenerator', () => {
        const component = window.document.createElement(componentTag) as FakeDataGenerator;
        expect(component).toBeInstanceOf(FakeDataGenerator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

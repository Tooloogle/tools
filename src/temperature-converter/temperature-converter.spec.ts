import { LitElement } from 'lit';
import { TemperatureConverter } from "./temperature-converter.js";

describe('temperature-converter web component test', () => {

    const componentTag = "temperature-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of TemperatureConverter', () => {
        const component = window.document.createElement(componentTag) as TemperatureConverter;
        expect(component).toBeInstanceOf(TemperatureConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

import { LitElement } from 'lit';
import { FibonacciGenerator } from "./fibonacci-generator.js";

describe('fibonacci-generator web component test', () => {

    const componentTag = "fibonacci-generator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of FibonacciGenerator', () => {
        const component = window.document.createElement(componentTag) as FibonacciGenerator;
        expect(component).toBeInstanceOf(FibonacciGenerator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

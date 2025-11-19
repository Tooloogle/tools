import { LitElement } from 'lit';
import { ColorNameFinder } from "./color-name-finder.js";

describe('color-name-finder web component test', () => {

    const componentTag = "color-name-finder";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of ColorNameFinder', () => {
        const component = window.document.createElement(componentTag) as ColorNameFinder;
        expect(component).toBeInstanceOf(ColorNameFinder);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

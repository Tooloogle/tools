import { LitElement } from 'lit';
import { ColorContrastChecker } from "./color-contrast-checker.js";

describe('color-contrast-checker web component test', () => {

    const componentTag = "color-contrast-checker";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of ColorContrastChecker', () => {
        const component = window.document.createElement(componentTag) as ColorContrastChecker;
        expect(component).toBeInstanceOf(ColorContrastChecker);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

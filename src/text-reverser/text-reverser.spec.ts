import { LitElement } from 'lit';
import { TextReverser } from "./text-reverser.js";

describe('text-reverser web component test', () => {

    const componentTag = "text-reverser";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of TextReverser', () => {
        const component = window.document.createElement(componentTag) as TextReverser;
        expect(component).toBeInstanceOf(TextReverser);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

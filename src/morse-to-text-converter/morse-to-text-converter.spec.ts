import { LitElement } from 'lit';
import { MorseToTextConverter } from "./morse-to-text-converter.js";

describe('morse-to-text-converter web component test', () => {

    const componentTag = "morse-to-text-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of MorseToTextConverter', () => {
        const component = window.document.createElement(componentTag) as MorseToTextConverter;
        expect(component).toBeInstanceOf(MorseToTextConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

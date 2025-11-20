import { LitElement } from 'lit';
import { TextToMorseConverter } from "./text-to-morse-converter.js";

describe('text-to-morse-converter web component test', () => {

    const componentTag = "text-to-morse-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of TextToMorseConverter', () => {
        const component = window.document.createElement(componentTag) as TextToMorseConverter;
        expect(component).toBeInstanceOf(TextToMorseConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

import { LitElement } from 'lit';
import { UnicodeConverter } from "./unicode-converter.js";

describe('unicode-converter web component test', () => {

    const componentTag = "unicode-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of UnicodeConverter', () => {
        const component = window.document.createElement(componentTag) as UnicodeConverter;
        expect(component).toBeInstanceOf(UnicodeConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

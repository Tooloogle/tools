import { LitElement } from 'lit';
import { MultiBaseConverter } from "./multi-base-converter.js";

describe('multi-base-converter web component test', () => {

    const componentTag = "multi-base-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of MultiBaseConverter', () => {
        const component = window.document.createElement(componentTag) as MultiBaseConverter;
        expect(component).toBeInstanceOf(MultiBaseConverter);
    });

    it('should have empty input by default', () => {
        const component = window.document.createElement(componentTag) as MultiBaseConverter;
        expect(component.inputValue).toBe('');
    });

    it('should have base 10 as default input base', () => {
        const component = window.document.createElement(componentTag) as MultiBaseConverter;
        expect(component.inputBase).toBe(10);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

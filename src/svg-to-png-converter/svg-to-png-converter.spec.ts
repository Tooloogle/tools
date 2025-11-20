import { LitElement } from 'lit';
import { SvgToPngConverter } from "./svg-to-png-converter.js";

describe('svg-to-png-converter web component test', () => {

    const componentTag = "svg-to-png-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of SvgToPngConverter', () => {
        const component = window.document.createElement(componentTag) as SvgToPngConverter;
        expect(component).toBeInstanceOf(SvgToPngConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

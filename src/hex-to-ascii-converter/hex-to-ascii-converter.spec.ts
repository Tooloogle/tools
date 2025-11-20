import { LitElement } from 'lit';
import { HexToAsciiConverter } from "./hex-to-ascii-converter.js";

describe('hex-to-ascii-converter web component test', () => {

    const componentTag = "hex-to-ascii-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of HexToAsciiConverter', () => {
        const component = window.document.createElement(componentTag) as HexToAsciiConverter;
        expect(component).toBeInstanceOf(HexToAsciiConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

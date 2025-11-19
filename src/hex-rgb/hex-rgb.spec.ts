import { LitElement } from 'lit';
import { HexRgb } from "./hex-rgb.js";

describe('hex-rgb web component test', () => {

    const componentTag = "hex-rgb";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of HexRgb', () => {
        const component = window.document.createElement(componentTag) as HexRgb;
        expect(component).toBeInstanceOf(HexRgb);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

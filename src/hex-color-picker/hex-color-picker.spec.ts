import { LitElement } from 'lit';
import { HexColorPicker } from "./hex-color-picker.js";

describe('hex-color-picker web component test', () => {

    const componentTag = "hex-color-picker";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of HexColorPicker', () => {
        const component = window.document.createElement(componentTag) as HexColorPicker;
        expect(component).toBeInstanceOf(HexColorPicker);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

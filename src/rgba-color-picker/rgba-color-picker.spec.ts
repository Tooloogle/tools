import { LitElement } from 'lit';
import { RgbaColorPicker } from "./rgba-color-picker.js";

describe('rgba-color-picker web component test', () => {

    const componentTag = "rgba-color-picker";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of RgbaColorPicker', () => {
        const component = window.document.createElement(componentTag) as RgbaColorPicker;
        expect(component).toBeInstanceOf(RgbaColorPicker);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

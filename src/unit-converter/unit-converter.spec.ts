import { LitElement } from 'lit';
import { UnitConverter } from "./unit-converter.js";

describe('unit-converter web component test', () => {

    const componentTag = "unit-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of UnitConverter', () => {
        const component = window.document.createElement(componentTag) as UnitConverter;
        expect(component).toBeInstanceOf(UnitConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

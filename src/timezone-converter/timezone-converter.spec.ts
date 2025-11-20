import { LitElement } from 'lit';
import { TimezoneConverter } from "./timezone-converter.js";

describe('timezone-converter web component test', () => {

    const componentTag = "timezone-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of TimezoneConverter', () => {
        const component = window.document.createElement(componentTag) as TimezoneConverter;
        expect(component).toBeInstanceOf(TimezoneConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

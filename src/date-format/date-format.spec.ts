import { LitElement } from 'lit';
import { DateFormat } from "./date-format.js";

describe('date-format web component test', () => {

    const componentTag = "date-format";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of DateFormat', () => {
        const component = window.document.createElement(componentTag) as DateFormat;
        expect(component).toBeInstanceOf(DateFormat);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

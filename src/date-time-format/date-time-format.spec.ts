import { LitElement } from 'lit';
import { DateTimeFormat } from "./date-time-format.js";

describe('date-time-format web component test', () => {

    const componentTag = "date-time-format";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of DateTimeFormat', () => {
        const component = window.document.createElement(componentTag) as DateTimeFormat;
        expect(component).toBeInstanceOf(DateTimeFormat);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

import { LitElement } from 'lit';
import { DaysBetweenDates } from "./days-between-dates.js";

describe('days-between-dates web component test', () => {

    const componentTag = "days-between-dates";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of DaysBetweenDates', () => {
        const component = window.document.createElement(componentTag) as DaysBetweenDates;
        expect(component).toBeInstanceOf(DaysBetweenDates);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

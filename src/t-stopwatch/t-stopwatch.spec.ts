import { LitElement } from 'lit';
import { TStopwatch } from "./t-stopwatch.js";

describe('stopwatch web component test', () => {

    const componentTag = "t-stopwatch";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of TStopwatch', () => {
        const component = window.document.createElement(componentTag) as TStopwatch;
        expect(component).toBeInstanceOf(TStopwatch);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

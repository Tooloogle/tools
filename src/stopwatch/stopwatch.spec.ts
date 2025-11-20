import { LitElement } from 'lit';
import { Stopwatch } from "./stopwatch.js";

describe('stopwatch web component test', () => {

    const componentTag = "stopwatch";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of Stopwatch', () => {
        const component = window.document.createElement(componentTag) as Stopwatch;
        expect(component).toBeInstanceOf(Stopwatch);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

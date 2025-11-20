import { LitElement } from 'lit';
import { WorldClock } from "./world-clock.js";

describe('world-clock web component test', () => {

    const componentTag = "world-clock";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of WorldClock', () => {
        const component = window.document.createElement(componentTag) as WorldClock;
        expect(component).toBeInstanceOf(WorldClock);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

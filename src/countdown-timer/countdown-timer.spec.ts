import { LitElement } from 'lit';
import { CountdownTimer } from "./countdown-timer.js";

describe('countdown-timer web component test', () => {

    const componentTag = "countdown-timer";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of CountdownTimer', () => {
        const component = window.document.createElement(componentTag) as CountdownTimer;
        expect(component).toBeInstanceOf(CountdownTimer);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

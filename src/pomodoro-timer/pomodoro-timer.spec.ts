import { LitElement } from 'lit';
import { PomodoroTimer } from "./pomodoro-timer.js";

describe('pomodoro-timer web component test', () => {

    const componentTag = "pomodoro-timer";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of PomodoroTimer', () => {
        const component = window.document.createElement(componentTag) as PomodoroTimer;
        expect(component).toBeInstanceOf(PomodoroTimer);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

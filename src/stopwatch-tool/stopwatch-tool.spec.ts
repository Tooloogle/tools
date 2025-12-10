import { LitElement } from 'lit';
import { StopwatchTool } from "./stopwatch-tool.js";

describe('stopwatch web component test', () => {

    const componentTag = "stopwatch-tool";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of StopwatchTool', () => {
        const component = window.document.createElement(componentTag) as StopwatchTool;
        expect(component).toBeInstanceOf(StopwatchTool);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

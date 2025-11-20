import { LitElement } from 'lit';
import { SpeedReadingTool } from "./speed-reading-tool.js";

describe('speed-reading-tool web component test', () => {

    const componentTag = "speed-reading-tool";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of SpeedReadingTool', () => {
        const component = window.document.createElement(componentTag) as SpeedReadingTool;
        expect(component).toBeInstanceOf(SpeedReadingTool);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

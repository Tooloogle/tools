import { LitElement } from 'lit';
import { TextToLeetspeak } from "./text-to-leetspeak.js";

describe('text-to-leetspeak web component test', () => {

    const componentTag = "text-to-leetspeak";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of TextToLeetspeak', () => {
        const component = window.document.createElement(componentTag) as TextToLeetspeak;
        expect(component).toBeInstanceOf(TextToLeetspeak);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

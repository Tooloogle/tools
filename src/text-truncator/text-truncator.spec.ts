import { LitElement } from 'lit';
import { TextTruncator } from "./text-truncator.js";

describe('text-truncator web component test', () => {

    const componentTag = "text-truncator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of TextTruncator', () => {
        const component = window.document.createElement(componentTag) as TextTruncator;
        expect(component).toBeInstanceOf(TextTruncator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

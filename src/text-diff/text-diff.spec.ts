import { LitElement } from 'lit';
import { TextDiff } from "./text-diff.js";

describe('text-diff web component test', () => {

    const componentTag = "text-diff";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of TextDiff', () => {
        const component = window.document.createElement(componentTag) as TextDiff;
        expect(component).toBeInstanceOf(TextDiff);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

import { LitElement } from 'lit';
import { TTextarea } from "./t-textarea.js";

describe('t-textarea web component test', () => {

    const componentTag = "t-textarea";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of TTextarea', () => {
        const component = window.document.createElement(componentTag) as TTextarea;
        expect(component).toBeInstanceOf(TTextarea);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

import { LitElement } from 'lit';
import { HtmlTagsStripper } from "./html-tags-stripper.js";

describe('html-tags-stripper web component test', () => {

    const componentTag = "html-tags-stripper";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of HtmlTagsStripper', () => {
        const component = window.document.createElement(componentTag) as HtmlTagsStripper;
        expect(component).toBeInstanceOf(HtmlTagsStripper);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

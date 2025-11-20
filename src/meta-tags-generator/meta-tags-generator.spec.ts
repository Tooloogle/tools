import { LitElement } from 'lit';
import { MetaTagsGenerator } from "./meta-tags-generator.js";

describe('meta-tags-generator web component test', () => {

    const componentTag = "meta-tags-generator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of MetaTagsGenerator', () => {
        const component = window.document.createElement(componentTag) as MetaTagsGenerator;
        expect(component).toBeInstanceOf(MetaTagsGenerator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

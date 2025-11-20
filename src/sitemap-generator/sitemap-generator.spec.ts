import { LitElement } from 'lit';
import { SitemapGenerator } from "./sitemap-generator.js";

describe('sitemap-generator web component test', () => {

    const componentTag = "sitemap-generator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of SitemapGenerator', () => {
        const component = window.document.createElement(componentTag) as SitemapGenerator;
        expect(component).toBeInstanceOf(SitemapGenerator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

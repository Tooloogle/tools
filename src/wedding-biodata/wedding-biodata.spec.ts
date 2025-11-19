import { LitElement } from 'lit';
import { WeddingBiodata } from "./wedding-biodata.js";

describe('wedding-biodata web component test', () => {

    const componentTag = "wedding-biodata";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of WeddingBiodata', () => {
        const component = window.document.createElement(componentTag) as WeddingBiodata;
        expect(component).toBeInstanceOf(WeddingBiodata);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

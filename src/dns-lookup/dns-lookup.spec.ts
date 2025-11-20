import { LitElement } from 'lit';
import { DnsLookup } from "./dns-lookup.js";

describe('dns-lookup web component test', () => {

    const componentTag = "dns-lookup";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of DnsLookup', () => {
        const component = window.document.createElement(componentTag) as DnsLookup;
        expect(component).toBeInstanceOf(DnsLookup);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

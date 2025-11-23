import { LitElement } from 'lit';
import { Ipv6AddressFormatter } from "./ipv6-address-formatter.js";

describe('ipv6-address-formatter web component test', () => {

    const componentTag = "ipv6-address-formatter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of Ipv6AddressFormatter', () => {
        const component = window.document.createElement(componentTag) as Ipv6AddressFormatter;
        expect(component).toBeInstanceOf(Ipv6AddressFormatter);
    });

    it('should have empty input by default', () => {
        const component = window.document.createElement(componentTag) as Ipv6AddressFormatter;
        expect(component.input).toBe('');
    });

    it('should not be valid initially', () => {
        const component = window.document.createElement(componentTag) as Ipv6AddressFormatter;
        expect(component.isValid).toBe(false);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

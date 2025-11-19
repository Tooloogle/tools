import { LitElement } from 'lit';
import { IpAddressConverter } from "./ip-address-converter.js";

describe('ip-address-converter web component test', () => {

    const componentTag = "ip-address-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of IpAddressConverter', () => {
        const component = window.document.createElement(componentTag) as IpAddressConverter;
        expect(component).toBeInstanceOf(IpAddressConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

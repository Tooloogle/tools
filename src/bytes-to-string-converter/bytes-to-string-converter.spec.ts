import { LitElement } from 'lit';
import { BytesToStringConverter } from "./bytes-to-string-converter.js";

describe('bytes-to-string-converter web component test', () => {

    const componentTag = "bytes-to-string-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of BytesToStringConverter', () => {
        const component = window.document.createElement(componentTag) as BytesToStringConverter;
        expect(component).toBeInstanceOf(BytesToStringConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

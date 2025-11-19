import { LitElement } from 'lit';
import { UnixTimestampConverter } from "./unix-timestamp-converter.js";

describe('unix-timestamp-converter web component test', () => {

    const componentTag = "unix-timestamp-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of UnixTimestampConverter', () => {
        const component = window.document.createElement(componentTag) as UnixTimestampConverter;
        expect(component).toBeInstanceOf(UnixTimestampConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

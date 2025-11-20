import { LitElement } from 'lit';
import { RobotsTxtGenerator } from "./robots-txt-generator.js";

describe('robots-txt-generator web component test', () => {

    const componentTag = "robots-txt-generator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of RobotsTxtGenerator', () => {
        const component = window.document.createElement(componentTag) as RobotsTxtGenerator;
        expect(component).toBeInstanceOf(RobotsTxtGenerator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

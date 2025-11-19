import { LitElement } from 'lit';
import { ResumeBuilder } from "./resume-builder.js";

describe('resume-builder web component test', () => {

    const componentTag = "resume-builder";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of ResumeBuilder', () => {
        const component = window.document.createElement(componentTag) as ResumeBuilder;
        expect(component).toBeInstanceOf(ResumeBuilder);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

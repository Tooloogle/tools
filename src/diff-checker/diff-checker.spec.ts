import { LitElement } from 'lit';
import { DiffChecker } from "./diff-checker.js";

describe('diff-checker web component test', () => {

    const componentTag = "diff-checker";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of DiffChecker', () => {
        const component = window.document.createElement(componentTag) as DiffChecker;
        expect(component).toBeInstanceOf(DiffChecker);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

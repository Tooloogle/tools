import { LitElement } from 'lit';
import { SvgOptimizer } from "./svg-optimizer.js";

describe('svg-optimizer web component test', () => {

    const componentTag = "svg-optimizer";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of SvgOptimizer', () => {
        const component = window.document.createElement(componentTag) as SvgOptimizer;
        expect(component).toBeInstanceOf(SvgOptimizer);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

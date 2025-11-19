import { LitElement } from 'lit';
import { TextSorter } from "./text-sorter.js";

describe('text-sorter web component test', () => {

    const componentTag = "text-sorter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of TextSorter', () => {
        const component = window.document.createElement(componentTag) as TextSorter;
        expect(component).toBeInstanceOf(TextSorter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

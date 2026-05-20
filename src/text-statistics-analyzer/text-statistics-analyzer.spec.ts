import { LitElement } from 'lit';
import { TextStatisticsAnalyzer } from "./text-statistics-analyzer.js";

describe('text-statistics-analyzer web component test', () => {

    const componentTag = "text-statistics-analyzer";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of TextStatisticsAnalyzer', () => {
        const component = window.document.createElement(componentTag) as TextStatisticsAnalyzer;
        expect(component).toBeInstanceOf(TextStatisticsAnalyzer);
    });

    it('should have empty text by default', () => {
        const component = window.document.createElement(componentTag) as TextStatisticsAnalyzer;
        expect(component.text).toBe('');
    });

    it('should have zero stats for empty text', () => {
        const component = window.document.createElement(componentTag) as TextStatisticsAnalyzer;
        expect(component.stats.words).toBe(0);
        expect(component.stats.characters).toBe(0);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

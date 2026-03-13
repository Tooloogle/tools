import { LitElement } from 'lit';
import { JsonToCsvConverter } from "./json-to-csv-converter.js";

describe('json-to-csv-converter web component test', () => {

    const componentTag = "json-to-csv-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of JsonToCsvConverter', () => {
        const component = window.document.createElement(componentTag) as JsonToCsvConverter;
        expect(component).toBeInstanceOf(JsonToCsvConverter);
    });

    describe('JSON to CSV conversion', () => {
        let component: JsonToCsvConverter;

        beforeEach(() => {
            component = window.document.createElement(componentTag) as JsonToCsvConverter;
        });

        function convert(json: string): string {
            component.jsonString = json;
            component['convertJsonToCsv']();
            return component.csvString;
        }

        it('should convert valid JSON array of objects', () => {
            const result = convert('[{"name":"Alice","age":30}]');
            expect(result).toContain('name');
            expect(result).toContain('Alice');
        });

        it('should show error for non-array JSON', () => {
            expect(convert('{"key":"value"}')).toBe('Error: JSON must be an array of objects');
        });

        it('should show error for array of non-objects', () => {
            expect(convert('[1, 2, 3]')).toBe('Error: JSON array must contain objects');
        });

        it('should return empty string for empty array', () => {
            expect(convert('[]')).toBe('');
        });

        it('should show error for invalid JSON', () => {
            expect(convert('not json')).toContain('Error');
        });
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

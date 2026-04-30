import { LitElement } from 'lit';
import { SqlToJsonConverter } from "./sql-to-json-converter.js";

describe('sql-to-json-converter web component test', () => {

    const componentTag = "sql-to-json-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of SqlToJsonConverter', () => {
        const component = window.document.createElement(componentTag) as SqlToJsonConverter;
        expect(component).toBeInstanceOf(SqlToJsonConverter);
    });

    describe('SQL table -> JSON conversion', () => {
        let component: SqlToJsonConverter;

        beforeEach(() => {
            component = window.document.createElement(componentTag) as SqlToJsonConverter;
            document.body.appendChild(component);
        });

        const convert = (text: string): string => {
            component.inputText = text;
            (component as unknown as { process: () => void }).process();
            return component.outputText;
        };

        it('parses comma-separated input (matches "Tab/Pipe/Comma" UI label)', () => {
            const out = convert('id,name,active\n1,Alice,true\n2,Bob,false');
            expect(JSON.parse(out)).toEqual([
                { id: 1, name: 'Alice', active: true },
                { id: 2, name: 'Bob', active: false }
            ]);
        });

        it('still parses tab-separated input', () => {
            const out = convert('id\tname\n1\tAlice');
            expect(JSON.parse(out)).toEqual([{ id: 1, name: 'Alice' }]);
        });

        it('still parses pipe-separated input', () => {
            const out = convert('id|name\n1|Alice');
            expect(JSON.parse(out)).toEqual([{ id: 1, name: 'Alice' }]);
        });

        it('parses booleans, null, integers, and floats via parseValue', () => {
            const out = convert('a,b,c,d,e\n1,1.5,true,false,null');
            expect(JSON.parse(out)).toEqual([
                { a: 1, b: 1.5, c: true, d: false, e: null }
            ]);
        });

        it('keeps non-numeric / non-keyword strings as strings', () => {
            const out = convert('label\nhello world');
            expect(JSON.parse(out)).toEqual([{ label: 'hello world' }]);
        });

        it('surfaces an error when the input has fewer than 2 lines', () => {
            convert('id,name');
            expect(component.outputText).toBe('');
            expect(component.errorMessage).toMatch(/header row.*data row/i);
        });

        it('LIMITATION: leading-zero numeric strings (e.g. zip codes) are coerced to numbers', () => {
            // Known limitation pinned by this test. parseValue treats every
            // /^-?\d+(\.\d+)?$/ string as a number, so "00210" becomes 210.
            // A future fix should preserve leading-zero strings.
            const out = convert('zip\n00210');
            expect(JSON.parse(out)).toEqual([{ zip: 210 }]);
        });

        it('LIMITATION: rows with column-count mismatch are dropped silently', () => {
            // Known limitation: comma-in-value (without quoting support)
            // produces a column-count mismatch and the row is discarded
            // without surfacing an errorMessage.
            convert('id,name\n1,"Smith, John"\n2,Bob');
            const parsed = JSON.parse(component.outputText);
            expect(parsed).toEqual([{ id: 2, name: 'Bob' }]);
            expect(component.errorMessage).toBe('');
        });
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

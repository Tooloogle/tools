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

        it('parses comma-separated input', () => {
            const out = convert('id,name,active\n1,Alice,true\n2,Bob,false');
            expect(JSON.parse(out)).toEqual([
                { id: 1, name: 'Alice', active: true },
                { id: 2, name: 'Bob', active: false }
            ]);
        });

        it('parses tab-separated input', () => {
            const out = convert('id\tname\n1\tAlice');
            expect(JSON.parse(out)).toEqual([{ id: 1, name: 'Alice' }]);
        });

        it('parses pipe-separated input', () => {
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

        // -- Behavior fixes (previously pinned as LIMITATION tests) --

        it('preserves leading-zero numeric strings (zip codes, IDs) as strings', () => {
            const out = convert('zip,id\n00210,007');
            expect(JSON.parse(out)).toEqual([{ zip: '00210', id: '007' }]);
        });

        it('preserves integers larger than Number.MAX_SAFE_INTEGER as strings', () => {
            const out = convert('id\n9007199254740993');
            expect(JSON.parse(out)).toEqual([{ id: '9007199254740993' }]);
        });

        it('respects double-quoted values that contain the delimiter', () => {
            const out = convert('id,name\n1,"Smith, John"\n2,Bob');
            expect(JSON.parse(out)).toEqual([
                { id: 1, name: 'Smith, John' },
                { id: 2, name: 'Bob' }
            ]);
            // Both rows kept; no warning surfaced.
            expect(component.errorMessage).toBe('');
        });

        it('surfaces a warning listing the count of skipped column-mismatch rows', () => {
            // Stray pipe in name field of row 1 produces an extra column;
            // row 2 is well-formed and should still be emitted.
            const out = convert('id|name\n1|Smith|John\n2|Bob');
            expect(JSON.parse(out)).toEqual([{ id: 2, name: 'Bob' }]);
            expect(component.errorMessage).toMatch(/skipped 1 row/i);
        });

        it('keeps single 0 / 0.5 / -0.25 as numbers (only multi-digit leading-zero strings are preserved)', () => {
            const out = convert('a,b,c\n0,0.5,-0.25');
            expect(JSON.parse(out)).toEqual([{ a: 0, b: 0.5, c: -0.25 }]);
        });
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

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
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

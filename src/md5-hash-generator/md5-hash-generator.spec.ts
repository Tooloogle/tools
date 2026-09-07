import { LitElement } from 'lit';
import { Md5HashGenerator } from "./md5-hash-generator.js";

describe('md5-hash-generator web component test', () => {

    const componentTag = "md5-hash-generator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of Md5HashGenerator', () => {
        const component = window.document.createElement(componentTag) as Md5HashGenerator;
        expect(component).toBeInstanceOf(Md5HashGenerator);
    });

    const process = (component: Md5HashGenerator) =>
        (component as unknown as { process(): void })['process']();

    describe('hashing', () => {
        const vectors: [string, string][] = [
            ['', ''],
            ['abc', '900150983cd24fb0d6963f7d28e17f72'],
            ['The quick brown fox jumps over the lazy dog', '9e107d9d372bb6826bd81d3542a419d6'],
            ['héllo', 'be50e8478cf24ff3595bc7307fb91b50'],
        ];

        it.each(vectors)('hashes "%s" correctly', (input, expected) => {
            const component = window.document.createElement(componentTag) as Md5HashGenerator;
            component.input = input;
            process(component);
            expect(component.hash).toBe(expected);
            expect(component.error).toBe('');
        });

        it('clears the hash when input becomes empty', () => {
            const component = window.document.createElement(componentTag) as Md5HashGenerator;
            component.input = 'abc';
            process(component);
            expect(component.hash).not.toBe('');

            component.input = '';
            process(component);
            expect(component.hash).toBe('');
        });
    });

    describe('oversize input', () => {
        it('rejects input larger than the byte limit and reports an error', () => {
            const component = window.document.createElement(componentTag) as Md5HashGenerator;
            component.input = 'a'.repeat(100 * 1024 + 1);
            process(component);
            expect(component.hash).toBe('');
            expect(component.error).toContain('too large');
        });

        it('measures size in bytes, not characters', () => {
            const component = window.document.createElement(componentTag) as Md5HashGenerator;
            // 51_200 two-byte chars = 102_400 bytes = over the 100KB limit despite length < limit.
            component.input = 'é'.repeat(51 * 1024);
            process(component);
            expect(component.hash).toBe('');
            expect(component.error).toContain('too large');
        });
    });

    describe('clearAll', () => {
        it('resets input, hash and error', () => {
            const component = window.document.createElement(componentTag) as Md5HashGenerator;
            component.input = 'abc';
            process(component);
            expect(component.hash).not.toBe('');

            component.clearAll();
            expect(component.input).toBe('');
            expect(component.hash).toBe('');
            expect(component.error).toBe('');
        });
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

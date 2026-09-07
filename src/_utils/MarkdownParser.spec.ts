import { markdownToHtml } from './MarkdownParser.js';

describe('markdownToHtml', () => {
    describe('security (XSS)', () => {
        it('escapes raw HTML tags', () => {
            const out = markdownToHtml('<script>alert(1)</script>');
            expect(out).not.toContain('<script>');
            expect(out).toContain('&lt;script&gt;');
        });

        it('escapes HTML inside inline code', () => {
            const out = markdownToHtml('`<img src=x onerror=alert(1)>`');
            expect(out).toContain('<code>&lt;img src=x onerror=alert(1)&gt;</code>');
        });

        it('escapes HTML inside code blocks', () => {
            const out = markdownToHtml('```\n<b>hi</b>\n```');
            expect(out).toContain('<pre><code>&lt;b&gt;hi&lt;/b&gt;</code></pre>');
        });

        it('renders javascript: links as plain text, not anchors', () => {
            const out = markdownToHtml('[click](javascript:alert(1))');
            expect(out).not.toContain('<a');
            expect(out).not.toContain('javascript:');
            expect(out).toContain('click');
        });

        it('renders data: links as plain text', () => {
            const out = markdownToHtml('[x](data:text/html,<script>alert(1)</script>)');
            expect(out).not.toContain('<a');
        });

        it('adds safe rel/target to allowed links', () => {
            const out = markdownToHtml('[site](https://example.com)');
            expect(out).toContain('href="https://example.com"');
            expect(out).toContain('rel="noopener nofollow noreferrer"');
            expect(out).toContain('target="_blank"');
        });
    });

    describe('formatting', () => {
        it('renders headings', () => {
            expect(markdownToHtml('# Title')).toContain('<h1>Title</h1>');
            expect(markdownToHtml('### Sub')).toContain('<h3>Sub</h3>');
        });

        it('renders bold and italic', () => {
            expect(markdownToHtml('**b**')).toContain('<strong>b</strong>');
            expect(markdownToHtml('*i*')).toContain('<em>i</em>');
        });

        it('renders unordered lists', () => {
            const out = markdownToHtml('- one\n- two');
            expect(out).toContain('<ul>');
            expect(out).toContain('<li>one</li>');
            expect(out).toContain('<li>two</li>');
        });

        it('renders ordered lists', () => {
            const out = markdownToHtml('1. one\n2. two');
            expect(out).toContain('<ol><li>one</li><li>two</li></ol>');
        });

        it('renders nested lists via indentation', () => {
            const out = markdownToHtml('- parent\n  - child');
            expect(out).toContain('<ul><li>parent<ul><li>child</li></ul></li></ul>');
        });

        it('renders nested ordered lists inside unordered items', () => {
            const out = markdownToHtml('- parent\n   1. child');
            expect(out).toContain('<ul><li>parent<ol><li>child</li></ol></li></ul>');
        });

        it('renders blockquotes', () => {
            expect(markdownToHtml('> quoted')).toContain('<blockquote>quoted</blockquote>');
        });

        it('renders mailto and relative/anchor links', () => {
            expect(markdownToHtml('[m](mailto:a@b.com)')).toContain('href="mailto:a@b.com"');
            expect(markdownToHtml('[r](/path)')).toContain('href="/path"');
            expect(markdownToHtml('[a](#top)')).toContain('href="#top"');
        });
    });
});

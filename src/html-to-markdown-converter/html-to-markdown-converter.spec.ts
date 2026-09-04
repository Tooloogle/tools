import { LitElement } from 'lit';
import { HtmlToMarkdownConverter } from "./html-to-markdown-converter.js";
import { htmlToMarkdown } from "./html-to-markdown.js";

describe('html-to-markdown-converter web component test', () => {

    const componentTag = "html-to-markdown-converter";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of HtmlToMarkdownConverter', () => {
        const component = window.document.createElement(componentTag) as HtmlToMarkdownConverter;
        expect(component).toBeInstanceOf(HtmlToMarkdownConverter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

describe('htmlToMarkdown converter', () => {
    it('converts headings with attributes', () => {
        expect(htmlToMarkdown('<h1 class="x">Hello</h1>')).toBe('# Hello');
        expect(htmlToMarkdown('<h3>Sub</h3>')).toBe('### Sub');
    });

    it('converts inline formatting and links', () => {
        expect(htmlToMarkdown('<p>a <strong>b</strong> <em>c</em></p>')).toBe('a **b** *c*');
        expect(htmlToMarkdown('<a href="https://x.com">link</a>')).toBe('[link](https://x.com)');
    });

    it('converts images', () => {
        expect(htmlToMarkdown('<img src="/i.png" alt="pic">')).toBe('![pic](/i.png)');
    });

    it('converts ordered and unordered lists', () => {
        expect(htmlToMarkdown('<ul><li>one</li><li>two</li></ul>')).toBe('- one\n- two');
        expect(htmlToMarkdown('<ol><li>a</li><li>b</li></ol>')).toBe('1. a\n2. b');
    });

    it('converts blockquotes and code', () => {
        expect(htmlToMarkdown('<blockquote>quote</blockquote>')).toBe('> quote');
        expect(htmlToMarkdown('<p>use <code>x=1</code></p>')).toBe('use `x=1`');
        expect(htmlToMarkdown('<pre><code>const x = 1;</code></pre>')).toBe('```\nconst x = 1;\n```');
    });

    it('drops script and style content', () => {
        expect(htmlToMarkdown('<p>ok</p><script>alert(1)</script><style>.a{}</style>')).toBe('ok');
    });

    it('decodes entities via the DOM', () => {
        expect(htmlToMarkdown('<p>a &amp; b &lt; c</p>')).toBe('a & b < c');
    });
});

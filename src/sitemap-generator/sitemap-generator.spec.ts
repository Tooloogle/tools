import { LitElement } from 'lit';
import { jest } from '@jest/globals';
import { SitemapGenerator } from "./sitemap-generator.js";

describe('sitemap-generator web component test', () => {

    const componentTag = "sitemap-generator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of SitemapGenerator', () => {
        const component = window.document.createElement(componentTag) as SitemapGenerator;
        expect(component).toBeInstanceOf(SitemapGenerator);
    });

    it('disables bottom actions without output and keeps copy bound to generated XML', async () => {
        const component = new SitemapGenerator();
        document.body.appendChild(component);
        await component.updateComplete;
        const root = component.shadowRoot!;
        const download = root.querySelector<HTMLButtonElement>('button')!;
        const copy = root.querySelectorAll('t-copy-button')[1];
        expect(download.disabled).toBe(true);
        expect(copy.disabled).toBe(true);
        expect(copy.isIcon).toBe(false);
        expect(copy.size).toBe('sm');
        const input = root.querySelector('textarea')!;
        input.value = 'https://example.com/?a=1&b=2';
        input.dispatchEvent(new Event('input'));
        await component.updateComplete;
        expect(download.disabled).toBe(false);
        expect(copy.disabled).toBe(false);
        expect(copy.text).toBe(component.outputText);
        expect(copy.text).toContain('a=1&amp;b=2');
        const output = root.querySelectorAll('textarea')[1];
        output.value = '<urlset><!-- edited --></urlset>';
        output.dispatchEvent(new Event('input'));
        await component.updateComplete;
        expect(component.outputText).toBe(output.value);
        for (const button of root.querySelectorAll('t-copy-button')) {
            expect(button.text).toBe(output.value);
        }
        input.value = '';
        input.dispatchEvent(new Event('input'));
        await component.updateComplete;
        expect(download.disabled).toBe(true);
        expect(copy.disabled).toBe(true);
        expect(copy.text).toBe('');
    });

    it('downloads generated XML as sitemap.xml and cleans up the object URL', async () => {
        const component = new SitemapGenerator();
        component.outputText = '<urlset></urlset>';
        document.body.appendChild(component);
        await component.updateComplete;
        const createUrl = jest.fn((_blob: Blob) => 'blob:sitemap');
        const revokeUrl = jest.fn();
        const originalCreate = Object.getOwnPropertyDescriptor(URL, 'createObjectURL');
        const originalRevoke = Object.getOwnPropertyDescriptor(URL, 'revokeObjectURL');
        Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: createUrl });
        Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: revokeUrl });
        const click = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
            expect(this.download).toBe('sitemap.xml');
            expect(this.getAttribute('href')).toBe('blob:sitemap');
            expect(this.isConnected).toBe(true);
        });
        try {
            component.shadowRoot!.querySelector<HTMLButtonElement>('button')!.click();
            expect(click).toHaveBeenCalledTimes(1);
            const blob = createUrl.mock.calls[0][0] as Blob;
            expect(blob.type).toBe('application/xml;charset=utf-8');
            const reader = new FileReader();
            const content = new Promise(resolve => {
                reader.onload = () => resolve(reader.result);
            });
            reader.readAsText(blob);
            expect(await content).toBe(component.outputText);
            expect(revokeUrl).toHaveBeenCalledWith('blob:sitemap');
            expect(document.querySelector('a[download]')).toBeNull();
        } finally {
            click.mockRestore();
            if (originalCreate) {
                Object.defineProperty(URL, 'createObjectURL', originalCreate);
            } else {
                Reflect.deleteProperty(URL, 'createObjectURL');
            }
            if (originalRevoke) {
                Object.defineProperty(URL, 'revokeObjectURL', originalRevoke);
            } else {
                Reflect.deleteProperty(URL, 'revokeObjectURL');
            }
        }
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

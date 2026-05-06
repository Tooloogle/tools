import { LitElement } from 'lit';
import { DirectToTelegram } from './direct-to-telegram.js';

describe('direct-to-telegram web component test', () => {
    const componentTag = 'direct-to-telegram';

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('should render web component', async () => {
        const component = document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);
        await component.updateComplete;
        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();

        const renderedText = component.renderRoot.querySelector('button.btn')?.textContent;
        expect(renderedText).toEqual('Open in Telegram');
    });

    it('should be an instance of DirectToTelegram', () => {
        const component = document.createElement(componentTag) as DirectToTelegram;
        expect(component).toBeInstanceOf(DirectToTelegram);
    });

    it('should have initial target property as empty string', () => {
        const component = document.createElement(componentTag) as DirectToTelegram;
        expect(component.target).toBe("");
    });
});

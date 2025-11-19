import { LitElement } from 'lit';
import { EmojiPicker } from "./emoji-picker.js";

describe('emoji-picker web component test', () => {

    const componentTag = "emoji-picker";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of EmojiPicker', () => {
        const component = window.document.createElement(componentTag) as EmojiPicker;
        expect(component).toBeInstanceOf(EmojiPicker);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

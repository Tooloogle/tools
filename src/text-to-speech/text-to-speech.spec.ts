import { LitElement } from 'lit';
import { TextToSpeech } from "./text-to-speech.js";

describe('text-to-speech web component test', () => {

    const componentTag = "text-to-speech";
    
    beforeEach(() => {
        // Mock speechSynthesis API
        (global as any).speechSynthesis = {
            getVoices: () => [],
            speak: () => {},
            cancel: () => {},
            pause: () => {},
            resume: () => {},
            speaking: false,
            pending: false,
            paused: false,
            onvoiceschanged: null
        };
    });

    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of TextToSpeech', () => {
        const component = window.document.createElement(componentTag) as TextToSpeech;
        expect(component).toBeInstanceOf(TextToSpeech);
    });

    afterEach(() => {
        document.body.innerHTML = '';
        delete (global as any).speechSynthesis;
    });
});

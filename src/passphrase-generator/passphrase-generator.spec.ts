import { LitElement } from 'lit';
import { PassphraseGenerator } from "./passphrase-generator.js";

describe('passphrase-generator web component test', () => {

    const componentTag = "passphrase-generator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of PassphraseGenerator', () => {
        const component = window.document.createElement(componentTag) as PassphraseGenerator;
        expect(component).toBeInstanceOf(PassphraseGenerator);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

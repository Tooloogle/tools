import { LitElement } from 'lit';
import { UserAgentParser } from "./user-agent-parser.js";

describe('user-agent-parser web component test', () => {

    const componentTag = "user-agent-parser";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of UserAgentParser', () => {
        const component = window.document.createElement(componentTag) as UserAgentParser;
        expect(component).toBeInstanceOf(UserAgentParser);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

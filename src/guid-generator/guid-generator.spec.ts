import { LitElement } from 'lit';
import { GuidGenerator } from "./guid-generator.js";

describe('guid-generator web component test', () => {

    const componentTag = "guid-generator";
    
    it('should render web component', async () => {
        const component = window.document.createElement(componentTag) as LitElement;
        document.body.appendChild(component);

        await component.updateComplete;

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of GuidGenerator', () => {
        const component = window.document.createElement(componentTag) as GuidGenerator;
        expect(component).toBeInstanceOf(GuidGenerator);
    });

    it('should generate GUID on initialization', () => {
        const component = window.document.createElement(componentTag) as GuidGenerator;
        document.body.appendChild(component);
        
        expect(component.guid).toBeTruthy();
        expect(component.guid).not.toBe("");
    });

    it('should generate GUID in correct format', () => {
        const component = window.document.createElement(componentTag) as GuidGenerator;
        const guid = component.uuidv4();
        
        // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
        const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        expect(uuidPattern.test(guid)).toBe(true);
    });

    it('should have correct UUID v4 version number', () => {
        const component = window.document.createElement(componentTag) as GuidGenerator;
        const guid = component.uuidv4();
        
        // The 13th character should be '4' for UUID v4
        expect(guid.charAt(14)).toBe('4');
    });

    it('should have correct variant bits', () => {
        const component = window.document.createElement(componentTag) as GuidGenerator;
        const guid = component.uuidv4();
        
        // The 17th character should be 8, 9, a, or b for RFC4122 variant
        const variantChar = guid.charAt(19).toLowerCase();
        expect(['8', '9', 'a', 'b']).toContain(variantChar);
    });

    it('should generate unique GUIDs', () => {
        const component = window.document.createElement(componentTag) as GuidGenerator;
        const guid1 = component.uuidv4();
        const guid2 = component.uuidv4();
        const guid3 = component.uuidv4();
        
        expect(guid1).not.toBe(guid2);
        expect(guid2).not.toBe(guid3);
        expect(guid1).not.toBe(guid3);
    });

    it('should generate GUID with correct length', () => {
        const component = window.document.createElement(componentTag) as GuidGenerator;
        const guid = component.uuidv4();
        
        // UUID format is 36 characters (32 hex + 4 hyphens)
        expect(guid.length).toBe(36);
    });

    it('should contain exactly 4 hyphens', () => {
        const component = window.document.createElement(componentTag) as GuidGenerator;
        const guid = component.uuidv4();
        
        const hyphenCount = (guid.match(/-/g) || []).length;
        expect(hyphenCount).toBe(4);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

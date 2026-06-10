import { LitElement } from 'lit';
import { EmojiPicker } from "./emoji-picker.js";

describe('emoji-picker web component test', () => {

    const componentTag = "emoji-picker";

    function createComponent() {
        const component = window.document.createElement(componentTag) as EmojiPicker;
        document.body.appendChild(component);
        return component;
    }

    function getEmojiButtons(component: EmojiPicker) {
        return Array.from(component.renderRoot.querySelectorAll('.emoji-btn')) as HTMLButtonElement[];
    }

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

    it('should render emoji buttons by default', async () => {
        const component = createComponent();
        await component.updateComplete;

        expect(getEmojiButtons(component).length).toBeGreaterThan(0);
    });

    it('should render labeled category sections for every category', async () => {
        const component = createComponent();
        await component.updateComplete;

        const sections = component.renderRoot.querySelectorAll('section[data-category]');
        expect(sections.length).toBeGreaterThan(1);
        expect(sections[0].querySelector('h3')?.textContent?.trim()).toBeTruthy();
    });

    it('should not render duplicate emojis within a category section', async () => {
        const component = createComponent();
        await component.updateComplete;

        const heartsSection = component.renderRoot.querySelector('section[data-category="hearts"]') as HTMLElement;
        const chars = Array.from(heartsSection.querySelectorAll('.emoji-btn')).map(btn => btn.textContent?.trim());
        const uniqueChars = new Set(chars);
        expect(uniqueChars.size).toBe(chars.length);
    });

    it('should filter emojis by search query', async () => {
        const component = createComponent();
        component.searchQuery = 'banana';
        await component.updateComplete;

        const buttons = getEmojiButtons(component);
        expect(buttons.length).toBe(1);
        expect(buttons[0].textContent).toContain('🍌');
    });

    it('should show "No emojis found" when nothing matches', async () => {
        const component = createComponent();
        component.searchQuery = 'zzznotanemoji';
        await component.updateComplete;

        expect(getEmojiButtons(component).length).toBe(0);
        expect(component.renderRoot.textContent).toContain('No emojis found');
    });

    it('should filter by selected category', async () => {
        const component = createComponent();
        component.selectedCategory = 'travel';
        await component.updateComplete;

        const buttons = getEmojiButtons(component);
        expect(buttons.length).toBeGreaterThan(0);
        expect(buttons.some(btn => btn.textContent?.includes('🚗'))).toBe(true);
    });

    it('should render category tabs', async () => {
        const component = createComponent();
        await component.updateComplete;

        const tabs = component.renderRoot.querySelectorAll('.category-tab');
        expect(tabs.length).toBeGreaterThan(1);
    });

    it('should change category when a tab is clicked', async () => {
        const component = createComponent();
        await component.updateComplete;

        const travelTab = component.renderRoot.querySelector('[aria-label="Travel & Places"]') as HTMLButtonElement;
        expect(travelTab).toBeTruthy();

        travelTab.click();
        await component.updateComplete;

        expect(component.selectedCategory).toBe('travel');
        expect(travelTab.getAttribute('aria-selected')).toBe('true');
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

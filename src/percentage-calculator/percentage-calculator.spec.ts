import { LitElement } from 'lit';
import { PercentageCalculator } from "./percentage-calculator.js";

describe('percentage-calculator web component test', () => {

    const componentTag = "percentage-calculator";

    async function mount() {
        const component = window.document.createElement(componentTag) as PercentageCalculator;
        document.body.appendChild(component);
        await component.updateComplete;
        return component;
    }

    async function setInputs(component: LitElement, values: Record<number, string>) {
        const inputs = component.renderRoot.querySelectorAll('input');
        for (const [index, value] of Object.entries(values)) {
            const input = inputs[Number(index)] as HTMLInputElement;
            input.value = value;
            input.dispatchEvent(new Event('input'));
        }
        await (component as PercentageCalculator).updateComplete;
    }

    function result(component: LitElement, id: number): string {
        return component.renderRoot
            .querySelector(`[data-testid="result-${id}"]`)
            ?.textContent?.trim() ?? '';
    }

    it('should render web component', async () => {
        const component = await mount();

        expect(component).toBeTruthy();
        expect(component.renderRoot).toBeTruthy();
    });

    it('should be an instance of PercentageCalculator', () => {
        const component = window.document.createElement(componentTag) as PercentageCalculator;
        expect(component).toBeInstanceOf(PercentageCalculator);
    });

    it('should render all five calculators', async () => {
        const component = await mount();

        const headings = component.renderRoot.querySelectorAll('h3');
        expect(headings.length).toBe(5);
        expect(headings[0].textContent).toContain('What is X% of Y?');
        expect(headings[1].textContent).toContain('X is what % of Y?');
        expect(headings[2].textContent).toContain('% Change from X to Y');
        expect(headings[3].textContent).toContain('X is Y% of what?');
        expect(headings[4].textContent).toContain('% Difference between X and Y');
    });

    it('should show dash when inputs are empty', async () => {
        const component = await mount();

        for (let id = 1; id <= 5; id++) {
            expect(result(component, id)).toBe('—');
        }
    });

    it('should have ten independent input fields', async () => {
        const component = await mount();

        const inputs = component.renderRoot.querySelectorAll('input');
        expect(inputs.length).toBe(10);
    });

    it('should mark all result panels as live regions', async () => {
        const component = await mount();

        const liveRegions = component.renderRoot.querySelectorAll('[role="status"][aria-live="polite"]');
        expect(liveRegions.length).toBe(5);
    });

    it('should calculate X% of Y correctly and trim trailing zeros', async () => {
        const component = await mount();
        await setInputs(component, { 0: '10', 1: '200' });

        expect(result(component, 1)).toBe('20');
    });

    it('should calculate X is what % of Y correctly', async () => {
        const component = await mount();
        await setInputs(component, { 2: '50', 3: '200' });

        expect(result(component, 2)).toBe('25%');
    });

    it('should return dash for division by zero in "X is what % of Y"', async () => {
        const component = await mount();
        await setInputs(component, { 2: '50', 3: '0' });

        expect(result(component, 2)).toBe('—');
    });

    it('should calculate positive % change with Increase label', async () => {
        const component = await mount();
        await setInputs(component, { 4: '100', 5: '150' });

        expect(result(component, 3)).toBe('+50%');
        expect(component.renderRoot.textContent).toContain('Increase');
    });

    it('should calculate negative % change with Decrease label', async () => {
        const component = await mount();
        await setInputs(component, { 4: '100', 5: '50' });

        expect(result(component, 3)).toBe('-50%');
        expect(component.renderRoot.textContent).toContain('Decrease');
    });

    it('should treat 0% change as neutral "No change"', async () => {
        const component = await mount();
        await setInputs(component, { 4: '100', 5: '100' });

        expect(result(component, 3)).toBe('0%');
        expect(component.renderRoot.textContent).toContain('No change');
        expect(component.renderRoot.textContent).not.toContain('Increase');
    });

    it('should return dash when "from" value is zero for % change', async () => {
        const component = await mount();
        await setInputs(component, { 4: '0', 5: '100' });

        expect(result(component, 3)).toBe('—');
    });

    it('should calculate "X is Y% of what?" (base recovery)', async () => {
        const component = await mount();
        await setInputs(component, { 6: '25', 7: '50' });

        expect(result(component, 4)).toBe('50');
    });

    it('should return dash for zero percentage in base recovery', async () => {
        const component = await mount();
        await setInputs(component, { 6: '25', 7: '0' });

        expect(result(component, 4)).toBe('—');
    });

    it('should calculate symmetric % difference', async () => {
        const component = await mount();
        await setInputs(component, { 8: '40', 9: '60' });

        expect(result(component, 5)).toBe('40%');
    });

    it('should return dash when both values are zero for % difference', async () => {
        const component = await mount();
        await setInputs(component, { 8: '0', 9: '0' });

        expect(result(component, 5)).toBe('—');
    });

    it('should ignore non-numeric input', async () => {
        const component = await mount();
        await setInputs(component, { 0: 'abc', 1: '200' });

        expect(result(component, 1)).toBe('—');
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});

import './t-select.js';
import { TSelect } from './t-select.js';

describe('t-select', () => {
  let element: TSelect;

  beforeEach(() => {
    element = document.createElement('t-select') as TSelect;
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it('should render select element', async () => {
    await element.updateComplete;
    const select = element.shadowRoot?.querySelector('select');
    expect(select).toBeTruthy();
  });

  it('should set value property', async () => {
    element.value = 'test-value';
    await element.updateComplete;
    const select = element.shadowRoot?.querySelector('select') as HTMLSelectElement;
    expect(select.value).toBe('test-value');
  });
});

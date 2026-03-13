import { LitElement } from 'lit';
import { PassportPhotoMaker } from './passport-photo-maker.js';

describe('passport-photo-maker web component test', () => {
  const componentTag = 'passport-photo-maker';

  it('should render web component', async () => {
    const component = window.document.createElement(componentTag) as LitElement;
    document.body.appendChild(component);

    await component.updateComplete;

    expect(component).toBeTruthy();
    expect(component.renderRoot).toBeTruthy();
  });

  it('should be an instance of PassportPhotoMaker', () => {
    const component = window.document.createElement(componentTag) as PassportPhotoMaker;
    expect(component).toBeInstanceOf(PassportPhotoMaker);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });
});

import { LitElement } from "lit";
import { TSelect } from "./t-select.js";

describe("t-select web component test", () => {
  const componentTag = "t-select";

  it("should render web component", async () => {
    const component = window.document.createElement(componentTag) as LitElement;
    document.body.appendChild(component);

    await component.updateComplete;

    expect(component).toBeTruthy();
    expect(component.renderRoot).toBeTruthy();
  });

  it("should be an instance of TSelect", () => {
    const component = window.document.createElement(componentTag) as TSelect;
    expect(component).toBeInstanceOf(TSelect);
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });
});

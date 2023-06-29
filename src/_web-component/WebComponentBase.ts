import { LitElement } from "lit";
import { property } from "lit/decorators.js";

export interface IConfigBase {
}

export abstract class WebComponentBase<TConfig extends IConfigBase> extends LitElement {
    @property()
    config?: TConfig;
}

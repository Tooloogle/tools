import { LitElement } from "lit";
import { property } from "lit/decorators.js";

export interface IConfigBase {
    isMobile?: boolean;
    isApp?: boolean;
}

export abstract class WebComponentBase<TConfig extends IConfigBase> extends LitElement {
    @property()
    config?: TConfig;
}

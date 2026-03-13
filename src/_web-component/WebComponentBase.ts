import { CSSResultGroup, LitElement } from "lit";
import { property } from "lit/decorators.js";
import baseStyles from "../_styles/base.css.js";

export interface IConfigBase {
    isMobile?: boolean;
    isApp?: boolean;
}

export abstract class WebComponentBase extends LitElement {
    @property()
    config?: IConfigBase;

    static override styles = baseStyles as CSSResultGroup;
}

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

    private _darkObserver?: MutationObserver;
    private _darkMediaQuery?: MediaQueryList;

    override connectedCallback() {
        super.connectedCallback();
        this._syncDarkMode();

        // Consumers toggle dark mode with a `.dark` class on an ancestor
        // (typically <html> or <body>). Shadow DOM hides that from descendant
        // selectors, so we mirror it onto this host element as `.dark` and the
        // compiled CSS targets `:host(.dark)`. Watch the common theme roots so
        // toggles are reflected live.
        this._darkObserver = new MutationObserver(this._syncDarkMode);
        this._darkObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        if (document.body) {
            this._darkObserver.observe(document.body, {
                attributes: true,
                attributeFilter: ['class'],
            });
        }

        if (typeof window.matchMedia === 'function') {
            this._darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            this._darkMediaQuery.addEventListener('change', this._syncDarkMode);
        }
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        this._darkObserver?.disconnect();
        this._darkMediaQuery?.removeEventListener('change', this._syncDarkMode);
    }

    private _syncDarkMode = () => {
        const prefersDark = typeof window.matchMedia === 'function'
            && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = this.closest('.dark') !== null || prefersDark;

        this.classList.toggle('dark', isDark);
    };
}

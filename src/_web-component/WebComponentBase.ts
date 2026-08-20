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

    private _hasDarkAncestor(): boolean {
        // Walk the composed ancestor chain (crossing shadow boundaries) starting
        // OUTSIDE this host. Excluding `this` is essential: once we mirror `.dark`
        // onto the host, `closest('.dark')` would keep matching itself and could
        // never fall back to light. Crossing shadow roots also lets nested
        // components (e.g. <t-copy-button>) inherit a dark outer host.
        let node: Node | null = this.parentNode;

        while (node) {
            if (node instanceof ShadowRoot) {
                node = node.host;
                continue;
            }

            if (node instanceof Element && node.classList.contains('dark')) {
                return true;
            }

            node = node.parentNode;
        }

        return false;
    }

    private _syncDarkMode = () => {
        const prefersDark = typeof window.matchMedia === 'function'
            && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = this._hasDarkAncestor() || prefersDark;

        this.classList.toggle('dark', isDark);
    };
}

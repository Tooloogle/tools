# AGENTS.md

Tooloogle web-components tools monorepo. Each tool is a self-contained Lit web component.

## Project structure
- Tools live in `src/<kebab-name>/`: `<name>.ts` (Lit component), `<name>.css`, `<name>.spec.ts`, `index.ts`.
- Tag name = kebab folder name; class = PascalCase. Components extend `WebComponentBase` (`src/_web-component/`); `styles = [WebComponentBase.styles, <toolStyles>]`.
- Scaffold a new tool with `npm run new -- <kebab-name>`.

## Build model — do NOT build during normal work
- The dev server (`npm run dev`) runs a watcher that rebuilds required files on change. Do not run `npm run css` or any build for routine edits.
- `*.css.ts` files are AUTO-GENERATED (`npm run css`) and gitignored — never hand-edit them.

## Styling / dark mode
- Dark mode is class-based: pair every light utility with a `dark:` variant (e.g. `bg-white dark:bg-gray-800`, `text-gray-900 dark:text-gray-100`).
- Prefer shared utilities in `src/_styles/*.css` (`btn*`, `form-*`, `card`, `card-muted`) over re-inlining surfaces.

## Before committing (the only time you build)
Run in order and fix failures:
1. Touched tests: `npm test -- <changed-tool-name>` per changed tool.
2. `npm run build:tools`
3. `npm run lint`

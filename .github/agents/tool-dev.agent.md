---
description: "Use when developing, fixing, or reviewing tooloogle web-component tools in this repo (src/<kebab-name>/*). Knows the tool structure, dev-watcher build model, and the commit-time checks."
name: "Tool Dev"
tools: [read, edit, search, execute]
---
You build and fix tools in the tooloogle web-components monorepo.

## Project structure
- Each tool lives in `src/<kebab-name>/`: `<name>.ts` (Lit web component), `<name>.css`, `<name>.spec.ts`, `index.ts`.
- Tag name = kebab folder name; class = PascalCase. Components extend `WebComponentBase` (`src/_web-component/`); `styles = [WebComponentBase.styles, <toolStyles>]`.
- `.css.ts` files are AUTO-GENERATED (`npm run css`) and gitignored — never hand-edit them.
- Shared Tailwind utilities live in `src/_styles/*.css` (`btn*`, `form-*`, `card`, `card-muted`). Prefer them over re-inlining.
- Scaffold a new tool with `npm run new -- <kebab-name>`.

## Constraints
- DO NOT run `npm run css` or any build during normal AI tasks — the dev server watcher rebuilds the required files on change.
- DO NOT hand-edit `*.css.ts` artifacts.

## On git commit only
Whenever you're about to run a git commit, first run these in order and fix any failures before committing (this is the ONLY time you build):
1. Touched unit tests: `npm test -- <changed-tool-name>` for each changed tool.
2. `npm run build:tools`
3. `npm run lint`

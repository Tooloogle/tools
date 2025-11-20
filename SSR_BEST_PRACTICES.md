# SSR Best Practices for @tooloogle/tools

Quick reference guide for maintaining SSR compatibility in the repository.

## Quick Checklist

Before committing code, ensure:

- [ ] No browser APIs at module/class level
- [ ] Browser-only code wrapped in `isBrowser()` guards
- [ ] Heavy browser-only packages loaded dynamically
- [ ] Event handlers used for user interactions (naturally SSR-safe)
- [ ] SSR test passes: `npm run build:tools && node scripts/web-component-ssr-html.js`

## Common Patterns

### ✅ DO: Guard Browser APIs

```typescript
import { isBrowser } from '../_utils/DomUtils.js';

private saveToStorage() {
  if (isBrowser()) {
    localStorage.setItem('key', 'value');
  }
}
```

### ✅ DO: Use Event Handlers

```typescript
// Event handlers only run in browser - SSR-safe by default
private handleDownload() {
  const blob = new Blob([data]);
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'file.txt';
  link.click();
}
```

### ✅ DO: Dynamic Imports for Heavy Packages

```typescript
async processImage() {
  if (!isBrowser()) return;
  
  const heic2any = (await import('heic2any')).default;
  await heic2any({ blob: file });
}
```

### ✅ DO: Conditional Initialization

```typescript
qrCode: QRCodeStyling = isBrowser()
  ? new QRCodeStyling({ width: 300, height: 300 })
  : ({} as QRCodeStyling);
```

### ❌ DON'T: Top-Level Browser API Calls

```typescript
// ❌ This breaks SSR
const userAgent = navigator.userAgent;

// ✅ Do this instead
getUserAgent() {
  return isBrowser() ? navigator.userAgent : '';
}
```

### ❌ DON'T: Import Browser-Only Packages Without Guards

```typescript
// ❌ This might break SSR
import BrowserPkg from 'browser-only-pkg';
const instance = new BrowserPkg();

// ✅ Do this instead
import BrowserPkg from 'browser-only-pkg';

if (isBrowser()) {
  const instance = new BrowserPkg();
}
```

## Helper Functions

Use these from `src/_utils/DomUtils.ts`:

```typescript
import { isBrowser, hasClipboard, downloadText, downloadImage } from '../_utils/DomUtils.js';

// Check if in browser
if (isBrowser()) { }

// Check clipboard support
if (hasClipboard()) { }

// Download helpers (already SSR-safe)
downloadText('content');
downloadImage('image.png', dataUrl);
```

## Testing SSR

```bash
# Build the project
npm run build:tools

# Run SSR test
node scripts/web-component-ssr-html.js

# Check output (no errors should appear)
# Files will be in .tmp/tooloogle-tools-htmls/
```

## Common Browser APIs to Guard

- `window.*` - Always guard
- `document.*` - Guard or use in event handlers
- `navigator.*` - Always guard
- `localStorage`/`sessionStorage` - Always guard
- `FileReader`, `Blob`, `URL` - Use in event handlers
- Canvas operations - Use in event handlers

## When in Doubt

1. Is this code at module/class level? → Add guard
2. Is this in an event handler? → Probably safe
3. Is this a browser-only package? → Add guard or dynamic import
4. Not sure? → Add `isBrowser()` guard (defensive coding)

## Memory Aid

**SSR = Server-Side Rendering = No Browser APIs**

Think: "If this ran on a server with no browser, would it work?"

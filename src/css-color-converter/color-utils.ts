export interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface Rgb {
  r: number;
  g: number;
  b: number;
}

export type ColorFormat = 'hex' | 'rgb' | 'hsl';

export function parseHex(value: string): Rgba | null {
  let hex = value.trim().replace(/^#/, '');

  if (/^[0-9a-f]{3,4}$/i.test(hex)) {
    hex = hex
      .split('')
      .map((c) => c + c)
      .join('');
  }

  if (!/^[0-9a-f]{6}([0-9a-f]{2})?$/i.test(hex)) {
    return null;
  }

  return {
    r: parseInt(hex.substring(0, 2), 16),
    g: parseInt(hex.substring(2, 4), 16),
    b: parseInt(hex.substring(4, 6), 16),
    a: hex.length === 8 ? parseInt(hex.substring(6, 8), 16) / 255 : 1,
  };
}

export function parseRgb(value: string): Rgba | null {
  const match = value.match(
    /rgba?\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*([01]?(?:\.\d+)?)\s*)?\)/i
  );
  if (!match) {
    return null;
  }

  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);
  const a = match[4] === undefined ? 1 : parseFloat(match[4]);

  if (r > 255 || g > 255 || b > 255 || a > 1) {
    return null;
  }

  return { r, g, b, a };
}

export function parseHsl(value: string): Rgba | null {
  const match = value.match(
    /hsla?\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?\s*(?:,\s*([01]?(?:\.\d+)?)\s*)?\)/i
  );
  if (!match) {
    return null;
  }

  const h = parseInt(match[1]);
  const s = parseInt(match[2]);
  const l = parseInt(match[3]);
  const a = match[4] === undefined ? 1 : parseFloat(match[4]);

  if (h > 360 || s > 100 || l > 100 || a > 1) {
    return null;
  }

  return { ...hslToRgb(h, s, l), a };
}

function hslToRgb(h: number, s: number, l: number): Rgb {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (h < 60) {
    r = c;
    g = x;
  } else if (h < 120) {
    r = x;
    g = c;
  } else if (h < 180) {
    g = c;
    b = x;
  } else if (h < 240) {
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

export function toHex({ r, g, b, a }: Rgba): string {
  const hex = (n: number) => Math.round(n).toString(16).padStart(2, '0');
  const base = `#${hex(r)}${hex(g)}${hex(b)}`;
  return a < 1 ? `${base}${hex(a * 255)}` : base;
}

export function toRgb({ r, g, b, a }: Rgba): string {
  return a < 1
    ? `rgba(${r}, ${g}, ${b}, ${formatAlpha(a)})`
    : `rgb(${r}, ${g}, ${b})`;
}

export function toHsl({ r, g, b, a }: Rgba): string {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;

  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  let s = 0;

  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));

    if (max === rn) {
      h = ((gn - bn) / d) % 6;
    } else if (max === gn) {
      h = (bn - rn) / d + 2;
    } else {
      h = (rn - gn) / d + 4;
    }

    h *= 60;

    if (h < 0) {
      h += 360;
    }
  }

  const hDeg = Math.round(h);
  const sPct = Math.round(s * 100);
  const lPct = Math.round(l * 100);

  return a < 1
    ? `hsla(${hDeg}, ${sPct}%, ${lPct}%, ${formatAlpha(a)})`
    : `hsl(${hDeg}, ${sPct}%, ${lPct}%)`;
}

function formatAlpha(a: number): string {
  return `${parseFloat(a.toFixed(2))}`;
}

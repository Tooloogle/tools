export function isBrowser() {
  return typeof window !== 'undefined';
}

export function hasClipboard() {
  return typeof navigator !== 'undefined' && navigator.clipboard !== undefined;
}

export function downloadText(text: string) {
  if (!text || !isBrowser()) {
    return;
  }

  const fileBlob = new Blob([text], { type: 'application/octet-binary' });
  const url = URL.createObjectURL(fileBlob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'result.txt');
  link.click();

  setTimeout(() => URL.revokeObjectURL(url), 100);
}

export function downloadImage(name: string, src: string) {
  if (!isBrowser()) {
    return;
  }

  const a = document.createElement('a');
  a.href = src;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Only revoke blob URLs, not data URLs
  if (src.startsWith('blob:')) {
    setTimeout(() => URL.revokeObjectURL(src), 100);
  }
}

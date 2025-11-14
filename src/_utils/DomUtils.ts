export function isBrowser() {
  return typeof window !== 'undefined';
}

export function hasClipboard() {
  return typeof navigator !== 'undefined' && navigator.clipboard !== undefined;
}

export function downloadText(text: string) {
  if (!text) {
    return;
  }

  const fileBlob = new Blob([text], { type: 'application/octet-binary' });
  const link = document.createElement('a');
  link.setAttribute('href', URL.createObjectURL(fileBlob));
  link.setAttribute('download', 'result.txt');
  link.click();
}

export function downloadImage(name: string, src: string) {
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

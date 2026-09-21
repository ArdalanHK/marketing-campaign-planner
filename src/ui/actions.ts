/** Browser actions used by the results view. Kept separate so they are easy to stub in tests. */

/** Copies text to the clipboard. Resolves to false if the browser refuses or lacks the API. */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** Starts a browser download of a plain-text file. */
export function downloadText(filename: string, text: string, mimeType = 'text/markdown'): void {
  const blob = new Blob([text], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

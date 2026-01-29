/**
 * Utility function to preserve referral parameters in URLs
 * @param url - The base URL to append ref parameter to
 * @returns URL with ref parameter if present in current URL
 */
export function preserveRef(url: string): string {
  const urlParams = new URLSearchParams(window.location.search);
  const ref = urlParams.get('ref');

  if (ref) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}ref=${encodeURIComponent(ref)}`;
  }

  return url;
}
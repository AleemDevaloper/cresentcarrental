const BASE_URL = import.meta.env.BASE_URL || './';

function withBase(path) {
  const base = BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`;
  const clean = String(path).replace(/^\.?\//, '');
  return `${base}${clean}`;
}

export function assetUrl(value, fallback = '') {
  const path = value || fallback;
  if (!path) return '';
  if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  return withBase(path);
}

export function absoluteAssetUrl(value, fallback = '') {
  const url = assetUrl(value, fallback);
  if (!url) return '';
  if (/^(?:[a-z]+:)?\/\//i.test(url) || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  return new URL(url, window.location.href).href;
}

export default assetUrl;

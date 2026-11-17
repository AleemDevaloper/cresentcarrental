import api from './api';

const SESSION_KEY = 'crescent_analytics_session';

function getSessionId() {
  if (typeof window === 'undefined') return 'server';
  let value = sessionStorage.getItem(SESSION_KEY);
  if (!value) {
    value = `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
    sessionStorage.setItem(SESSION_KEY, value);
  }
  return value;
}

export function trackEvent(name, params = {}) {
  if (!name) return;
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...params });

  const hashPath = window.location.hash.replace(/^#/, '');
  const pagePath = hashPath.startsWith('/') ? hashPath : window.location.pathname;

  const payload = {
    event_name: name,
    session_id: getSessionId(),
    page_path: pagePath,
    page_title: document.title || null,
    target_label: params.target_label || params.label || null,
    target_href: params.target_href || params.href || null,
    content_type: params.content_type || null,
    content_id: params.content_id || null,
    metadata: params,
    referrer: document.referrer || null,
  };

  api.post('/analytics/events', payload).catch(() => {});

  if (typeof window.gtag === 'function') {
    window.gtag('event', name, params);
  }

  if (typeof window.fbq === 'function') {
    window.fbq('trackCustom', name, params);
  }
}

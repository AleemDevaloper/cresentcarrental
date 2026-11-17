import { useCallback, useEffect, useMemo, useState } from 'react';
import { getPreferences, updatePreferences } from '../api/preferences';
import {
  DASHBOARD_WIDGET_PREFERENCES_KEY,
  dashboardWidgetRegistry,
  getAccessibleDashboardWidgets,
  getDefaultDashboardWidgetIds,
  isAdminUser,
} from '../data/dashboardWidgetRegistry';

const STORAGE_KEY = 'manage_core_dashboard_widget_preferences';

const getUserKey = (user) => user?.id || user?.user_id || user?.email || 'anonymous';

const intersectWithAccessible = (ids, accessibleIds) => {
  const accessible = new Set(accessibleIds);
  const seen = new Set();
  const out = [];
  for (const id of ids || []) {
    if (accessible.has(id) && !seen.has(id)) {
      seen.add(id);
      out.push(id);
    }
  }
  return out;
};

const normalizeIds = (ids, accessibleIds) =>
  intersectWithAccessible(ids, accessibleIds);

const readStoredIds = (userKey) => {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}:${userKey}`);
    return raw === null ? null : JSON.parse(raw);
  } catch {
    return null;
  }
};

const writeStoredIds = (userKey, ids) => {
  try {
    localStorage.setItem(`${STORAGE_KEY}:${userKey}`, JSON.stringify(ids));
  } catch {
    // Storage can be unavailable in private browsing; the in-memory state still works.
  }
};

const extractPreferenceIds = (response) => {
  const preferences = response?.data?.preferences || response?.preferences || response?.data || response;
  if (!preferences || !Object.prototype.hasOwnProperty.call(preferences, DASHBOARD_WIDGET_PREFERENCES_KEY)) return null;
  return Array.isArray(preferences[DASHBOARD_WIDGET_PREFERENCES_KEY])
    ? preferences[DASHBOARD_WIDGET_PREFERENCES_KEY]
    : null;
};

const getInitialIds = (user) => {
  const accessible = getAccessibleDashboardWidgets(user);
  const accessibleIds = accessible.map(w => w.id);
  const stored = readStoredIds(getUserKey(user));
  if (stored === null) {
    return getDefaultDashboardWidgetIds().filter(id => accessibleIds.includes(id));
  }
  return normalizeIds(stored, accessibleIds);
};

export const useDashboardWidgets = (currentUser) => {
  const userKey = getUserKey(currentUser);
  const accessibleWidgets = useMemo(() => getAccessibleDashboardWidgets(currentUser), [currentUser]);
  const accessibleIds = useMemo(() => accessibleWidgets.map(w => w.id), [accessibleWidgets]);
  const isAdmin = useMemo(() => isAdminUser(currentUser), [currentUser]);

  const [visibleWidgetIds, setVisibleWidgetIds] = useState(() => getInitialIds(currentUser));
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const ids = extractPreferenceIds(await getPreferences());
        if (!cancelled && ids !== null) {
          const next = normalizeIds(ids, accessibleIds);
          setVisibleWidgetIds(next);
          writeStoredIds(userKey, next);
        }
      } catch {
        // The local preference is the supported offline fallback.
      }
    };
    load();
    return () => { cancelled = true; };
  }, [userKey, accessibleIds]);

  const persist = useCallback(async (ids) => {
    const normalized = normalizeIds(ids, accessibleIds);
    setVisibleWidgetIds(normalized);
    writeStoredIds(userKey, normalized);
    setIsSaving(true);
    try {
      const response = await getPreferences().catch(() => null);
      const existing = response?.data?.preferences || response?.preferences || {};
      await updatePreferences({
        ...existing,
        [DASHBOARD_WIDGET_PREFERENCES_KEY]: normalized,
      });
    } catch {
      // Keep the local value when the preferences endpoint is unavailable.
    } finally {
      setIsSaving(false);
    }
  }, [userKey, accessibleIds]);

  const toggleWidget = useCallback((widgetId) => {
    if (!accessibleIds.includes(widgetId)) return;
    const next = visibleWidgetIds.includes(widgetId)
      ? visibleWidgetIds.filter(id => id !== widgetId)
      : [...visibleWidgetIds, widgetId];
    persist(next);
  }, [persist, visibleWidgetIds, accessibleIds]);

  const resetWidgets = useCallback(
    () => persist(getDefaultDashboardWidgetIds().filter(id => accessibleIds.includes(id))),
    [persist, accessibleIds],
  );

  const visibleWidgets = useMemo(
    () => accessibleWidgets.filter(widget => visibleWidgetIds.includes(widget.id)),
    [accessibleWidgets, visibleWidgetIds],
  );

  return {
    widgets: accessibleWidgets,
    allWidgets: dashboardWidgetRegistry,
    visibleWidgets,
    visibleWidgetIds,
    toggleWidget,
    resetWidgets,
    isSaving,
    isAdmin,
  };
};

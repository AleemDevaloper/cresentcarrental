import { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react';
import sound040 from '../assets/sound/universfield-new-notification-040-493469.mp3';
import sound051 from '../assets/sound/universfield-new-notification-051-494246.mp3';

export const UIContext = createContext(null);

export const useUIContext = () => {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUIContext must be used within UIProvider');
  return ctx;
};

export const UIProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [activeModule, setActiveModule] = useState('dashboard');
  const [systemContext, setSystemContext] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const [editDocument, setEditDocument] = useState(null);
  const [errorDialog, setErrorDialog] = useState({ show: false, title: '', message: '', details: '' });
  const [dialogQueue, setDialogQueue] = useState([]);
  const [globalLoading, setGlobalLoading] = useState({ show: false, text: 'Please wait...' });
  // Reference-count for loading callers to avoid rapid double-open/close flicker
  const loadingCount = useRef(0);
  const [frontFlyoverStack, setFrontFlyoverStack] = useState([]);
  const notificationTimers = useRef(new Map());

  const removeNotification = useCallback((id) => {
    const timer = notificationTimers.current.get(id);
    if (timer) { clearTimeout(timer); notificationTimers.current.delete(id); }
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const addNotification = useCallback((message, type = 'info', duration = 4000, options = {}) => {
    const id = Date.now() + Math.random();
    setNotifications(prev => [...prev, { id, message, type, duration, title: options.title, timestamp: options.timestamp || new Date().toISOString(), actions: options.actions }]);
    
    try {
      const playSound = localStorage.getItem('manage_core_play_sounds') === 'true';
      if (playSound) {
        const selectedSound = localStorage.getItem('manage_core_selected_sound') || 'sound040';
        const audioFile = selectedSound === 'sound051' ? sound051 : sound040;
        const audio = new Audio(audioFile);
        audio.volume = 0.55;
        audio.play().catch(() => {});
      }
    } catch (err) {
      console.error('Failed to play notification sound:', err);
    }

    if (duration > 0) {
      const timer = setTimeout(() => removeNotification(id), duration);
      notificationTimers.current.set(id, timer);
    }
  }, [removeNotification]);

  const showErrorDialog = useCallback((title, message, details = '') => setErrorDialog({ show: true, title, message, details }), []);
  const hideErrorDialog = useCallback(() => setErrorDialog({ show: false, title: '', message: '', details: '' }), []);

  const showDialog = useCallback((dialog) => {
    const id = Date.now();
    setDialogQueue(prev => [...prev, { id, ...dialog }]);
    return id;
  }, []);

  const closeDialog = useCallback((id) => setDialogQueue(prev => prev.filter(d => d.id !== id)), []);
  const closeAllDialogs = useCallback(() => setDialogQueue([]), []);

  const confirmDialog = useCallback(({ title, message, variant = 'danger', confirmLabel = 'Yes, Delete', cancelLabel = 'Cancel' } = {}) => {
    return new Promise((resolve) => {
      setDialogQueue(prev => [...prev, { id: Date.now(), type: 'confirm', title: title || 'Confirm', message: message || 'Are you sure?', variant, confirmLabel, cancelLabel, _resolve: resolve, show: true }]);
    });
  }, []);

  const alertDialog = useCallback(({ title, message, variant = 'info', confirmLabel = 'OK' } = {}) => {
    return new Promise((resolve) => {
      setDialogQueue(prev => [...prev, { id: Date.now(), type: 'alert', title: title || 'Alert', message: message || '', variant, confirmLabel, _resolve: resolve, show: true }]);
    });
  }, []);

  const hideTimeout = useRef(null);

  const showGlobalLoading = useCallback((text = 'Please wait...') => {
    // cancel any pending hide
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }
    // increment ref count and show overlay
    loadingCount.current = (loadingCount.current || 0) + 1;
    setGlobalLoading({ show: true, text });
  }, []);

  const hideGlobalLoading = useCallback(() => {
    // decrement and only hide when nobody is left; use a short delay to avoid flicker
    loadingCount.current = Math.max(0, (loadingCount.current || 0) - 1);
    if (loadingCount.current === 0) {
      // delay hiding briefly so quick toggles don't cause reopen
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
      hideTimeout.current = setTimeout(() => {
        if (loadingCount.current === 0) setGlobalLoading({ show: false, text: '' });
        hideTimeout.current = null;
      }, 220);
    }
  }, []);

  const pushFrontFlyover = useCallback((title, content, options = {}) => setFrontFlyoverStack(prev => [...prev, { title, content, ...options }]), []);
  const replaceFrontFlyover = useCallback((title, content, options = {}) => setFrontFlyoverStack([{ title, content, ...options }]), []);
  const popFrontFlyover = useCallback(() => setFrontFlyoverStack(prev => prev.slice(0, -1)), []);
  const clearFrontFlyovers = useCallback(() => setFrontFlyoverStack([]), []);

  const frontFlyover = useMemo(() =>
    frontFlyoverStack.length ? { isOpen: true, ...frontFlyoverStack[frontFlyoverStack.length - 1] } : { isOpen: false, title: '', content: null },
    [frontFlyoverStack]
  );

  const value = useMemo(() => ({
    notifications, addNotification, removeNotification,
    activeTab, setActiveTab, activeModule, setActiveModule,
    systemContext, setSystemContext, editUser, setEditUser, editTask, setEditTask,
    editDocument, setEditDocument,
    errorDialog, showErrorDialog, hideErrorDialog,
    dialogQueue, showDialog, closeDialog, closeAllDialogs, confirmDialog, alertDialog,
    globalLoading, showGlobalLoading, hideGlobalLoading,
    frontFlyoverStack, frontFlyover, pushFrontFlyover, replaceFrontFlyover, popFrontFlyover, clearFrontFlyovers,
  }), [
    notifications, activeTab, activeModule, systemContext,
    editUser, editTask, editDocument, errorDialog, dialogQueue, globalLoading, frontFlyoverStack, frontFlyover,
    addNotification, removeNotification, showErrorDialog, hideErrorDialog,
    showDialog, closeDialog, closeAllDialogs, confirmDialog, alertDialog,
    showGlobalLoading, hideGlobalLoading, pushFrontFlyover, replaceFrontFlyover, popFrontFlyover, clearFrontFlyovers,
  ]);

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};

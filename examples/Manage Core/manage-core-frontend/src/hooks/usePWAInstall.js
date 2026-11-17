import { useState, useEffect } from 'react';

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(window.deferredPrompt || null);
  const [isInstallable, setIsInstallable] = useState(!!window.deferredPrompt);

  useEffect(() => {
    // Catch early setup if event was already captured in main.jsx
    if (window.deferredPrompt) {
      setDeferredPrompt(window.deferredPrompt);
      setIsInstallable(true);
    }

    // Register hook to get update if event fires later
    window.setDeferredPromptHook = (e) => {
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      window.deferredPrompt = e;
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.setDeferredPromptHook = null;
    };
  }, []);

  const installPWA = async () => {
    const promptEvent = deferredPrompt || window.deferredPrompt;
    if (!promptEvent) return;

    // Show the native browser install prompt automatically
    promptEvent.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await promptEvent.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the PWA install prompt');
    } else {
      console.log('User dismissed the PWA install prompt');
    }

    // Clear prompt state after usage
    setDeferredPrompt(null);
    window.deferredPrompt = null;
    setIsInstallable(false);
  };

  return { isInstallable, installPWA };
};

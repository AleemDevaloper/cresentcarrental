import { createRoot } from 'react-dom/client'
import './chartSetup'
import './styles/main.scss'
import './styles/table-themes.css'
import App from './App.jsx'

if ('serviceWorker' in navigator) {
  if (import.meta.env.DEV) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      if (registrations.length > 0) {
        registrations.forEach((registration) => {
          registration.unregister().then(() => {
            console.log('Unregistered active Service Worker for development');
            window.location.reload();
          });
        });
      }
    });
  } else {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
}

// Catch early PWA installation prompt events
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.deferredPrompt = e;
  if (window.setDeferredPromptHook) {
    window.setDeferredPromptHook(e);
  }
});

createRoot(document.getElementById('root')).render(
  <App />
)

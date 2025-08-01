import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { LoaderProvider } from './context/LoaderContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { NotificationProvider } from './context/NotificationContext.jsx'
import { SyncProvider } from './context/SyncContext.jsx'

import { registerSW } from 'virtual:pwa-register';

registerSW({
  onNeedRefresh() {
    console.log("Hay una nueva versión disponible");
  },
  onOfflineReady() {
    console.log("La app está lista para funcionar offline");
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoaderProvider>
      <ToastProvider>
        <NotificationProvider>
          <SyncProvider> 
            <App />
          </SyncProvider>
        </NotificationProvider>
      </ToastProvider>
    </LoaderProvider>
  </StrictMode>
);
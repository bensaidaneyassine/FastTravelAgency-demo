import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// (Removed debug instrumentation and forced API base)
import './i18n/i18n';
import { FloatingWhatsApp } from "./components/FloatingWhatsApp";
import { withTranslation,useTranslation } from 'react-i18next';

// Increment BUILD_VERSION to force a new bundle hash when diagnosing stale caches
const BUILD_VERSION = 'v1.1';

const RootComponent = () => {
  const [isTest, setIsTest] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
      // Service worker disabled (caused 404 previously) – re-enable when a real sw.js is implemented
      if (navigator.serviceWorker?.getRegistration) {
        navigator.serviceWorker.getRegistration().then(reg=>{ if(reg) { console.log('Existing SW found – leaving active'); } });
      }
      // Log API base detected for quick troubleshooting
      try {
        const { getApiBase } = require('./utils/apiBase');
    console.log('[BOOT] API base =', getApiBase(), 'build', BUILD_VERSION);
      } catch(_) {}

    const userAgent = navigator.userAgent;
    const userAgentData = navigator.userAgentData;
    if (/Lighthouse|Chrome-Lighthouse|PageSpeed|Google Page Speed Insights/i.test(userAgent)) {
      setIsTest(true);
    }
  }, []);

  return (
    <React.StrictMode>
      <React.Suspense fallback="loading">
      <App></App>
      <FloatingWhatsApp
        phoneNumber="+966541906145"
        accountName={t("title")}
        allowEsc
        allowClickAway
        notification
        notificationSound
      />
      </React.Suspense>
    </React.StrictMode>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RootComponent />);

reportWebVitals();

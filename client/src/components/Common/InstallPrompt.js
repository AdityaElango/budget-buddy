import React, { useState, useEffect } from 'react';
import './InstallPrompt.css';

const InstallPrompt = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      
      // Don't show if already dismissed or installed
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
      
      if (!dismissed && !isInstalled) {
        setTimeout(() => setShowPrompt(true), 3000); // Show after 3 seconds
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('App is running as PWA');
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }

    setInstallPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showPrompt || !installPrompt) return null;

  return (
    <div className="install-prompt">
      <div className="install-prompt-content">
        <img src="/logo_icon.png" alt="BudgetBuddy" className="install-prompt-icon" />
        <div className="install-prompt-text">
          <h3>Install BudgetBuddy</h3>
          <p>Install the app for a better experience with offline support!</p>
        </div>
      </div>
      <div className="install-prompt-actions">
        <button onClick={handleDismiss} className="btn btn-ghost">
          Not Now
        </button>
        <button onClick={handleInstall} className="btn btn-primary">
          Install App
        </button>
      </div>
    </div>
  );
};

export default InstallPrompt;

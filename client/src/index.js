import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './mobile.css';
import App from './App';
import Context from './components/Context/Context';
import { ThemeProvider } from './components/Context/ThemeContext';
import { ToastProvider } from './components/Toast/ToastProvider';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './components/Auth/AuthProvider';
import reportWebVitals from './reportWebVitals';

// Add page reload timeout to prevent hanging
let reloadTimeout = null;

// Monitor page visibility to handle reload hangs
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    // Page became visible - clear any pending reload timeout
    if (reloadTimeout) {
      clearTimeout(reloadTimeout);
      reloadTimeout = null;
    }
  }
});

// Prevent infinite reload loops
if (sessionStorage.getItem('page_reload_count')) {
  const count = parseInt(sessionStorage.getItem('page_reload_count'));
  if (count > 3) {
    console.warn('Too many page reloads detected. Clearing cache.');
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => registration.unregister());
      });
    }
    caches.keys().then(names => {
      names.forEach(name => caches.delete(name));
    });
    sessionStorage.removeItem('page_reload_count');
  } else {
    sessionStorage.setItem('page_reload_count', count + 1);
  }
} else {
  sessionStorage.setItem('page_reload_count', '1');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Context>
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  </Context>
);

// Register service worker for PWA support with timeout
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Set a timeout to detect if SW registration is hanging
    const swTimeout = setTimeout(() => {
      console.warn('Service Worker registration taking too long');
    }, 5000);

    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        clearTimeout(swTimeout);
        console.log('Service Worker registered:', registration);
        
        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60000); // Check every minute
      })
      .catch((error) => {
        clearTimeout(swTimeout);
        console.log('Service Worker registration failed:', error);
      });
  });
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

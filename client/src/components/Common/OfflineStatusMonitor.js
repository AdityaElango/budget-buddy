/**
 * Offline Status Monitor Component
 * Displays offline mode status and provides diagnostic info
 * Add to your app to monitor offline functionality
 */

import React, { useState, useEffect } from 'react';

const OfflineStatusMonitor = ({ showDebug = false }) => {
  const [status, setStatus] = useState({
    isOnline: navigator.onLine,
    hasServiceWorker: 'serviceWorker' in navigator,
    swRegistered: false,
    hasIndexedDB: !!window.indexedDB,
    cacheSize: 'Calculating...',
    lastSync: localStorage.getItem('lastSyncTime') || 'Never',
    pendingTransactions: 0
  });

  useEffect(() => {
    // Check service worker status
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        setStatus(prev => ({
          ...prev,
          swRegistered: registrations.length > 0
        }));
      });
    }

    // Check cache size
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then(estimate => {
        const used = (estimate.usage / (1024 * 1024)).toFixed(2);
        setStatus(prev => ({
          ...prev,
          cacheSize: `${used}MB`
        }));
      });
    }

    // Monitor online/offline
    const handleOnline = () => {
      setStatus(prev => ({ ...prev, isOnline: true }));
      console.log('Back online!');
    };

    const handleOffline = () => {
      setStatus(prev => ({ ...prev, isOnline: false }));
      console.log('Gone offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleClearCache = async () => {
    if (window.confirm('Clear all cached data? This may cause slower loads.')) {
      const names = await caches.keys();
      await Promise.all(names.map(name => caches.delete(name)));
      alert('Cache cleared!');
    }
  };

  const handleCheckDB = async () => {
    try {
      const request = indexedDB.open('BudgetBuddyOfflineDB');
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction(['pendingTransactions'], 'readonly');
        const store = tx.objectStore('pendingTransactions');
        const countRequest = store.count();
        countRequest.onsuccess = () => {
          setStatus(prev => ({
            ...prev,
            pendingTransactions: countRequest.result
          }));
          alert(`Pending transactions: ${countRequest.result}`);
        };
      };
    } catch (error) {
      alert('Error checking database: ' + error.message);
    }
  };

  if (!showDebug) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: status.isOnline ? '#10b981' : '#f59e0b',
      color: 'white',
      padding: '15px 20px',
      borderRadius: '8px',
      fontSize: '12px',
      fontFamily: 'monospace',
      maxWidth: '300px',
      zIndex: 10000,
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
        Status: {status.isOnline ? '🟢 ONLINE' : '🔴 OFFLINE'}
      </div>

      <div style={{ fontSize: '11px', lineHeight: '1.6' }}>
        <div>Service Worker: {status.swRegistered ? '✅' : '❌'}</div>
        <div>IndexedDB: {status.hasIndexedDB ? '✅' : '❌'}</div>
        <div>Cache Size: {status.cacheSize}</div>
        <div>Pending Syncs: {status.pendingTransactions}</div>
        <div>Last Sync: {status.lastSync}</div>
      </div>

      <div style={{ marginTop: '10px', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
        <button
          onClick={handleCheckDB}
          style={{
            padding: '4px 8px',
            fontSize: '11px',
            background: 'rgba(255,255,255,0.3)',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Check DB
        </button>
        <button
          onClick={handleClearCache}
          style={{
            padding: '4px 8px',
            fontSize: '11px',
            background: 'rgba(255,255,255,0.3)',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Clear Cache
        </button>
      </div>
    </div>
  );
};

export default OfflineStatusMonitor;

/**
 * To use this component:
 * 
 * In your main App.js or index.js:
 * 
 * import OfflineStatusMonitor from './components/Common/OfflineStatusMonitor';
 * 
 * // Add to your JSX:
 * <OfflineStatusMonitor showDebug={process.env.NODE_ENV === 'development'} />
 * 
 * This will show a floating status box in development mode with:
 * - Current online/offline status
 * - Service Worker registration status
 * - IndexedDB availability
 * - Cache size being used
 * - Pending transactions waiting to sync
 */

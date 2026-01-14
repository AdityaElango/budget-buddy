/**
 * Offline Data Manager for BudgetBuddy
 * Handles data persistence when offline using IndexedDB
 */

const DB_NAME = 'BudgetBuddyOfflineDB';
const DB_VERSION = 1;
const STORES = {
  PENDING_TRANSACTIONS: 'pendingTransactions',
  CACHED_DATA: 'cachedData'
};

class OfflineManager {
  constructor() {
    this.db = null;
    this.isOnline = navigator.onLine;
    this.initDB();
    this.setupEventListeners();
  }

  // Initialize IndexedDB
  initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Store for pending transactions (to sync when online)
        if (!db.objectStoreNames.contains(STORES.PENDING_TRANSACTIONS)) {
          const store = db.createObjectStore(STORES.PENDING_TRANSACTIONS, {
            keyPath: 'id',
            autoIncrement: true
          });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('type', 'type', { unique: false });
        }

        // Store for cached data (for offline viewing)
        if (!db.objectStoreNames.contains(STORES.CACHED_DATA)) {
          const store = db.createObjectStore(STORES.CACHED_DATA, {
            keyPath: 'key'
          });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  // Setup online/offline event listeners
  setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('Back online - syncing data...');
      this.syncPendingTransactions();
      this.showToast('Back online! Syncing your data...', 'success');
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('Gone offline - data will be saved locally');
      this.showToast('You\'re offline. Changes will sync when back online.', 'info');
    });
  }

  // Add pending transaction (when offline)
  async addPendingTransaction(data) {
    await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORES.PENDING_TRANSACTIONS], 'readwrite');
      const store = transaction.objectStore(STORES.PENDING_TRANSACTIONS);

      const request = store.add({
        ...data,
        timestamp: Date.now(),
        synced: false
      });

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Get all pending transactions
  async getPendingTransactions() {
    await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORES.PENDING_TRANSACTIONS], 'readonly');
      const store = transaction.objectStore(STORES.PENDING_TRANSACTIONS);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Delete synced transaction
  async deletePendingTransaction(id) {
    await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORES.PENDING_TRANSACTIONS], 'readwrite');
      const store = transaction.objectStore(STORES.PENDING_TRANSACTIONS);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Sync pending transactions when back online
  async syncPendingTransactions() {
    const pending = await this.getPendingTransactions();
    
    if (pending.length === 0) {
      console.log('No pending transactions to sync');
      return;
    }

    console.log(`Syncing ${pending.length} pending transactions...`);

    for (const item of pending) {
      try {
        const { id, timestamp, synced, ...data } = item;
        
        // Send to server based on type
        let response;
        if (item.type === 'expense') {
          response = await fetch(`${process.env.REACT_APP_API_URL || ''}/api/expense`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('usersdatatoken')}`
            },
            body: JSON.stringify(data)
          });
        } else if (item.type === 'income') {
          response = await fetch(`${process.env.REACT_APP_API_URL || ''}/api/income`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('usersdatatoken')}`
            },
            body: JSON.stringify(data)
          });
        } else if (item.type === 'budget') {
          response = await fetch(`${process.env.REACT_APP_API_URL || ''}/api/budget`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('usersdatatoken')}`
            },
            body: JSON.stringify(data)
          });
        }

        if (response && response.ok) {
          await this.deletePendingTransaction(id);
          console.log(`Synced transaction ${id}`);
        }
      } catch (error) {
        console.error('Failed to sync transaction:', error);
      }
    }

    this.showToast('All pending changes synced!', 'success');
  }

  // Cache data for offline viewing
  async cacheData(key, data) {
    await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORES.CACHED_DATA], 'readwrite');
      const store = transaction.objectStore(STORES.CACHED_DATA);

      const request = store.put({
        key,
        data,
        timestamp: Date.now()
      });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Get cached data
  async getCachedData(key) {
    await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORES.CACHED_DATA], 'readonly');
      const store = transaction.objectStore(STORES.CACHED_DATA);
      const request = store.get(key);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.data : null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Helper to show toast (assumes ToastContext is available)
  showToast(message, type = 'info') {
    const event = new CustomEvent('showToast', {
      detail: { message, type }
    });
    window.dispatchEvent(event);
  }

  // Check if online
  get online() {
    return this.isOnline;
  }
}

// Export singleton instance
const offlineManager = new OfflineManager();
export default offlineManager;

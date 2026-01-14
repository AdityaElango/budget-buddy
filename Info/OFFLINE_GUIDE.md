# BudgetBuddy Offline Mode Guide

## ✅ Offline Features Enabled

Your expense tracker now works completely offline with automatic syncing when you reconnect to the internet.

### What Works Offline

✅ **View existing data:**
- See all your accounts and balances
- Review past transactions and expenses
- Check your budget status
- View financial health metrics
- Access your savings goals
- View recurring transactions
- Check transaction analytics

✅ **Add new data:**
- Create new expenses (will sync when online)
- Add new income (will sync when online)
- Add new budgets (will sync when online)
- Create new accounts (will sync when online)

✅ **Edit data:**
- All edits are cached and synced automatically
- Changes are queued if offline and sent when connected

### What Requires Internet

❌ Login/Signup - requires initial internet connection
❌ User authentication - token validation happens online

## 🚀 Installation & Setup

### Install as an App (Mobile)

1. Open the app in your mobile browser (Chrome, Safari, or Edge)
2. Look for the **"Install"** button that appears at the bottom of the screen
3. Tap it to add BudgetBuddy to your home screen
4. The app will work like a native app and load faster

### Alternatively (If no install button):

**Android (Chrome):**
- Tap the three-dot menu → "Install app" → "Install"

**iOS (Safari):**
- Tap the Share button → "Add to Home Screen" → "Add"

## 📱 Offline Indicators

- **Yellow bar at top** = You're offline (changes will sync when online)
- **Green bar at top** = Back online (syncing in progress)
- **Toast notification** = Confirms data has been synced

## 🔄 Auto-Sync Features

When you go offline:
1. All your data is stored locally on your device
2. You can continue using the app normally
3. When you reconnect to internet:
   - ✅ All pending changes automatically sync to the server
   - ✅ You get a notification when sync is complete
   - ✅ No data is lost

## ⚡ Performance Tips

1. **App loads instantly from cache** - even on slow connections
2. **Automatic timeout after 8 seconds** - if the server doesn't respond, cached data is shown
3. **Periodic cache updates** - every minute, the app checks for updates
4. **Smart caching** - static files are cached, fresh data always loads from server when possible

## 🛡️ Data Safety

- ✅ All data encrypted with HTTPS when online
- ✅ LocalStorage for offline credentials (encrypted)
- ✅ IndexedDB for transaction history (local device storage)
- ✅ No data leaves your phone when offline
- ✅ Automatic sync ensures no data loss

## 🔧 Troubleshooting

### App is Slow/Hanging

1. **Hard refresh the page:**
   - Android: Hold power button → Restart
   - iOS: Close app and reopen
   - Desktop: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

2. **Clear cache if page keeps loading:**
   - Go to browser settings → Clear cache/cookies
   - Reinstall the app if it's installed

3. **Check internet speed:**
   - Open any website to test connection
   - Switch to WiFi if on slow mobile data

### Data Not Syncing

1. **Check if you're online:**
   - Look for the indicator at the top of the app
   - Try opening any website

2. **Wait a moment:**
   - Sync happens automatically within 10 seconds of reconnecting
   - Don't close the app while it's syncing

3. **Manually sync:**
   - Go to any page and refresh (Cmd+R / Ctrl+R)
   - Check browser console for errors

### Lost Data

Data is only lost if:
- You clear cache/cookies from browser settings
- You uninstall the app without syncing first

**Prevention:**
- Stay connected to internet when adding important data
- Check for sync confirmation notification

## 📊 Offline Mode Architecture

```
┌─────────────────────────────────────┐
│     BudgetBuddy Offline Mode        │
├─────────────────────────────────────┤
│                                     │
│  Service Worker (Caching Layer)     │
│  ├─ Static assets: Cache-first      │
│  ├─ API calls: Network-first + 8s   │
│  └─ Timeout fallback to cache       │
│                                     │
│  IndexedDB (Local Storage)          │
│  ├─ Pending transactions            │
│  ├─ Cached API responses            │
│  └─ User preferences                │
│                                     │
│  Network Resilience                 │
│  ├─ Automatic retries (2x)          │
│  ├─ Exponential backoff             │
│  └─ Graceful error handling         │
│                                     │
└─────────────────────────────────────┘
```

## 🌐 How It Works

### When Online
1. App fetches latest data from server
2. Server response cached for instant future access
3. User sees real-time data
4. Any offline data automatically syncs

### When Offline
1. App serves cached data instantly
2. New data stored in IndexedDB
3. Changes queued for sync
4. UI shows offline indicator
5. User can continue working normally

### When Reconnecting
1. Connection detected automatically
2. Pending transactions sent to server
3. Latest data fetched from server
4. Cache updated
5. Success notification shown

## 🔐 Security Notes

- ✅ Offline data NOT encrypted (stored on your device locally)
- ✅ Online data encrypted with HTTPS
- ✅ Token stored in localStorage (secure as browser allows)
- ✅ No sensitive data in cache (only synced data)

**Best practices:**
- Don't use on public/shared devices
- Clear cookies when done on public WiFi
- Keep your device locked when not in use

## 📞 Support

If you experience issues:

1. **Check browser console:** F12 → Console tab → Look for errors
2. **Hard refresh:** Ctrl+Shift+R or Cmd+Shift+R
3. **Try different browser:** Chrome, Safari, Firefox all supported
4. **Check internet:** Open any website to verify connection

---

**Version:** 2.0+ (With offline support)
**Last Updated:** January 2026
**Browser Support:** Chrome 51+, Firefox 44+, Safari 11+, Edge 79+

#!/usr/bin/env node

/**
 * Offline Features Test Suite
 * 
 * Run this to verify offline functionality is properly configured
 * Usage: node test-offline-setup.js
 */

const fs = require('fs');
const path = require('path');

const projectRoot = path.dirname(__filename);
const clientRoot = path.join(projectRoot, 'client');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  pass: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  fail: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.cyan}ℹ️  ${msg}${colors.reset}`),
  title: (msg) => console.log(`\n${colors.blue}${msg}${colors.reset}`)
};

// Test suite
const tests = [];

// Check file existence
function checkFile(filePath, description) {
  tests.push(() => {
    const fullPath = path.join(projectRoot, filePath);
    if (fs.existsSync(fullPath)) {
      log.pass(`${description}: ${filePath}`);
      return true;
    } else {
      log.fail(`${description}: ${filePath} NOT FOUND`);
      return false;
    }
  });
}

// Check file content
function checkFileContent(filePath, searchString, description) {
  tests.push(() => {
    const fullPath = path.join(projectRoot, filePath);
    if (!fs.existsSync(fullPath)) {
      log.fail(`${description}: File not found - ${filePath}`);
      return false;
    }
    
    const content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes(searchString)) {
      log.pass(`${description}: Found in ${filePath}`);
      return true;
    } else {
      log.fail(`${description}: Not found in ${filePath}`);
      return false;
    }
  });
}

// Tests
log.title('🧪 Offline Features Test Suite\n');

log.info('Checking file structure...');
checkFile('client/public/service-worker.js', 'Service Worker');
checkFile('client/src/utils/offlineManager.js', 'Offline Manager');
checkFile('client/src/components/Common/OfflineIndicator.js', 'Offline Indicator');
checkFile('client/src/components/Common/InstallPrompt.js', 'Install Prompt');
checkFile('client/src/utils/networkResilient.js', 'Network Resilience Utils');
checkFile('client/src/components/Common/OfflineStatusMonitor.js', 'Offline Status Monitor');
checkFile('OFFLINE_GUIDE.md', 'User Guide');
checkFile('OFFLINE_DEPLOYMENT.md', 'Deployment Guide');
checkFile('QUICK_SETUP.md', 'Quick Setup Guide');

log.info('Checking Service Worker configuration...');
checkFileContent('client/public/service-worker.js', 'const TIMEOUT = 8000', 'Service Worker 8-second timeout');
checkFileContent('client/public/service-worker.js', 'function fetchWithTimeout', 'fetchWithTimeout function');
checkFileContent('client/public/service-worker.js', 'const API_CACHE =', 'API cache separation');
checkFileContent('client/public/service-worker.js', 'budgetbuddy-v2', 'Cache version updated');

log.info('Checking reload safety...');
checkFileContent('client/src/index.js', 'page_reload_count', 'Reload loop detection');
checkFileContent('client/src/index.js', 'sessionStorage', 'Session storage for reload tracking');
checkFileContent('client/src/index.js', 'setInterval', 'Periodic Service Worker update check');

log.info('Checking offline manager...');
checkFileContent('client/src/utils/offlineManager.js', 'IndexedDB', 'IndexedDB integration');
checkFileContent('client/src/utils/offlineManager.js', 'pendingTransactions', 'Pending transactions store');
checkFileContent('client/src/utils/offlineManager.js', 'syncPendingTransactions', 'Auto-sync function');

log.info('Checking network resilience...');
checkFileContent('client/src/utils/networkResilient.js', 'fetchWithRetry', 'Retry function');
checkFileContent('client/src/utils/networkResilient.js', 'MAX_RETRIES', 'Max retry configuration');
checkFileContent('client/src/utils/networkResilient.js', 'Exponential backoff', 'Exponential backoff');

log.info('Checking PWA manifest...');
checkFileContent('client/public/manifest.json', 'BudgetBuddy', 'PWA manifest');
checkFileContent('client/public/manifest.json', 'standalone', 'PWA display mode');

log.info('Checking offline indicator integration...');
checkFileContent('client/src/components/Common/OfflineIndicator.js', 'navigator.onLine', 'Online detection');

log.info('Checking install prompt...');
checkFileContent('client/src/components/Common/InstallPrompt.js', 'beforeinstallprompt', 'Install event handling');

// Run all tests
log.title('\n📋 Test Results\n');

let passed = 0;
let failed = 0;

tests.forEach(test => {
  try {
    if (test()) {
      passed++;
    } else {
      failed++;
    }
  } catch (error) {
    log.fail(`Test error: ${error.message}`);
    failed++;
  }
});

// Summary
log.title('\n📊 Summary\n');
console.log(`Total Tests: ${passed + failed}`);
log.pass(`Passed: ${passed}`);
if (failed > 0) {
  log.fail(`Failed: ${failed}`);
} else {
  log.pass(`Failed: 0`);
}

// Recommendations
log.title('\n💡 Next Steps\n');

if (failed === 0) {
  log.info('All checks passed! ✅');
  log.info('');
  log.info('1. Install dependencies:');
  log.info('   cd client && npm install');
  log.info('   cd ../server && npm install');
  log.info('');
  log.info('2. Start development:');
  log.info('   Terminal 1: cd client && npm start');
  log.info('   Terminal 2: cd server && npm start');
  log.info('');
  log.info('3. Test offline functionality:');
  log.info('   - Open DevTools (F12)');
  log.info('   - Go to Network tab');
  log.info('   - Check "Offline" checkbox');
  log.info('   - Use app normally - should work with cache');
  log.info('   - Uncheck "Offline" to test auto-sync');
  log.info('');
  log.info('4. Deploy:');
  log.info('   - Push to GitHub');
  log.info('   - Vercel auto-deploys frontend');
  log.info('   - App ready for production!');
} else {
  log.warn('Some checks failed. Please review the output above.');
  log.warn('');
  log.warn('Common issues:');
  log.warn('1. Files not found - ensure all new files were created');
  log.warn('2. Content not found - check that file modifications were applied');
  log.warn('3. Check file paths match your project structure');
}

process.exit(failed === 0 ? 0 : 1);

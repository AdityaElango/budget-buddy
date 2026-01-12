/**
 * Test Script to Verify All Connections and Functionality
 * Run with: node test-connections.js
 */

const axios = require('axios');

const API_BASE = 'http://localhost:5001/api';
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m'
};

let testToken = null;
let testUserId = null;
const testEmail = `test${Date.now()}@test.com`;
const testPassword = 'test123456';

// Helper functions
const log = (msg, type = 'info') => {
  const color = type === 'success' ? colors.green : type === 'error' ? colors.red : colors.yellow;
  console.log(`${color}${msg}${colors.reset}`);
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Test functions
async function testServerHealth() {
  log('\n🔍 Testing Server Health...', 'info');
  try {
    const res = await axios.get('http://localhost:5001');
    if (res.data.status === 'Server is running') {
      log('✅ Server is running properly', 'success');
      return true;
    }
  } catch (error) {
    log(`❌ Server health check failed: ${error.message}`, 'error');
    return false;
  }
}

async function testSignup() {
  log('\n🔍 Testing Signup...', 'info');
  try {
    const res = await axios.post(`${API_BASE}/signup`, {
      fname: 'Test User',
      email: testEmail,
      password: testPassword,
      cpassword: testPassword
    });
    
    if (res.data.status === 201) {
      log('✅ Signup successful', 'success');
      testUserId = res.data.user.id;
      return true;
    }
  } catch (error) {
    log(`❌ Signup failed: ${error.response?.data?.message || error.message}`, 'error');
    return false;
  }
}

async function testLogin() {
  log('\n🔍 Testing Login...', 'info');
  try {
    const res = await axios.post(`${API_BASE}/login`, {
      email: testEmail,
      password: testPassword
    });
    
    if (res.data.status === 201 && res.data.result.token) {
      testToken = res.data.result.token;
      log('✅ Login successful', 'success');
      log(`   Token: ${testToken.substring(0, 20)}...`, 'info');
      return true;
    }
  } catch (error) {
    log(`❌ Login failed: ${error.response?.data?.message || error.message}`, 'error');
    return false;
  }
}

async function testValidateUser() {
  log('\n🔍 Testing User Validation...', 'info');
  try {
    const res = await axios.get(`${API_BASE}/validuser`, {
      headers: {
        Authorization: `Bearer ${testToken}`
      }
    });
    
    if (res.data.status === 201 && res.data.ValidUserOne) {
      log('✅ User validation successful', 'success');
      log(`   User: ${res.data.ValidUserOne.fname} (${res.data.ValidUserOne.email})`, 'info');
      return true;
    }
  } catch (error) {
    log(`❌ User validation failed: ${error.response?.data?.message || error.message}`, 'error');
    return false;
  }
}

async function testAddExpense() {
  log('\n🔍 Testing Add Expense...', 'info');
  try {
    const currentDate = new Date();
    const res = await axios.post(
      `${API_BASE}/expense`,
      {
        amount: 100,
        account: 'Cash',
        description: 'Test Expense',
        category: 'Food',
        date: currentDate.toISOString(),
        user: testUserId,
        tags: ['test']
      },
      {
        headers: {
          Authorization: `Bearer ${testToken}`
        }
      }
    );
    
    if (res.status === 200) {
      log('✅ Expense added successfully', 'success');
      return true;
    }
  } catch (error) {
    log(`❌ Add expense failed: ${error.response?.data?.error || error.message}`, 'error');
    return false;
  }
}

async function testGetExpenses() {
  log('\n🔍 Testing Get Expenses...', 'info');
  try {
    const currentDate = new Date();
    const res = await axios.get(
      `${API_BASE}/expense/user/${testUserId}?month=${currentDate.getMonth() + 1}&year=${currentDate.getFullYear()}`,
      {
        headers: {
          Authorization: `Bearer ${testToken}`
        }
      }
    );
    
    if (res.status === 200) {
      log('✅ Expenses retrieved successfully', 'success');
      log(`   Found ${res.data.usersExpense?.length || 0} expenses`, 'info');
      return true;
    }
  } catch (error) {
    log(`❌ Get expenses failed: ${error.response?.data?.error || error.message}`, 'error');
    return false;
  }
}

async function testAddIncome() {
  log('\n🔍 Testing Add Income...', 'info');
  try {
    const currentDate = new Date();
    const res = await axios.post(
      `${API_BASE}/income`,
      {
        amount: 5000,
        account: 'Bank',
        description: 'Monthly Salary',
        category: 'Salary',
        date: currentDate.toISOString(),
        user: testUserId,
        tags: ['salary', 'test']
      },
      {
        headers: {
          Authorization: `Bearer ${testToken}`
        }
      }
    );
    
    if (res.status === 200) {
      log('✅ Income added successfully', 'success');
      return true;
    }
  } catch (error) {
    log(`❌ Add income failed: ${error.response?.data?.error || error.message}`, 'error');
    return false;
  }
}

async function testGetIncome() {
  log('\n🔍 Testing Get Income...', 'info');
  try {
    const currentDate = new Date();
    const res = await axios.get(
      `${API_BASE}/income/user/${testUserId}?month=${currentDate.getMonth() + 1}&year=${currentDate.getFullYear()}`,
      {
        headers: {
          Authorization: `Bearer ${testToken}`
        }
      }
    );
    
    if (res.status === 200) {
      log('✅ Income retrieved successfully', 'success');
      log(`   Found ${res.data.usersIncome?.length || 0} income entries`, 'info');
      return true;
    }
  } catch (error) {
    log(`❌ Get income failed: ${error.response?.data?.error || error.message}`, 'error');
    return false;
  }
}

async function testCleanup() {
  log('\n🔍 Cleaning up test data...', 'info');
  try {
    const res = await axios.delete(`${API_BASE}/delete-user`, {
      data: { email: testEmail }
    });
    
    if (res.data.status === 200) {
      log('✅ Test data cleaned up', 'success');
      return true;
    }
  } catch (error) {
    log(`⚠️  Cleanup warning: ${error.response?.data?.message || error.message}`, 'info');
    return false;
  }
}

// Run all tests
async function runAllTests() {
  log('\n========================================', 'info');
  log('🧪 Starting Comprehensive System Tests', 'info');
  log('========================================\n', 'info');

  const tests = [
    { name: 'Server Health', fn: testServerHealth },
    { name: 'Signup', fn: testSignup },
    { name: 'Login', fn: testLogin },
    { name: 'Validate User', fn: testValidateUser },
    { name: 'Add Expense', fn: testAddExpense },
    { name: 'Get Expenses', fn: testGetExpenses },
    { name: 'Add Income', fn: testAddIncome },
    { name: 'Get Income', fn: testGetIncome },
    { name: 'Cleanup', fn: testCleanup }
  ];

  const results = [];
  
  for (const test of tests) {
    const passed = await test.fn();
    results.push({ name: test.name, passed });
    await delay(500); // Small delay between tests
  }

  // Summary
  log('\n========================================', 'info');
  log('📊 Test Results Summary', 'info');
  log('========================================\n', 'info');

  results.forEach(result => {
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    log(`${status}: ${result.name}`, result.passed ? 'success' : 'error');
  });

  const passCount = results.filter(r => r.passed).length;
  const totalCount = results.length;
  
  log(`\n📈 Total: ${passCount}/${totalCount} tests passed`, 'info');
  
  if (passCount === totalCount) {
    log('\n🎉 All tests passed! System is working correctly.', 'success');
  } else {
    log('\n⚠️  Some tests failed. Please review the errors above.', 'error');
  }
}

// Execute tests
runAllTests().catch(error => {
  log(`\n💥 Test suite error: ${error.message}`, 'error');
  process.exit(1);
});

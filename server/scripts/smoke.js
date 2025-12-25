const axios = require('axios');
const BASE = 'http://localhost:5001/api';

async function jsonFetch(path, options = {}) {
  const method = (options.method || 'GET').toLowerCase();
  const url = `${BASE}${path}`;
  const config = {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    validateStatus: () => true,
  };
  let res;
  if (method === 'get') {
    res = await axios.get(url, config);
  } else if (method === 'post') {
    res = await axios.post(url, options.body ? JSON.parse(options.body) : undefined, config);
  } else if (method === 'put') {
    res = await axios.put(url, options.body ? JSON.parse(options.body) : undefined, config);
  } else if (method === 'delete') {
    res = await axios.delete(url, config);
  } else {
    throw new Error(`Unsupported method: ${options.method}`);
  }
  if (res.status >= 200 && res.status < 300) return res.data;
  throw new Error(`HTTP ${res.status}: ${JSON.stringify(res.data)}`);
}

async function getOrCreateUser() {
  const email = 'tester.copilot@example.com';
  try {
    const signup = await jsonFetch('/signup', {
      method: 'POST',
      body: JSON.stringify({ fname: 'Test User', email, password: 'Passw0rd!', cpassword: 'Passw0rd!' })
    });
    const id = signup?.storeData?._id;
    if (!id) throw new Error('Signup did not return user id');
    return id;
  } catch (e) {
    // Try login and extract id
    const login = await jsonFetch('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: 'Passw0rd!' })
    });
    const id = login?.result?.userValid?._id;
    if (!id) throw new Error('Login did not return user id');
    return id;
  }
}

async function addExpense(userId) {
  return jsonFetch('/expense', {
    method: 'POST',
    body: JSON.stringify({
      category: 'Food',
      amount: 123.45,
      description: 'Smoke test expense',
      account: 'Cash',
      date: new Date().toISOString().slice(0,10),
      user: userId,
    })
  });
}

async function addIncome(userId) {
  return jsonFetch('/income', {
    method: 'POST',
    body: JSON.stringify({
      category: 'Salary',
      amount: 999.99,
      description: 'Smoke test income',
      account: 'Savings',
      date: new Date().toISOString().slice(0,10),
      user: userId,
    })
  });
}

async function fetchLists(userId) {
  const expenses = await jsonFetch(`/expense/user/${userId}`);
  const incomes = await jsonFetch(`/income/user/${userId}`);
  return { expenses, incomes };
}

(async () => {
  try {
    const userId = await getOrCreateUser();
    console.log('User ID:', userId);
    const exp = await addExpense(userId);
    console.log('Added expense id:', exp?._id);
    const inc = await addIncome(userId);
    console.log('Added income id:', inc?._id);
    const { expenses, incomes } = await fetchLists(userId);
    console.log('Expense count:', Array.isArray(expenses) ? expenses.length : 'n/a');
    console.log('Income count:', Array.isArray(incomes) ? incomes.length : 'n/a');
    console.log('Smoke test completed successfully.');
  } catch (err) {
    console.error('Smoke test failed:', err.message);
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Data:', err.response.data);
    }
    console.error(err.stack);
    process.exit(1);
  }
})();

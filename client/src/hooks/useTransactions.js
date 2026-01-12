/**
 * Custom React Hooks for Transaction Data Management
 * Centralizes all transaction-related API calls and state management
 * Benefits:
 * - Single source of truth for transaction data
 * - Automatic caching via cachedGet
 * - Consistent error handling
 * - Easy to refetch/invalidate cache
 */

import { useState, useCallback, useEffect } from 'react';
import { cachedGet, clearCachedGet } from '../api/api';
import transactionService from '../services/transactionService';

/**
 * Hook to fetch user expenses with automatic caching
 */
export const useExpenses = (userId, month = null, year = null) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchExpenses = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const path = `/expense/user/${userId}`;
      const params = {};
      if (month && year) {
        params.month = month;
        params.year = year;
      }

      const data = await cachedGet(path, params);
      setExpenses(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  }, [userId, month, year]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const refetch = useCallback(async () => {
    if (!userId) return;
    const path = `/expense/user/${userId}`;
    const params = {};
    if (month && year) {
      params.month = month;
      params.year = year;
    }
    clearCachedGet(path, params);
    await fetchExpenses();
  }, [userId, month, year, fetchExpenses]);

  return { expenses, loading, error, refetch };
};

/**
 * Hook to fetch user income with automatic caching
 */
export const useIncome = (userId, month = null, year = null) => {
  const [income, setIncome] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchIncome = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const path = `/income/user/${userId}`;
      const params = {};
      if (month && year) {
        params.month = month;
        params.year = year;
      }

      const data = await cachedGet(path, params);
      setIncome(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch income');
    } finally {
      setLoading(false);
    }
  }, [userId, month, year]);

  useEffect(() => {
    fetchIncome();
  }, [fetchIncome]);

  const refetch = useCallback(async () => {
    if (!userId) return;
    const path = `/income/user/${userId}`;
    const params = {};
    if (month && year) {
      params.month = month;
      params.year = year;
    }
    clearCachedGet(path, params);
    await fetchIncome();
  }, [userId, month, year, fetchIncome]);

  return { income, loading, error, refetch };
};

/**
 * Hook to fetch budgets for a user
 */
export const useBudgets = (userId) => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBudgets = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await cachedGet(`/budget/user/${userId}`);
      setBudgets(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch budgets');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const refetch = useCallback(async () => {
    if (!userId) return;
    clearCachedGet(`/budget/user/${userId}`);
    await fetchBudgets();
  }, [userId, fetchBudgets]);

  return { budgets, loading, error, refetch };
};

/**
 * Hook to fetch recurring transactions
 */
export const useRecurring = (userId) => {
  const [recurring, setRecurring] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecurring = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await cachedGet(`/recurring/user/${userId}`);
      setRecurring(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch recurring transactions');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchRecurring();
  }, [fetchRecurring]);

  const refetch = useCallback(async () => {
    if (!userId) return;
    clearCachedGet(`/recurring/user/${userId}`);
    await fetchRecurring();
  }, [userId, fetchRecurring]);

  return { recurring, loading, error, refetch };
};

/**
 * Hook for adding a transaction with automatic refetch
 */
export const useAddExpense = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addExpense = useCallback(async (expenseData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await transactionService.addExpense(expenseData);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.expense;
    } catch (err) {
      setError(err.message || 'Failed to add expense');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { addExpense, loading, error };
};

/**
 * Hook for adding income with automatic refetch
 */
export const useAddIncome = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addIncome = useCallback(async (incomeData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await transactionService.addIncome(incomeData);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.income;
    } catch (err) {
      setError(err.message || 'Failed to add income');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { addIncome, loading, error };
};

/**
 * Hook for deleting expense
 */
export const useDeleteExpense = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteExpense = useCallback(async (expenseId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await transactionService.deleteExpense(expenseId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete expense');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteExpense, loading, error };
};

/**
 * Hook for deleting income
 */
export const useDeleteIncome = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteIncome = useCallback(async (incomeId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await transactionService.deleteIncome(incomeId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete income');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteIncome, loading, error };
};

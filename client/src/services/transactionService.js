/**
 * Transaction Service
 * Handles all transaction-related business logic
 * - Fetching expenses and income
 * - Data transformation
 * - Category grouping
 * - Caching logic
 */

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

class TransactionService {
  /**
   * Get user expenses with caching
   */
  async getUserExpenses(userId, month = null, year = null) {
    try {
      let url = `${API_URL}/expense/user/${userId}`;
      if (month && year) {
        url += `?month=${month}&year=${year}`;
      }

      const response = await axios.get(url);
      return {
        success: true,
        expenses: response.data || [],
      };
    } catch (error) {
      return {
        success: false,
        expenses: [],
        error: error.response?.data?.message || 'Failed to fetch expenses',
      };
    }
  }

  /**
   * Get user income with caching
   */
  async getUserIncome(userId, month = null, year = null) {
    try {
      let url = `${API_URL}/income/user/${userId}`;
      if (month && year) {
        url += `?month=${month}&year=${year}`;
      }

      const response = await axios.get(url);
      return {
        success: true,
        income: response.data || [],
      };
    } catch (error) {
      return {
        success: false,
        income: [],
        error: error.response?.data?.message || 'Failed to fetch income',
      };
    }
  }

  /**
   * Get category-wise expense breakdown
   */
  async getCategoryExpenses(userId, month = null, year = null) {
    try {
      let url = `${API_URL}/expense/category/user/${userId}`;
      if (month && year) {
        url += `?month=${month}&year=${year}`;
      }

      const response = await axios.get(url);
      return {
        success: true,
        categories: response.data || [],
      };
    } catch (error) {
      return {
        success: false,
        categories: [],
        error: error.response?.data?.message ||
          'Failed to fetch category expenses',
      };
    }
  }

  /**
   * Get account-wise expense breakdown
   */
  async getAccountExpenses(userId, month = null, year = null) {
    try {
      let url = `${API_URL}/expense/account/user/${userId}`;
      if (month && year) {
        url += `?month=${month}&year=${year}`;
      }

      const response = await axios.get(url);
      return {
        success: true,
        accounts: response.data || [],
      };
    } catch (error) {
      return {
        success: false,
        accounts: [],
        error: error.response?.data?.message ||
          'Failed to fetch account expenses',
      };
    }
  }

  /**
   * Add new expense
   */
  async addExpense(expenseData) {
    try {
      const response = await axios.post(`${API_URL}/expense`, expenseData);
      return {
        success: true,
        expense: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add expense',
      };
    }
  }

  /**
   * Add new income
   */
  async addIncome(incomeData) {
    try {
      const response = await axios.post(`${API_URL}/income`, incomeData);
      return {
        success: true,
        income: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add income',
      };
    }
  }

  /**
   * Delete expense
   */
  async deleteExpense(expenseId) {
    try {
      await axios.delete(`${API_URL}/expense/${expenseId}`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete expense',
      };
    }
  }

  /**
   * Delete income
   */
  async deleteIncome(incomeId) {
    try {
      await axios.delete(`${API_URL}/income/${incomeId}`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete income',
      };
    }
  }

  /**
   * Calculate total expenses
   */
  calculateTotalExpenses(expenses) {
    return expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  }

  /**
   * Calculate total income
   */
  calculateTotalIncome(income) {
    return income.reduce((sum, inc) => sum + (inc.amount || 0), 0);
  }

  /**
   * Group expenses by category
   */
  groupByCategory(expenses) {
    return expenses.reduce((groups, expense) => {
      const category = expense.category || 'Uncategorized';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(expense);
      return groups;
    }, {});
  }

  /**
   * Calculate average expense
   */
  calculateAverageExpense(expenses) {
    if (expenses.length === 0) return 0;
    return this.calculateTotalExpenses(expenses) / expenses.length;
  }
}

export default new TransactionService();

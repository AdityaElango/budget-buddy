/**
 * Budget Service
 * Handles all budget-related business logic
 * - Fetching budgets
 * - Budget vs actual calculations
 * - Budget alerts
 */

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

class BudgetService {
  /**
   * Get user budgets
   */
  async getBudgets(userId) {
    try {
      const response = await axios.get(`${API_URL}/budget/user/${userId}`);
      return {
        success: true,
        budgets: response.data || [],
      };
    } catch (error) {
      return {
        success: false,
        budgets: [],
        error: error.response?.data?.message || 'Failed to fetch budgets',
      };
    }
  }

  /**
   * Create new budget
   */
  async createBudget(budgetData) {
    try {
      const response = await axios.post(`${API_URL}/budget`, budgetData);
      return {
        success: true,
        budget: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create budget',
      };
    }
  }

  /**
   * Update budget
   */
  async updateBudget(budgetId, budgetData) {
    try {
      const response = await axios.put(
        `${API_URL}/budget/${budgetId}`,
        budgetData
      );
      return {
        success: true,
        budget: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update budget',
      };
    }
  }

  /**
   * Delete budget
   */
  async deleteBudget(budgetId) {
    try {
      await axios.delete(`${API_URL}/budget/${budgetId}`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete budget',
      };
    }
  }

  /**
   * Calculate budget utilization percentage
   */
  calculateUtilization(spent, limit) {
    if (limit === 0) return 0;
    return Math.round((spent / limit) * 100);
  }

  /**
   * Determine budget status
   */
  getBudgetStatus(spent, limit) {
    const utilization = this.calculateUtilization(spent, limit);

    if (utilization >= 90) return 'danger';
    if (utilization >= 80) return 'warning';
    if (utilization >= 70) return 'info';
    return 'success';
  }

  /**
   * Calculate remaining budget
   */
  calculateRemaining(spent, limit) {
    return Math.max(0, limit - spent);
  }

  /**
   * Check if budget exceeded
   */
  isBudgetExceeded(spent, limit) {
    return spent > limit;
  }
}

export default new BudgetService();

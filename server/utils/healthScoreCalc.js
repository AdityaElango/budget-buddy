const Expense = require("../models/expenseSchema");
const Income = require("../models/incomeSchema");
const Budget = require("../models/budgetSchema");
const {
  calculateFinancialHealth: calcScore,
  getHealthStatus,
  getHealthInsights
} = require("./financialHealth");

/**
 * Main controller for calculating financial health
 * Fetches data and uses modular calculation logic
 */
const calculateFinancialHealth = async (userId, month, year) => {
  try {
    // Fetch data for the period
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const [incomeData, expenseData, budgetData] = await Promise.all([
      Income.find({
        user: userId,
        date: { $gte: startDate, $lte: endDate },
      }),
      Expense.find({
        user: userId,
        date: { $gte: startDate, $lte: endDate },
      }),
      Budget.find({
        user: userId,
        month: month,
        year: year,
      }),
    ]);

    // Calculate totals
    const totalIncome = incomeData.reduce((sum, item) => sum + (item.amount || 0), 0);
    const totalExpenses = expenseData.reduce((sum, item) => sum + (item.amount || 0), 0);
    const savings = totalIncome - totalExpenses;

    // Group expenses by week for stability calculation
    const weeklyExpenses = groupByWeek(expenseData);

    // Map budgets to include spent amounts
    const budgetsWithSpent = budgetData.map((budget) => {
      const spent = expenseData
        .filter((exp) => exp.category === budget.category)
        .reduce((sum, exp) => sum + (exp.amount || 0), 0);
      return { ...budget.toObject(), spent, limit: budget.amount };
    });

    // Use modular calculation function
    const score = calcScore({
      totalIncome,
      totalExpenses,
      savings,
      budgets: budgetsWithSpent,
      weeklyExpenses
    });

    // Get status label and styling class
    const { status, class: statusClass } = getHealthStatus(score);

    // Generate insights/suggestions
    const insights = getHealthInsights({
      totalIncome,
      totalExpenses,
      savings,
      budgets: budgetsWithSpent
    });

    // Build comprehensive response
    return {
      score,
      status,
      statusClass,
      insights,
      breakdown: {
        totalIncome,
        totalExpenses,
        savings,
        savingsRate: totalIncome > 0 ? parseFloat(((savings / totalIncome) * 100).toFixed(1)) : 0,
        budgetCount: budgetData.length,
        budgetsExceeded: budgetsWithSpent.filter(b => b.spent > b.limit).length
      }
    };
  } catch (error) {
    console.error("Error calculating financial health:", error);
    throw error;
  }
};

/**
 * Group expenses by week of month for stability calculation
 */
const groupByWeek = (expenses) => {
  const weeks = [];

  expenses.forEach((exp) => {
    if (exp.date) {
      const day = new Date(exp.date).getDate();
      const week = Math.ceil(day / 7);
      weeks[week] = (weeks[week] || 0) + (exp.amount || 0);
    }
  });

  return Object.values(weeks).filter(val => val > 0);
};

module.exports = { calculateFinancialHealth };


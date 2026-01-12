/**
 * Generate monthly insights based on transaction data
 */
export const generateMonthlyInsights = (expenses, incomes, prevMonthExpenses, prevMonthIncomes, budgets = []) => {
  const insights = [];

  // Category spending change
  const categoryCurrentMonth = {};
  const categoryPrevMonth = {};

  expenses.forEach((exp) => {
    categoryCurrentMonth[exp.category] = (categoryCurrentMonth[exp.category] || 0) + exp.amount;
  });

  prevMonthExpenses.forEach((exp) => {
    categoryPrevMonth[exp.category] = (categoryPrevMonth[exp.category] || 0) + exp.amount;
  });

  // Find biggest category changes
  const categories = Object.keys(categoryCurrentMonth);
  categories.forEach((cat) => {
    const current = categoryCurrentMonth[cat];
    const prev = categoryPrevMonth[cat] || 0;
    const change = ((current - prev) / (prev || current)) * 100;

    if (Math.abs(change) > 15) {
      const direction = change > 0 ? '↑' : '↓';
      const percent = Math.abs(change).toFixed(0);
      insights.push({
        type: 'category-change',
        text: `${direction} ${cat} spending ${change > 0 ? 'increased' : 'decreased'} by ${percent}%`,
        category: cat,
        change: change,
        severity: Math.abs(change) > 30 ? 'warning' : 'info'
      });
    }
  });

  // Savings rate analysis
  const totalCurrentIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
  const totalCurrentExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalPrevIncome = prevMonthIncomes.reduce((sum, inc) => sum + inc.amount, 0);
  const totalPrevExpense = prevMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const currentSavingsRate = totalCurrentIncome > 0 ? ((totalCurrentIncome - totalCurrentExpense) / totalCurrentIncome) * 100 : 0;
  const prevSavingsRate = totalPrevIncome > 0 ? ((totalPrevIncome - totalPrevExpense) / totalPrevIncome) * 100 : 0;

  if (currentSavingsRate > prevSavingsRate) {
    insights.push({
      type: 'savings-improvement',
      text: `✓ Savings improved! Currently saving ${currentSavingsRate.toFixed(1)}% of income (up from ${prevSavingsRate.toFixed(1)}% last month)`,
      severity: 'positive'
    });
  } else if (currentSavingsRate < prevSavingsRate) {
    insights.push({
      type: 'savings-decline',
      text: `⚠ Savings declined to ${currentSavingsRate.toFixed(1)}% of income (down from ${prevSavingsRate.toFixed(1)}% last month)`,
      severity: 'warning'
    });
  }

  // Budget adherence
  const budgetAlerts = budgets
    .filter(b => b.spent && b.limit && b.spent > b.limit)
    .sort((a, b) => (b.spent / b.limit) - (a.spent / a.limit));

  budgetAlerts.slice(0, 2).forEach((budget) => {
    const exceeded = budget.spent - budget.limit;
    insights.push({
      type: 'budget-exceeded',
      text: `⚠ ${budget.category} budget exceeded by ₹${exceeded.toFixed(0)} (${((budget.spent / budget.limit) * 100).toFixed(0)}% spent)`,
      category: budget.category,
      severity: 'warning'
    });
  });

  // High spending day
  const dailyTotals = {};
  expenses.forEach((exp) => {
    const date = new Date(exp.date).toLocaleDateString('en-IN');
    dailyTotals[date] = (dailyTotals[date] || 0) + exp.amount;
  });

  const maxDay = Object.entries(dailyTotals).reduce((max, [date, amount]) =>
    amount > max.amount ? { date, amount } : max,
    { date: null, amount: 0 }
  );

  if (maxDay.date && maxDay.amount > totalCurrentExpense / 10) {
    insights.push({
      type: 'high-spending-day',
      text: `📊 Highest spending day: ${maxDay.date} (₹${maxDay.amount.toFixed(0)})`,
      severity: 'info'
    });
  }

  return insights;
};

/**
 * Detect budget alerts (70%, 80%, 90% threshold)
 */
export const generateBudgetAlerts = (budgets) => {
  return budgets
    .filter(b => b.spent && b.limit)
    .map((budget) => {
      const percent = (budget.spent / budget.limit) * 100;
      let threshold = null;
      let severity = 'info';

      if (percent >= 90) {
        threshold = 90;
        severity = 'danger';
      } else if (percent >= 80) {
        threshold = 80;
        severity = 'warning';
      } else if (percent >= 70) {
        threshold = 70;
        severity = 'info';
      }

      if (threshold) {
        return {
          category: budget.category,
          spent: budget.spent,
          limit: budget.limit,
          percent: percent.toFixed(0),
          threshold,
          severity,
          message: `${budget.category} budget at ${percent.toFixed(0)}%`,
          suggestion: percent >= 80 ? `Consider reducing ${budget.category.toLowerCase()} expenses` : null
        };
      }
      return null;
    })
    .filter(Boolean);
};

/**
 * Analyze recurring transactions for patterns
 */
export const analyzeRecurringTransactions = (recurring, expenses) => {
  const analysis = {
    totalMonthlyCommitment: 0,
    predictedMonthlyExpense: 0,
    potentialSavings: 0,
    recommendations: []
  };

  recurring.forEach((rec) => {
    if (rec.type === 'expense') {
      analysis.totalMonthlyCommitment += rec.amount || 0;
    }
  });

  // Find unused/infrequent recurring transactions
  const recurringMap = {};
  recurring.forEach((rec) => {
    if (rec.type === 'expense') {
      recurringMap[rec.description?.toLowerCase()] = rec;
    }
  });

  // Check if any recurring transactions weren't actually used this month
  const usedRecurring = new Set();
  expenses.forEach((exp) => {
    const key = exp.description?.toLowerCase();
    if (recurringMap[key]) {
      usedRecurring.add(key);
    }
  });

  recurring.forEach((rec) => {
    const key = rec.description?.toLowerCase();
    if (rec.type === 'expense' && !usedRecurring.has(key)) {
      analysis.recommendations.push({
        type: 'unused-recurring',
        text: `${rec.description} (₹${rec.amount}/month) hasn't been used recently. Consider cancelling?`,
        description: rec.description,
        amount: rec.amount,
        severity: 'info'
      });
    }
  });

  analysis.predictedMonthlyExpense = analysis.totalMonthlyCommitment;
  return analysis;
};

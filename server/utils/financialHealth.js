/**
 * Modular Financial Health Score Calculation
 * Single source of truth for all health calculations
 */

function calculateFinancialHealth({
  totalIncome,
  totalExpenses,
  savings,
  budgets,
  weeklyExpenses
}) {
  let score = 0;

  // 1. Income vs Expense Ratio (40 points)
  // Measures if spending is within reasonable limits relative to income
  if (totalIncome > 0) {
    const ratio = totalExpenses / totalIncome;
    if (ratio <= 0.6) score += 40;        // Excellent: spending ≤ 60% of income
    else if (ratio <= 0.8) score += 30;   // Good: spending ≤ 80% of income
    else if (ratio <= 1) score += 20;     // Fair: spending ≤ 100% of income
    else score += 10;                     // Poor: overspending
  } else {
    score += 10; // No income yet
  }

  // 2. Savings Rate (25 points)
  // Measures ability to save relative to income
  if (totalIncome > 0) {
    const savingsRate = savings / totalIncome;
    if (savingsRate >= 0.3) score += 25;      // Excellent: saving ≥ 30%
    else if (savingsRate >= 0.15) score += 18; // Good: saving ≥ 15%
    else if (savingsRate >= 0.05) score += 10; // Fair: saving ≥ 5%
    else score += 5;                           // Poor: saving < 5%
  } else {
    score += 5; // No income yet
  }

  // 3. Budget Discipline (20 points)
  // Measures adherence to set budgets
  if (budgets.length > 0) {
    const respected = budgets.filter(b => b.spent <= b.limit).length;
    const ratio = respected / budgets.length;
    if (ratio >= 1) score += 20;        // Perfect: all budgets respected
    else if (ratio >= 0.75) score += 15; // Good: 75%+ budgets respected
    else if (ratio >= 0.5) score += 10;  // Fair: 50%+ budgets respected
    else score += 5;                     // Poor: < 50% budgets respected
  } else {
    score += 10; // No budgets set yet (give partial credit)
  }

  // 4. Spending Stability (15 points)
  // Measures consistency of spending patterns
  if (weeklyExpenses.length >= 2) {
    const avgExpense = weeklyExpenses.reduce((a, b) => a + b, 0) / weeklyExpenses.length;
    const variance = Math.max(...weeklyExpenses) - Math.min(...weeklyExpenses);
    
    // More lenient variance thresholds
    if (variance <= avgExpense * 0.3) score += 15;  // Excellent: variance ≤ 30% of avg
    else if (variance <= avgExpense * 0.7) score += 10; // Good: variance ≤ 70% of avg
    else score += 5;                                     // Fair: high variance
  } else {
    score += 10; // Not enough data yet
  }

  // Ensure score is between 60 (minimum for new users) and 100
  return Math.min(Math.max(Math.round(score), 60), 100);
}

/**
 * Get status badge and color based on score
 */
function getHealthStatus(score) {
  if (score >= 80) return { status: "Good", class: "good" };
  if (score >= 60) return { status: "Fair", class: "okay" };
  return { status: "Needs Attention", class: "bad" };
}

/**
 * Generate health insights and suggestions
 */
function getHealthInsights(data) {
  const suggestions = [];

  const { totalIncome, totalExpenses, savings, budgets } = data;

  // Income issues
  if (totalIncome === 0) {
    suggestions.push("📊 Add income to unlock accurate financial insights.");
  } else if (totalExpenses > totalIncome) {
    suggestions.push("⚠️ You're spending more than earning. Try to reduce expenses or increase income.");
  }

  // Savings issues
  if (savings <= 0) {
    suggestions.push("🏦 Start saving even small amounts regularly to build an emergency fund.");
  } else if (totalIncome > 0 && (savings / totalIncome) < 0.1) {
    suggestions.push("📈 Aim to save at least 10% of your income each month.");
  }

  // Budget issues
  if (budgets.length === 0) {
    suggestions.push("💰 Set monthly budgets for each category to better control spending.");
  } else {
    const exceeded = budgets.filter(b => b.spent > b.limit).length;
    if (exceeded > 0) {
      suggestions.push(`⚠️ You're exceeding ${exceeded} budget(s). Review and adjust your spending.`);
    }
  }

  // No suggestions = doing well
  if (suggestions.length === 0) {
    suggestions.push("✅ You're managing your finances well. Keep it up!");
  }

  return suggestions;
}

module.exports = {
  calculateFinancialHealth,
  getHealthStatus,
  getHealthInsights
};

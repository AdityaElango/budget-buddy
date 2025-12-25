/**
 * Anomaly Detection for Unusual Spending
 * Flags transactions that are significantly higher than normal
 */

/**
 * Calculate statistics for a dataset
 */
function calculateStats(amounts) {
  if (amounts.length === 0) return { mean: 0, stdDev: 0 };

  const mean = amounts.reduce((sum, val) => sum + val, 0) / amounts.length;
  const variance = amounts.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / amounts.length;
  const stdDev = Math.sqrt(variance);

  return { mean, stdDev };
}

/**
 * Detect anomalies in transactions
 * Uses statistical methods (Z-score) to flag unusual transactions
 * 
 * @param {Array} transactions - Array of transaction objects with amount property
 * @param {number} threshold - Z-score threshold (default: 2 = 95% confidence)
 * @returns {Array} Transactions flagged as anomalies
 */
export function detectAnomalies(transactions, threshold = 2) {
  if (!transactions || transactions.length < 3) {
    return []; // Need at least 3 transactions for meaningful detection
  }

  // Calculate statistics
  const amounts = transactions.map(t => t.amount || 0);
  const { mean, stdDev } = calculateStats(amounts);

  // Flag anomalies
  const anomalies = transactions.filter(transaction => {
    const amount = transaction.amount || 0;
    const zScore = stdDev > 0 ? Math.abs((amount - mean) / stdDev) : 0;
    return zScore > threshold;
  }).map(transaction => ({
    ...transaction,
    anomalyType: transaction.amount > mean ? 'high' : 'low',
    deviation: ((transaction.amount - mean) / mean * 100).toFixed(0)
  }));

  return anomalies;
}

/**
 * Detect category-specific anomalies
 * Flags unusual spending within specific categories
 */
export function detectCategoryAnomalies(transactions, category, threshold = 1.5) {
  const categoryTransactions = transactions.filter(t => t.category === category);
  return detectAnomalies(categoryTransactions, threshold);
}

/**
 * Generate anomaly insights message
 */
export function generateAnomalyInsights(anomalies) {
  if (anomalies.length === 0) {
    return "✅ No unusual spending detected. Your expenses are consistent with your patterns.";
  }

  const highAnomalies = anomalies.filter(a => a.anomalyType === 'high');
  
  if (highAnomalies.length === 0) return null;

  const insights = [];
  
  if (highAnomalies.length === 1) {
    const a = highAnomalies[0];
    insights.push(`🚨 Unusual transaction: ₹${a.amount.toFixed(0)} for ${a.description || a.category} (${Math.abs(a.deviation)}% above average)`);
  } else {
    const total = highAnomalies.reduce((sum, a) => sum + a.amount, 0);
    insights.push(`🚨 ${highAnomalies.length} unusual high-value transactions detected, totaling ₹${total.toFixed(0)}`);
  }

  return insights.join(' ');
}

/**
 * Check for spending spike in current month vs previous
 */
export function detectSpendingSpike(currentMonthExpenses, previousMonthExpenses, threshold = 30) {
  if (!previousMonthExpenses || previousMonthExpenses === 0) return null;

  const percentIncrease = ((currentMonthExpenses - previousMonthExpenses) / previousMonthExpenses) * 100;

  if (percentIncrease > threshold) {
    return {
      type: 'spike',
      message: `⚠️ Spending is up ${percentIncrease.toFixed(0)}% compared to last month`,
      increase: percentIncrease,
      difference: currentMonthExpenses - previousMonthExpenses
    };
  }

  return null;
}

/**
 * Monthly comparison analysis
 */
export function compareMonths(currentMonth, previousMonth) {
  if (!previousMonth) return null;

  const comparison = {
    income: {
      current: currentMonth.income || 0,
      previous: previousMonth.income || 0,
      change: 0,
      percentChange: 0
    },
    expenses: {
      current: currentMonth.expenses || 0,
      previous: previousMonth.expenses || 0,
      change: 0,
      percentChange: 0
    },
    savings: {
      current: currentMonth.savings || 0,
      previous: previousMonth.savings || 0,
      change: 0,
      percentChange: 0
    }
  };

  // Calculate changes
  Object.keys(comparison).forEach(key => {
    const curr = comparison[key].current;
    const prev = comparison[key].previous;
    comparison[key].change = curr - prev;
    comparison[key].percentChange = prev > 0 ? ((curr - prev) / prev * 100) : 0;
  });

  return comparison;
}

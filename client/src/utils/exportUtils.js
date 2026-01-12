/**
 * Export Utility Functions
 * Handles CSV and PDF report generation for financial data
 */

/**
 * Export data to CSV format
 */
export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Build CSV content
  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle values with commas by wrapping in quotes
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export monthly summary with category breakdown
 */
export const exportMonthlySummary = (incomeData, expenseData, accountBalances, monthLabel, year) => {
  const totalIncome = incomeData.reduce((sum, i) => sum + i.amount, 0);
  const totalExpenses = expenseData.reduce((sum, e) => sum + e.amount, 0);
  const netSavings = totalIncome - totalExpenses;
  
  const summary = [
    { Metric: 'Month', Value: `${monthLabel} ${year}` },
    { Metric: 'Total Income', Value: totalIncome },
    { Metric: 'Total Expenses', Value: totalExpenses },
    { Metric: 'Net Savings', Value: netSavings },
    { Metric: 'Savings Rate (%)', Value: totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(2) : 0 },
    { Metric: '', Value: '' }, // Empty row
    { Metric: 'Account Balances', Value: '' },
  ];

  accountBalances.forEach(acc => {
    summary.push({
      Metric: acc.accountType,
      Value: acc.difference || 0
    });
  });

  summary.push({ Metric: '', Value: '' }); // Empty row
  summary.push({ Metric: 'Expense Categories', Value: '' });

  // Add category breakdown
  const categoryTotals = {};
  expenseData.forEach(exp => {
    const cat = exp.category || 'Uncategorized';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + exp.amount;
  });

  Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .forEach(([category, amount]) => {
      const percent = totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(2) : 0;
      summary.push({
        Metric: category,
        Value: amount,
        Percentage: `${percent}%`
      });
    });

  summary.push({ Metric: '', Value: '' }); // Empty row
  summary.push({ Metric: 'Top Expenses', Value: '' });

  // Add top 10 expenses
  const sortedExpenses = [...expenseData].sort((a, b) => b.amount - a.amount).slice(0, 10);
  sortedExpenses.forEach((exp, idx) => {
    summary.push({
      Metric: `${idx + 1}. ${exp.description} (${exp.category})`,
      Value: exp.amount
    });
  });

  exportToCSV(summary, `monthly_summary_${monthLabel}_${year}`);
};

/**
 * Export transactions with filtering
 */
export const exportTransactions = (transactions, type = 'all') => {
  const formatted = transactions.map(t => ({
    Date: new Date(t.date).toLocaleDateString('en-IN'),
    Description: t.description,
    Category: t.category,
    Account: t.accountType || t.account,
    Amount: t.amount,
    Tags: Array.isArray(t.tags) ? t.tags.join(" ") : "",
    Type: t.type || (t.category ? 'expense' : 'income')
  }));

  exportToCSV(formatted, `transactions_${type}`);
};

/**
 * Generate HTML table for print-friendly PDF
 */
export const generateReportHTML = (title, data) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background-color: #f0f9ff; color: #1e40af; padding: 10px; text-align: left; border: 1px solid #bfdbfe; }
        td { padding: 8px; border: 1px solid #e5e7eb; }
        tr:nth-child(even) { background-color: #f9fafb; }
        .summary { background-color: #eff6ff; padding: 15px; border-left: 4px solid #2563eb; margin: 20px 0; }
        .footer { margin-top: 30px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <div class="summary">
        <strong>Generated:</strong> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
      </div>
      <table>
        <thead>
          <tr>
            ${Object.keys(data[0] || {}).map(key => `<th>${key}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${data.map(row => `
            <tr>
              ${Object.values(row).map(val => `<td>${val}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="footer">
        <p>This is an automatically generated report from BudgetBuddy.</p>
      </div>
    </body>
    </html>
  `;
  return html;
};

/**
 * Export report as printable HTML
 */
export const exportToPDF = (title, data) => {
  const html = generateReportHTML(title, data);
  const newWindow = window.open('', '', 'width=800,height=600');
  newWindow.document.write(html);
  newWindow.document.close();
  
  // Auto-print if user wants immediate PDF
  setTimeout(() => {
    newWindow.print();
  }, 500);
};

/**
 * Get category-wise expense summary
 */
export const getCategoryBreakdown = (expenses) => {
  const breakdown = {};
  
  expenses.forEach(expense => {
    const category = expense.category || 'Uncategorized';
    if (!breakdown[category]) {
      breakdown[category] = { count: 0, total: 0, average: 0 };
    }
    breakdown[category].count += 1;
    breakdown[category].total += expense.amount;
  });

  // Calculate averages
  Object.keys(breakdown).forEach(cat => {
    breakdown[cat].average = 
      breakdown[cat].total / breakdown[cat].count;
  });

  return breakdown;
};

/**
 * Get spending trends (day-wise)
 */
export const getSpendingTrends = (expenses) => {
  const trends = {};
  
  expenses.forEach(expense => {
    const date = new Date(expense.date).toLocaleDateString();
    if (!trends[date]) {
      trends[date] = 0;
    }
    trends[date] += expense.amount;
  });

  return trends;
};


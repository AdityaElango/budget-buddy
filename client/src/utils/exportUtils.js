// Export utility functions for generating CSV reports

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

export const exportMonthlySummary = (incomeData, expenseData, accountBalances, monthLabel, year) => {
  const summary = [
    { Metric: 'Month', Value: `${monthLabel} ${year}` },
    { Metric: 'Total Income', Value: incomeData.reduce((sum, i) => sum + i.amount, 0) },
    { Metric: 'Total Expenses', Value: expenseData.reduce((sum, e) => sum + e.amount, 0) },
    { Metric: 'Net Savings', Value: incomeData.reduce((sum, i) => sum + i.amount, 0) - expenseData.reduce((sum, e) => sum + e.amount, 0) },
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

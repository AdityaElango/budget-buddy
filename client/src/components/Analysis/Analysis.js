import React, { useState, useEffect,  useContext, useMemo  } from "react";
import "./Analysis.css";
import { useNavigate } from "react-router-dom";
import { DateContext, LoginContext } from "../Context/Context";
import { exportMonthlySummary } from "../../utils/exportUtils";
import { API_BASE_URL } from "../../api/api";
import { detectAnomalies, generateAnomalyInsights, compareMonths } from "../../utils/anomalyDetection";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

const chartColors = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#7c3aed", "#0ea5e9", "#ea580c", "#22c55e", "#475569", "#9ca3af"];

const ExpenseAnalysis = ({ data, totalIncome, totalExpense, totalBalance, monthLabel, selectedYear, categoryData, weeklyData, onDownloadSummary, prevMonthData, anomalies }) => {
  // Determine trend indicators
  const avgExpense = data.length > 0 ? data.reduce((sum, d) => sum + d.expenses, 0) / data.length : 0;
  const latestExpense = data.length > 0 ? data[data.length - 1].expenses : 0;
  const expenseTrend = latestExpense > avgExpense ? "increasing" : latestExpense < avgExpense ? "decreasing" : "stable";

  const avgIncome = data.length > 0 ? data.reduce((sum, d) => sum + d.income, 0) / data.length : 0;
  const latestIncome = data.length > 0 ? data[data.length - 1].income : 0;
  const incomeTrend = latestIncome > avgIncome ? "increasing" : latestIncome < avgIncome ? "decreasing" : "stable";

  // Calculate savings rate
  const savingsRate = totalIncome > 0 ? ((totalBalance / totalIncome) * 100).toFixed(1) : 0;

  // Cumulative savings trend for smoother line
  const savingsTrend = useMemo(() => {
    let running = 0;
    return data.map((row) => {
      running += row.savings;
      return { ...row, cumulative: running };
    });
  }, [data]);

  // Generate insights based on data
  const generateInsights = () => {
    const insights = [];

    // Check expense patterns
    if (data.length > 0) {
      const expenses = data.map(d => d.expenses);
      const maxExpense = Math.max(...expenses);
      const maxWeek = data.find(d => d.expenses === maxExpense);
      if (maxExpense > avgExpense * 1.3) {
        insights.push(`Expenses peaked in ${maxWeek.week}, with ₹${maxExpense.toLocaleString()} spent. This reduced savings that week.`);
      }
    }

    // Income stability
    if (incomeTrend === "stable") {
      insights.push("Income remained stable throughout the period, indicating predictable cash flow.");
    } else if (incomeTrend === "increasing") {
      insights.push("Income is increasing over time, which is positive for future savings potential.");
    } else {
      insights.push("Income shows a declining trend. Monitor this closely for financial planning.");
    }

    // Savings rate analysis
    if (savingsRate > 30) {
      insights.push(`✓ Strong savings rate of ${savingsRate}%. You're building wealth effectively.`);
    } else if (savingsRate > 0) {
      insights.push(`Savings rate is ${savingsRate}%. Consider reducing discretionary expenses to increase savings.`);
    } else {
      insights.push("⚠ Expenses exceed income. Review spending categories and set budget limits.");
    }

    // Category concentration insight
    if (totalExpense > 0 && categoryData?.length) {
      const sorted = [...categoryData].sort((a, b) => b.value - a.value);
      const topTwo = sorted.slice(0, 2);
      const share = topTwo.reduce((sum, c) => sum + c.value, 0);
      const percent = ((share / totalExpense) * 100).toFixed(0);
      const labels = topTwo.map((c) => c.name).join(" and ");
      if (percent >= 40) {
        insights.push(`${labels} account for ${percent}% of your expenses. Consider setting stricter budgets in these categories.`);
      }
    }

    return insights;
  };

  const insights = generateInsights();

  return (
    <div className='main_a'>
      <div className="analysis-actions">
        <button className="btn" type="button" onClick={onDownloadSummary}>
          📥 Download Summary (CSV)
        </button>
      </div>
      {/* Row 1 - Key Insights KPI Cards */}
      <div className='insights-row'>
        <div className={`kpi-card income`}>
          <p className='kpi-label'>Total Income</p>
          <p className='kpi-value'>₹{totalIncome.toLocaleString()}</p>
          <p className={`kpi-trend ${incomeTrend === 'increasing' ? 'positive' : incomeTrend === 'decreasing' ? 'negative' : 'stable'}`}>
            {incomeTrend === 'increasing' ? '↑' : incomeTrend === 'decreasing' ? '↓' : '→'} {incomeTrend}
          </p>
        </div>

        <div className={`kpi-card expense`}>
          <p className='kpi-label'>Total Expenses</p>
          <p className='kpi-value'>₹{totalExpense.toLocaleString()}</p>
          <p className={`kpi-trend ${expenseTrend === 'increasing' ? 'negative' : expenseTrend === 'decreasing' ? 'positive' : 'stable'}`}>
            {expenseTrend === 'increasing' ? '↑' : expenseTrend === 'decreasing' ? '↓' : '→'} {expenseTrend}
          </p>
        </div>

        <div className={`kpi-card savings`}>
          <p className='kpi-label'>Total Savings</p>
          <p className='kpi-value'>₹{totalBalance.toLocaleString()}</p>
          <p className={`kpi-trend ${totalBalance > 0 ? 'positive' : 'negative'}`}>
            {savingsRate}% of income saved
          </p>
        </div>
      </div>

      {/* Month-over-Month Comparison */}
      {prevMonthData && (
        <div className="comparison-section">
          <div className='a_headings'>
            <h1>Month-over-Month Comparison</h1>
            <p>How this month compares to last month</p>
          </div>
          <div className="comparison-grid">
            <div className="comparison-card">
              <div className="comparison-label">Income</div>
              <div className="comparison-values">
                <span className="current-value">₹{totalIncome.toLocaleString()}</span>
                <span className={`comparison-change ${totalIncome >= prevMonthData.totalIncome ? 'positive' : 'negative'}`}>
                  {totalIncome >= prevMonthData.totalIncome ? '↑' : '↓'} 
                  {prevMonthData.totalIncome > 0 ? Math.abs(((totalIncome - prevMonthData.totalIncome) / prevMonthData.totalIncome) * 100).toFixed(1) : '0'}%
                </span>
              </div>
              <div className="comparison-previous">Previous: ₹{prevMonthData.totalIncome.toLocaleString()}</div>
            </div>

            <div className="comparison-card">
              <div className="comparison-label">Expenses</div>
              <div className="comparison-values">
                <span className="current-value">₹{totalExpense.toLocaleString()}</span>
                <span className={`comparison-change ${totalExpense <= prevMonthData.totalExpense ? 'positive' : 'negative'}`}>
                  {totalExpense >= prevMonthData.totalExpense ? '↑' : '↓'} 
                  {prevMonthData.totalExpense > 0 ? Math.abs(((totalExpense - prevMonthData.totalExpense) / prevMonthData.totalExpense) * 100).toFixed(1) : '0'}%
                </span>
              </div>
              <div className="comparison-previous">Previous: ₹{prevMonthData.totalExpense.toLocaleString()}</div>
            </div>

            <div className="comparison-card">
              <div className="comparison-label">Savings</div>
              <div className="comparison-values">
                <span className="current-value">₹{totalBalance.toLocaleString()}</span>
                <span className={`comparison-change ${totalBalance >= prevMonthData.totalSavings ? 'positive' : 'negative'}`}>
                  {totalBalance >= prevMonthData.totalSavings ? '↑' : '↓'} 
                  {prevMonthData.totalSavings !== 0 ? Math.abs(((totalBalance - prevMonthData.totalSavings) / Math.abs(prevMonthData.totalSavings)) * 100).toFixed(1) : '0'}%
                </span>
              </div>
              <div className="comparison-previous">Previous: ₹{prevMonthData.totalSavings.toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}

      {/* Anomaly Detection */}
      {anomalies && anomalies.length > 0 && (
        <div className="anomalies-section">
          <div className='a_headings'>
            <h1>⚠️ Unusual Transactions Detected</h1>
            <p>These transactions are significantly higher than your average spending</p>
          </div>
          <div className="anomalies-grid">
            {anomalies.slice(0, 5).map((anomaly, idx) => (
              <div key={idx} className="anomaly-card">
                <div className="anomaly-header">
                  <span className="anomaly-category">{anomaly.category}</span>
                  <span className="anomaly-badge">{anomaly.deviation > 3 ? 'High Alert' : 'Unusual'}</span>
                </div>
                <div className="anomaly-amount">₹{anomaly.amount.toLocaleString()}</div>
                <div className="anomaly-description">{anomaly.description}</div>
                <div className="anomaly-stats">
                  {anomaly.deviation.toFixed(1)}x higher than average • {new Date(anomaly.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Row 2 - Chart */}
      <div className='graph'>
        <div className='a_headings'>
          <h1>Monthly Financial Trend</h1>
          <div className='chart-meta'>Weekly view for {monthLabel} {selectedYear}</div>
        </div>

        {data.length > 0 ? (
          <div className='chart-container'>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend wrapperStyle={{ paddingTop: "12px" }} />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#dc2626" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Expenses"
                />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#16a34a" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Income"
                />
                <Line 
                  type="monotone" 
                  dataKey="savings" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Savings"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className='empty-state'>
            <p>📊</p>
            <p>No data for {monthLabel} {selectedYear}.</p>
            <p>Add income or expenses to see the trend.</p>
            <button className="btn" type="button" onClick={() => window.location.assign("/transaction")}>Add a transaction</button>
          </div>
        )}
      </div>

        {/* Row 2b - Additional Charts */}
        <div className="charts-grid">
          <div className="chart-card">
            <div className='a_headings'>
              <h1>Category-wise Expenses</h1>
              <p>Where your money went this month</p>
            </div>
            {categoryData.length ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={50}
                    paddingAngle={2}
                    label={(entry) => `${entry.name} ${entry.percent?.toFixed?.(0) || 0}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${entry.name}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className='empty-state'>
                <p>🥧</p>
                <p>No expenses recorded for {monthLabel}.</p>
                <button className="btn" type="button" onClick={() => window.location.assign("/transaction")}>Record an expense</button>
              </div>
            )}
          </div>

          <div className="chart-card">
            <div className='a_headings'>
              <h1>Income vs Expense</h1>
              <p>Weekly comparison for {monthLabel}</p>
            </div>
            {weeklyData.length ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="income" fill="#16a34a" radius={[4,4,0,0]} name="Income" />
                  <Bar dataKey="expenses" fill="#dc2626" radius={[4,4,0,0]} name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className='empty-state'>
                <p>📊</p>
                <p>No data for {monthLabel}.</p>
                <button className="btn" type="button" onClick={() => window.location.assign("/transaction")}>Add income or expense</button>
              </div>
            )}
          </div>

          <div className="chart-card full-span">
            <div className='a_headings'>
              <h1>Savings Trend</h1>
              <p>Cumulative savings across the month</p>
            </div>
            {savingsTrend.length ? (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={savingsTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                  <Legend />
                  <Line type="monotone" dataKey="cumulative" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} name="Cumulative Savings" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className='empty-state'>
                <p>💧</p>
                <p>No savings data yet.</p>
                <button className="btn" type="button" onClick={() => window.location.assign("/transaction")}>Add income or reduce expense</button>
              </div>
            )}
          </div>
        </div>

      {/* Row 3 - Insights Section */}
      <div className='summary'>
        <div className='a_headings'>
          <h1>Financial Insights</h1>
          <p>Analysis of your spending and saving patterns</p>
        </div>

        {insights.length > 0 ? (
          <ul className='insights-list'>
            {insights.map((insight, index) => (
              <li key={index} className='insight-item'>
                <span className='insight-text'>{insight}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className='empty-state'>
            <p>No insights available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Analysis = () => {
  const history = useNavigate();
  const { logindata, setLoginData } = useContext(LoginContext);
  const { selectedMonth, selectedYear } = useContext(DateContext);

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [expensesThisMonth, setExpensesThisMonth] = useState([]);
  const [incomeThisMonth, setIncomeThisMonth] = useState([]);
  const [prevMonthData, setPrevMonthData] = useState(null);
  const [anomalies, setAnomalies] = useState([]);

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("usersdatatoken") || "",
  });

  const AnalysisValid = async () => {
    let token = localStorage.getItem("usersdatatoken");

    const res = await fetch(`${API_BASE_URL}/validuser`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
      credentials: "include",
    });
    
    const data = await res.json();
    console.log(data)

    if (data.status === 401 || !data.ValidUserOne) {
      history("/login");
    } else {
      setLoginData(data)
    }
  };

  const allTransactions = async () => {
    try {
      const expenseResponse = await fetch(`${API_BASE_URL}/expense/user/${logindata.ValidUserOne._id}`, { headers: authHeaders() });
      const incomeResponse = await fetch(`${API_BASE_URL}/income/user/${logindata.ValidUserOne._id}`, { headers: authHeaders() });

      const expenseData = await expenseResponse.json();
      const incomeData = await incomeResponse.json();
      const isInPeriod = (dateStr) => {
        const d = new Date(dateStr);
        return d.getMonth() + 1 === selectedMonth && d.getFullYear() === selectedYear;
      };

      const expensesThisMonth = expenseData.filter((exp) => isInPeriod(exp.date));
      const incomeThisMonth = incomeData.filter((inc) => isInPeriod(inc.date));

      // Calculate previous month data for comparison
      const prevMonth = selectedMonth === 1 ? 12 : selectedMonth - 1;
      const prevYear = selectedMonth === 1 ? selectedYear - 1 : selectedYear;
      const isPrevPeriod = (dateStr) => {
        const d = new Date(dateStr);
        return d.getMonth() + 1 === prevMonth && d.getFullYear() === prevYear;
      };

      const expensesPrevMonth = expenseData.filter((exp) => isPrevPeriod(exp.date));
      const incomePrevMonth = incomeData.filter((inc) => isPrevPeriod(inc.date));

      const prevMonthStats = {
        totalExpense: expensesPrevMonth.reduce((sum, e) => sum + e.amount, 0),
        totalIncome: incomePrevMonth.reduce((sum, i) => sum + i.amount, 0),
      };
      prevMonthStats.totalSavings = prevMonthStats.totalIncome - prevMonthStats.totalExpense;

      const totalExpense = expensesThisMonth.reduce((sum, expense) => sum + expense.amount, 0);
      const totalIncome = incomeThisMonth.reduce((sum, income) => sum + income.amount, 0);
      const totalBalance = totalIncome - totalExpense;
      
      setExpensesThisMonth(expensesThisMonth);
      setIncomeThisMonth(incomeThisMonth);
      setPrevMonthData(prevMonthStats);

      // Detect anomalies in expenses
      const detectedAnomalies = detectAnomalies([...expensesThisMonth], 2);
      setAnomalies(detectedAnomalies);

      const weekly = Array.from({ length: 5 }, (_, idx) => ({
        week: `Week ${idx + 1}`,
        expenses: 0,
        income: 0,
        savings: 0,
      }));

      expensesThisMonth.forEach((exp) => {
        const d = new Date(exp.date);
        const weekIndex = Math.min(4, Math.floor((d.getDate() - 1) / 7));
        weekly[weekIndex].expenses += exp.amount;
      });

      incomeThisMonth.forEach((inc) => {
        const d = new Date(inc.date);
        const weekIndex = Math.min(4, Math.floor((d.getDate() - 1) / 7));
        weekly[weekIndex].income += inc.amount;
      });

      const enrichedWeekly = weekly.map((row) => ({
        ...row,
        savings: row.income - row.expenses,
      }));

      const nonEmptyWeeks = enrichedWeekly.filter((row) => row.expenses > 0 || row.income > 0);

      const categoryTotals = expensesThisMonth.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
      }, {});

      const categoryArray = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));

      setChartData(nonEmptyWeeks);
      setCategoryData(categoryArray);
      setWeeklyData(enrichedWeekly);
      setTotalIncome(totalIncome);
      setTotalExpense(totalExpense);
      setTotalBalance(totalBalance);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };


  useEffect(() => {
    AnalysisValid();
  }, [AnalysisValid]);

  useEffect(() => {
    if (!logindata?.ValidUserOne) return;
    allTransactions();
  }, [logindata?.ValidUserOne, selectedMonth, selectedYear, allTransactions]);

  const monthLabel = useMemo(
    () => new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long' }),
    [selectedMonth, selectedYear]
  );

  const handleDownloadSummary = () => {
    exportMonthlySummary(incomeThisMonth, expensesThisMonth, [], monthLabel, selectedYear);
  };

  return (
    <ExpenseAnalysis
      data={chartData}
      totalIncome={totalIncome}
      totalExpense={totalExpense}
      totalBalance={totalBalance}
      monthLabel={monthLabel}
      selectedYear={selectedYear}
      categoryData={categoryData}
      weeklyData={weeklyData}
      onDownloadSummary={handleDownloadSummary}
      prevMonthData={prevMonthData}
      anomalies={anomalies}
    />
  );
};

export default Analysis;

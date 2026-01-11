import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import "./Dashboard.css";
import { NavLink } from "react-router-dom";
import { PieChart, Pie, Cell, Legend } from "recharts";
import { DateContext, LoginContext } from "../Context/Context";
import { ToastContext } from "../Toast/ToastProvider";
import { exportMonthlySummary } from "../../utils/exportUtils";
// Auth is bootstrapped by AuthProvider; remove inline validation
import { addExpense as addExpenseApi } from "../../api/expenseApi";
import { addIncome as addIncomeApi } from "../../api/incomeApi";
import { getHealthScore as getHealthScoreApi } from "../../api/healthApi";
import { API_BASE_URL } from "../../api/api";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: localStorage.getItem("usersdatatoken") || "",
});

const Dashboard = () => {
  const getToday = () => new Date().toISOString().split("T")[0];
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(getToday);
  const [accountType, setAccountType] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [category, setCategory] = useState("");
  const [editId, setEditId] = useState(null);
  // Removed unused transfer states to tidy warnings
  const [selectedForm, setSelectedForm] = useState("Expense");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [healthScore, setHealthScore] = useState(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const quickAddRef = useRef(null);
  const descriptionRef = useRef(null);

  // Removed navigate usage; routing handled elsewhere

  const { logindata } = useContext(LoginContext);
  const { showToast } = useContext(ToastContext);
  const { selectedMonth, selectedYear } = useContext(DateContext);

  const monthLabel = useMemo(() => {
    const names = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return names[selectedMonth - 1] || "";
  }, [selectedMonth]);

  const validateForm = () => {
    const newErrors = {};
    if (!category) newErrors.category = "Category is required";
    if (!description) newErrors.description = "Description is required";
    if (!amount || amount <= 0) newErrors.amount = "Valid amount is required";
    if (!date) newErrors.date = "Date is required";
    if (!accountType) newErrors.accountType = "Account type is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // User validation is handled globally by AuthProvider

  const fetchHealthScore = React.useCallback(async () => {
    try {
      setHealthLoading(true);
      const data = await getHealthScoreApi(selectedMonth, selectedYear);
      if (data.status === 201) {
        setHealthScore(data);
      }
    } catch (err) {
      console.error("Error fetching health score:", err);
    } finally {
      setHealthLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  // Fetch health score when month/year changes
  useEffect(() => {
    if (logindata?.ValidUserOne?._id) {
      fetchHealthScore();
    }
  }, [fetchHealthScore, logindata?.ValidUserOne?._id]);

  const getStoredCategory = (formType) => {
    const key = formType === "Income" ? "lastIncomeCategory" : "lastExpenseCategory";
    return localStorage.getItem(key) || "";
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    const key = selectedForm === "Income" ? "lastIncomeCategory" : "lastExpenseCategory";
    if (value) {
      localStorage.setItem(key, value);
    }
  };

  useEffect(() => {
    const stored = getStoredCategory(selectedForm);
    if (!editId) {
      setCategory(stored);
    }
  }, [selectedForm, editId]);

  const resetForm = (formType = selectedForm) => {
    setDescription("");
    setAmount("");
    setDate(getToday());
    setAccountType("");
    setCategory(getStoredCategory(formType));
    setEditId(null);
    setErrors({});
  };

  const addExpense = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    setSubmitting(true);

    if (editId !== null) {
      // Edit existing expense
      const updatedTransactions = transactions.map((t) =>
        t.id === editId
          ? {
              ...t,
              description,
              amount,
              date,
              accountType,
              category,
              type: "Expense",
            }
          : t
      );
      setTransactions(updatedTransactions);
      setEditId(null);
      showToast("Expense updated","success");
      setSubmitting(false);
    } else {
      // Add new expense
      if (description && amount && date && accountType && category) {
        try {
          const payload = {
            category,
            amount: parseFloat(amount),
            description,
            date,
            account: accountType,
            user: logindata?.ValidUserOne?._id,
          };
          console.log("Adding expense with payload:", payload);
          const result = await addExpenseApi(payload);
          if (result?.error) throw new Error(result.error || "Failed to add expense");

          setTransactions([
            ...transactions,
            {
              id: result._id,
              description,
              amount,
              date,
              accountType,
              category,
              type: "Expense",
            },
          ]);
          resetForm();
          showToast("Expense added","success");
        } catch (err) {
          console.error("Error adding expense:", err);
          const errorMsg = err?.error || err?.message || "Error adding expense";
          showToast(errorMsg, "error");
        } finally {
          setSubmitting(false);
        }
      } else {
        setSubmitting(false);
      }
    }
  };

  const addIncome = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    setSubmitting(true);

    if (editId !== null) {
      // Edit existing income
      const updatedTransactions = transactions.map((t) =>
        t.id === editId
          ? {
              ...t,
              description,
              amount,
              date,
              accountType,
              category,
              type: "Income",
            }
          : t
      );
      setTransactions(updatedTransactions);
      setEditId(null);
      showToast("Income updated","success");
      setSubmitting(false);
    } else {
      // Add new income
      if (description && amount && date && accountType && category) {
        try {
          const payload = {
            category,
            amount: parseFloat(amount),
            description,
            date,
            account: accountType,
            user: logindata?.ValidUserOne?._id,
          };
          console.log("Adding income with payload:", payload);
          const result = await addIncomeApi(payload);
          if (result?.error) throw new Error(result.error || "Failed to add income");

          setTransactions([
            ...transactions,
            {
              id: result._id,
              description,
              amount,
              date,
              accountType,
              category,
              type: "Income",
            },
          ]);
          resetForm();
          showToast("Income added","success");
        } catch (err) {
          console.error("Error adding income:", err);
          const errorMsg = err?.error || err?.message || "Error adding income";
          showToast(errorMsg, "error");
        } finally {
          setSubmitting(false);
        }
      } else {
        setSubmitting(false);
      }
    }
  };

  // Add data from database
  const [accountBalances, setAccountBalances] = useState([
    { accountType: "Savings", difference: 0 },
    { accountType: "Cash", difference: 0 },
    { accountType: "Card", difference: 0 },
    { accountType: "Miscellaneous", difference: 0 },
  ]);

  const accExp = React.useCallback(async () => {
    try {
      const userId = logindata?.ValidUserOne?._id;
      if (!userId) return;

      const updatedAccountData = await Promise.all(
        accountBalances.map(async (entry) => {
          const { accountType: acc } = entry;

          const expenseResponse = await fetch(
            `${API_BASE_URL}/expense/useracc/${userId}/${acc}`,
            {
              method: "GET",
              headers: authHeaders(),
            }
          );
          const expenseData = await expenseResponse.json();
          const totalExpense = expenseData
            .filter((expense) => {
              const d = new Date(expense.date);
              return (
                d.getMonth() + 1 === selectedMonth && d.getFullYear() === selectedYear
              );
            })
            .reduce((sum, expense) => sum + expense.amount, 0);

          const incomeResponse = await fetch(
            `${API_BASE_URL}/income/useracc/${userId}/${acc}`,
            {
              method: "GET",
              headers: authHeaders(),
            }
          );
          const incomeData = await incomeResponse.json();
          const totalIncome = incomeData
            .filter((income) => {
              const d = new Date(income.date);
              return (
                d.getMonth() + 1 === selectedMonth && d.getFullYear() === selectedYear
              );
            })
            .reduce((sum, income) => sum + income.amount, 0);

          const difference = totalIncome - totalExpense;

          return {
            ...entry,
            accountType: acc,
            totalExpense,
            totalIncome,
            difference,
          };
        })
      );

      setAccountBalances(updatedAccountData);
    } catch (error) {
      console.error(error);
    }
  }, [selectedMonth, selectedYear, logindata?.ValidUserOne?._id, accountBalances]);

  useEffect(() => {
    accExp();
  }, [accExp]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [categoryInsights, setCategoryInsights] = useState({
    topCategory: null,
    highestExpenseDay: null,
    avgDailySpend: 0,
  });
  const [allExpenseData, setAllExpenseData] = useState([]);
  const [allIncomeData, setAllIncomeData] = useState([]);

  const allTransactions = React.useCallback(async () => {
    try {
      const userId = logindata?.ValidUserOne?._id;
      if (!userId) {
        setInitialLoading(false);
        return;
      }

      const expenseResponse = await fetch(
        `${API_BASE_URL}/expense/user/${userId}`,
        { headers: authHeaders() }
      );
      const incomeResponse = await fetch(
        `${API_BASE_URL}/income/user/${userId}`,
        { headers: authHeaders() }
      );

      const expenseData = await expenseResponse.json();
      const incomeData = await incomeResponse.json();

      setAllExpenseData(expenseData);
      setAllIncomeData(incomeData);

      const isInPeriod = (dateStr) => {
        const d = new Date(dateStr);
        return d.getMonth() + 1 === selectedMonth && d.getFullYear() === selectedYear;
      };

      const filteredExpenses = expenseData.filter((exp) => isInPeriod(exp.date));
      const filteredIncome = incomeData.filter((inc) => isInPeriod(inc.date));

      const totalExpense = filteredExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );
      const totalIncome = filteredIncome.reduce(
        (sum, income) => sum + income.amount,
        0
      );
      const totalBalance = totalIncome - totalExpense;

      const allTrans = [
        ...filteredExpenses.map(exp => ({
          _id: exp._id,
          description: exp.description,
          amount: exp.amount,
          date: exp.date,
          accountType: exp.account,
          category: exp.category,
          type: 'expense'
        })),
        ...filteredIncome.map(inc => ({
          _id: inc._id,
          description: inc.description,
          amount: inc.amount,
          date: inc.date,
          accountType: inc.account,
          category: inc.category,
          type: 'income'
        }))
      ];

      const sortedTransactions = allTrans.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

      setRecentTransactions(sortedTransactions);
      setTotalIncome(totalIncome);
      setTotalExpense(totalExpense);
      setTotalBalance(totalBalance);

      // Calculate category intelligence
      const categoryTotals = {};
      const dailyTotals = {};
      
      filteredExpenses.forEach((exp) => {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
        const dateKey = new Date(exp.date).toLocaleDateString('en-IN');
        dailyTotals[dateKey] = (dailyTotals[dateKey] || 0) + exp.amount;
      });

      const topCategory = Object.keys(categoryTotals).length > 0
        ? Object.entries(categoryTotals).reduce((a, b) => (a[1] > b[1] ? a : b))
        : null;

      const highestDay = Object.keys(dailyTotals).length > 0
        ? Object.entries(dailyTotals).reduce((a, b) => (a[1] > b[1] ? a : b))
        : null;

      const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
      const avgDaily = totalExpense / daysInMonth;

      setCategoryInsights({
        topCategory: topCategory ? { name: topCategory[0], amount: topCategory[1] } : null,
        highestExpenseDay: highestDay ? { date: highestDay[0], amount: highestDay[1] } : null,
        avgDailySpend: avgDaily,
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      showToast("Failed to load dashboard data","error");
    } finally {
      setInitialLoading(false);
    }
  }, [logindata?.ValidUserOne?._id, selectedMonth, selectedYear, showToast]);

  useEffect(() => {
    if (!logindata?.ValidUserOne?._id) return;
    setInitialLoading(true);
    allTransactions();
  }, [allTransactions, logindata?.ValidUserOne?._id]);

  const accountData = accountBalances.map((balance) => ({
    name: balance.accountType,
    value: balance.difference,
  }));

  const handleExportSummary = () => {
    const isInPeriod = (dateStr) => {
      const d = new Date(dateStr);
      return d.getMonth() + 1 === selectedMonth && d.getFullYear() === selectedYear;
    };
    const filteredExpenses = allExpenseData.filter((exp) => isInPeriod(exp.date));
    const filteredIncome = allIncomeData.filter((inc) => isInPeriod(inc.date));
    
    exportMonthlySummary(filteredIncome, filteredExpenses, accountBalances, monthLabel, selectedYear);
    showToast("Monthly summary exported", "success");
  };

  return (
    <div className="dash">
      <div className="dashboard-container">
        
        {/* ROW 1: KPI CARDS */}
        <div className="kpi-row">
          {accountBalances.map((balance) => (
            <div className="overview-box" key={balance.accountType}>
              <h2>{balance.accountType}</h2>
              <ul>
                <li>₹{balance.difference}</li>
              </ul>
            </div>
          ))}
          <div className="overview-box">
            <h2>Total Balance</h2>
            <ul>
              <li>
                ₹{accountBalances
                  .map((balance) => balance.difference)
                  .reduce((total, balance) => total + balance, 0)}
              </li>
            </ul>
          </div>
        </div>

        {/* HEALTH SCORE CARD */}
        <div className="health-score-card">
          {healthLoading ? (
            <div style={{ textAlign: "center", padding: "20px", color: "#6b7280" }}>
              Loading financial health...
            </div>
          ) : healthScore ? (
            <div className={`health-card-content health-${healthScore.statusClass}`}>
              <div className="health-header">
                <div className="health-title-section">
                  <span className="health-title">Financial Health</span>
                  <span 
                    className="info-icon" 
                    title="Calculated using Income vs Expenses, Savings Rate, Budget Adherence, and Spending Consistency"
                    role="img"
                    aria-label="Information"
                  >
                    ℹ️
                  </span>
                </div>
                <span className={`health-badge health-${healthScore.statusClass}`}>
                  {healthScore.status}
                </span>
              </div>

              <div className="health-score-section">
                <h2 className="health-score-number">
                  {healthScore.score}<span>/100</span>
                </h2>
                <progress 
                  className="health-progress" 
                  value={healthScore.score} 
                  max="100"
                ></progress>
              </div>

              <div className="health-insights">
                <strong className="insights-title">💡 How to improve:</strong>
                <ul className="insights-list">
                  {healthScore.insights && healthScore.insights.map((insight, idx) => (
                    <li key={idx}>{insight}</li>
                  ))}
                </ul>
              </div>

              <div className="health-breakdown">
                <div className="breakdown-item">
                  <span className="breakdown-label">Income</span>
                  <span className="breakdown-value">₹{(healthScore.breakdown?.totalIncome || 0).toFixed(0)}</span>
                </div>
                <div className="breakdown-item">
                  <span className="breakdown-label">Expenses</span>
                  <span className="breakdown-value">₹{(healthScore.breakdown?.totalExpenses || 0).toFixed(0)}</span>
                </div>
                <div className="breakdown-item">
                  <span className="breakdown-label">Savings</span>
                  <span className="breakdown-value">₹{(healthScore.breakdown?.savings || 0).toFixed(0)}</span>
                </div>
                <div className="breakdown-item">
                  <span className="breakdown-label">Rate</span>
                  <span className="breakdown-value">{(healthScore.breakdown?.savingsRate || 0).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="health-empty-state">
              <h3>No Financial Data Yet</h3>
              <p>Your financial health score will improve as you add:</p>
              <ul className="empty-state-list">
                <li>💰 Income records</li>
                <li>💸 Expense transactions</li>
                <li>📊 Monthly budgets</li>
              </ul>
              <div className="empty-state-cta">
                <NavLink to="/transaction" className="btn btn-primary">
                  Add Transactions
                </NavLink>
                <NavLink to="/budget" className="btn btn-secondary">
                  Set Budgets
                </NavLink>
              </div>
            </div>
          )}
        </div>

        {/* ROW 2: CHARTS & SUMMARY */}
        <div className="charts-row">
          <div className="piechart">
            <h2>Account Overview</h2>
            <PieChart width={360} height={220}>
              <Pie
                data={accountData}
                cx={150}
                cy={85}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {accountData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend
                iconSize={10}
                iconType="circle"
                layout="vertical"
                verticalAlign="middle"
                align="right"
              />
            </PieChart>
          </div>

          <div className="total">
            <h2>Financial Summary</h2>
            <p className="summary-period">{monthLabel} {selectedYear}</p>
            <p>
              <span>Total Income</span>
              <strong className="income">₹{totalIncome}</strong>
            </p>
            <p>
              <span>Total Expense</span>
              <strong className="expense">₹{totalExpense}</strong>
            </p>
            <p>
              <span>Total Savings</span>
              <strong className="savings">₹{totalBalance}</strong>
            </p>
            <button className="btn export-btn" onClick={handleExportSummary} title="Export monthly summary to CSV">
              📊 Export Summary
            </button>
          </div>
        </div>

        {/* ROW 2.5: CATEGORY INTELLIGENCE */}
        {!initialLoading && categoryInsights.topCategory && (
          <div className="insights-cards">
            <div className="insight-card">
              <div className="insight-icon">📊</div>
              <div className="insight-content">
                <div className="insight-label">Top Spending Category</div>
                <div className="insight-value">{categoryInsights.topCategory.name}</div>
                <div className="insight-meta">₹{categoryInsights.topCategory.amount.toFixed(0)} this month</div>
              </div>
            </div>
            <div className="insight-card">
              <div className="insight-icon">📅</div>
              <div className="insight-content">
                <div className="insight-label">Highest Expense Day</div>
                <div className="insight-value">{categoryInsights.highestExpenseDay?.date || 'N/A'}</div>
                <div className="insight-meta">₹{categoryInsights.highestExpenseDay?.amount.toFixed(0) || 0} spent</div>
              </div>
            </div>
            <div className="insight-card">
              <div className="insight-icon">💰</div>
              <div className="insight-content">
                <div className="insight-label">Average Daily Spend</div>
                <div className="insight-value">₹{categoryInsights.avgDailySpend.toFixed(0)}</div>
                <div className="insight-meta">Based on {monthLabel}</div>
              </div>
            </div>
          </div>
        )}

        {/* ROW 3: QUICK ADD */}

        <div className="form_datas" ref={quickAddRef}>
          <div className="form_headings">
            <h2>Quick Add</h2>
            <div className="form-segments">
              <button
                className={`Form-button ${
                  selectedForm === "Expense" ? "selected" : ""
                }`}
                onClick={() => {
                  setSelectedForm("Expense");
                  setEditId(null);
                }}
              >
                Expense
              </button>
              <button
                className={`Form-button ${
                  selectedForm === "Income" ? "selected" : ""
                }`}
                onClick={() => {
                  setSelectedForm("Income");
                  setEditId(null);
                }}
              >
                Income
              </button>
            </div>
            <form
              onSubmit={selectedForm === "Expense" ? addExpense : addIncome}
            >
              <div className="form_inputs">
                {selectedForm === "Expense" && (
                  <>
                    <h2>Expense</h2>
                    <label htmlFor="category">Category</label>
                    <div className="two">
                      <select
                        value={category}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                      >
                        <option value="">Select Category</option>
                        <option value="Baby">Baby</option>
                        <option value="Baby">Baby</option>
                        <option value="Beauty">Bills</option>
                        <option value="Car">Car</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Education">Education</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Food">Food</option>
                        <option value="Health">Health</option>
                        <option value="Home">Home</option>
                        <option value="Insurance">Insurance</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Social">Social</option>
                        <option value="Sport">Sport</option>
                        <option value="Tax">Tax</option>
                        <option value="Telephone">Telephone</option>
                        <option value="Transportation">Transportation</option>
                      </select>
                      {errors.category && <p className="field-error">⚠ {errors.category}</p>}
                    </div>
                  </>
                )}
                {selectedForm === "Income" && (
                  <>
                    <h2>Income</h2>
                    <label htmlFor="category">Category</label>
                    <div className="two">
                      <select
                        value={category}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                      >
                        <option value="">Select Category</option>
                        <option value="Awards">Awards</option>
                        <option value="Coupons">Coupons</option>
                        <option value="Grants">Grants</option>
                        <option value="Lottery">Lottery</option>
                        <option value="Refunds">Refunds</option>
                        <option value="Rental">Rental</option>
                        <option value="Salary">Salary</option>
                        <option value="Sale">Sale</option>
                      </select>
                      {errors.category && <p className="field-error">⚠ {errors.category}</p>}
                    </div>
                  </>
                )}
                <label htmlFor="description">Description</label>
                <div className="two">
                  <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    ref={descriptionRef}
                  />
                </div>
                {errors.description && <p className="field-error">⚠ {errors.description}</p>}
                <label htmlFor="amount">Amount</label>
                <div className="two">
                  <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                {errors.amount && <p className="field-error">⚠ {errors.amount}</p>}
                <label htmlFor="date">Date</label>
                <div className="two">
                  <input
                    type="date"
                    placeholder="Date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                {errors.date && <p className="field-error">⚠ {errors.date}</p>}
                <label htmlFor="accountType">Account Type</label>
                <div className="two">
                  <select
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                  >
                    <option value="">Select Account Type</option>
                    <option value="Savings">Savings</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                  </select>
                </div>
                {errors.accountType && <p className="field-error">⚠ {errors.accountType}</p>}
                <button className="btn" type="submit" disabled={submitting}>
                  {submitting ? "Submitting…" : editId !== null ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ROW 4: RECENT TRANSACTIONS (FULL WIDTH) */}
        <div className="table_box">
          <h2>Recent Transactions</h2>
          {initialLoading ? (
            <div className="table-skeleton" aria-hidden="true">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="skeleton skeleton-row" />
              ))}
            </div>
          ) : (
            <table className="table_fill">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Account</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((t) => (
                    <tr key={t._id}>
                      <td>{t.description}</td>
                      <td>{t.category}</td>
                      <td className={`amount ${t.type === 'expense' ? 'negative' : 'positive'}`}>
                        {t.type === 'expense' ? '-' : '+'}₹{t.amount}
                      </td>
                      <td>{new Date(t.date).toLocaleDateString('en-IN')}</td>
                      <td>{t.accountType}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">
                      <div className="empty-state">
                        <p>You haven’t added any transactions yet. Start by adding your first expense below 👇</p>
                        <button type="button" className="btn ghost-btn" onClick={() => {
                          setSelectedForm("Expense");
                          resetForm("Expense");
                          if (quickAddRef.current) {
                            quickAddRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
                          }
                          descriptionRef.current?.focus();
                        }}>
                          Add First Expense
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Floating Quick Add Button */}
      <button 
        className="floating-quick-add" 
        onClick={() => {
          if (quickAddRef.current) {
            quickAddRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
          }
          descriptionRef.current?.focus();
        }}
        title="Quick Add Transaction"
      >
        <span className="fab-icon">+</span>
      </button>
    </div>
  );
};

export default Dashboard;

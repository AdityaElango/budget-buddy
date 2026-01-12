import React, { useState,useEffect, useContext, useMemo, useRef } from "react";
import { PieChart, Pie,  Legend ,Cell} from "recharts";
import "./Accounts.css";
import { useNavigate } from "react-router-dom";
import { DateContext, LoginContext } from "../Context/Context";
import { ToastContext } from "../Toast/ToastProvider";
import { API_BASE_URL } from "../../api/api";
import EmptyState from "../Common/EmptyState";

const Accounts = () => {
  const history = useNavigate();

  const { logindata, setLoginData } = useContext(LoginContext);
  const { showToast } = useContext(ToastContext);
  const { selectedMonth, selectedYear } = useContext(DateContext);
  const monthLabel = useMemo(() => {
    const names = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    return names[selectedMonth - 1] || "";
  }, [selectedMonth]);
  console.log(logindata);

  const [accountType, setAccountType] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.accountName.trim()) newErrors.accountName = "Account name is required";
    if (!formData.amount || formData.amount <= 0) newErrors.amount = "Amount must be greater than 0";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const AccountValid = async () => {
    let token = localStorage.getItem("usersdatatoken");

    const res = await fetch(`${API_BASE_URL}/validuser`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
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

  useEffect(() => {
    if (!logindata?.ValidUserOne) {
      AccountValid();
    }
  }, [logindata?.ValidUserOne]);


  const [formData, setFormData] = useState({
    accountName: "",
    amount: "",
  });

  

  
  const [accountBalances, setAccountBalances] = useState([
    { accountType: "Savings", difference: 0, prevDifference: 0 },
    { accountType: "Cash", difference: 0, prevDifference: 0 },
    { accountType: "Card", difference: 0, prevDifference: 0 },
    { accountType: "Miscellaneous", difference: 0, prevDifference: 0 },
  ]);
 
  const accExp = async () => {
    try {
      const userId = logindata?.ValidUserOne?._id;
      if (!userId) return;
      const token = localStorage.getItem("usersdatatoken");
      const prevMonth = selectedMonth === 1 ? 12 : selectedMonth - 1;
      const prevYear = selectedMonth === 1 ? selectedYear - 1 : selectedYear;
      const updatedAccountData = await Promise.all(
        accountBalances.map(async (entry) => {
          const { accountType: acc } = entry;
  
          // Fetch expenses
          const expenseResponse = await fetch(
            `${API_BASE_URL}/expense/useracc/${userId}/${acc}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
            }
          );
          const expenseData = await expenseResponse.json();
          const isInPeriod = (d, month, year) => d.getMonth() + 1 === month && d.getFullYear() === year;
          const totalExpense = expenseData
            .filter((expense) => isInPeriod(new Date(expense.date), selectedMonth, selectedYear))
            .reduce((sum, expense) => sum + expense.amount, 0);
          const prevExpense = expenseData
            .filter((expense) => isInPeriod(new Date(expense.date), prevMonth, prevYear))
            .reduce((sum, expense) => sum + expense.amount, 0);
  
          // Fetch income
          const incomeResponse = await fetch(
            `${API_BASE_URL}/income/useracc/${userId}/${acc}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
            }
          );
          const incomeData = await incomeResponse.json();
          const totalIncome = incomeData
            .filter((income) => isInPeriod(new Date(income.date), selectedMonth, selectedYear))
            .reduce((sum, income) => sum + income.amount, 0);
          const prevIncome = incomeData
            .filter((income) => isInPeriod(new Date(income.date), prevMonth, prevYear))
            .reduce((sum, income) => sum + income.amount, 0);
  
          // Calculate the difference between income and expenses
          const difference = totalIncome - totalExpense;
          const prevDifference = prevIncome - prevExpense;
  
          // Return an updated entry with the totalExpense, totalIncome, difference, and accountType
          return {
            ...entry,
            accountType: acc,
            totalExpense,
            totalIncome,
            difference,
            prevDifference,
          };
        })
      );
  
      // Now updatedAccountData contains the totalExpense, totalIncome, difference, and accountType for each entry
      console.log(updatedAccountData);
  
      // You can use this updated data as needed in your component
      setAccountBalances(updatedAccountData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    accExp();
  }, [selectedMonth, selectedYear]);

  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [selectedAccountType, setSelectedAccountType] = useState("");
  const [transactions, setTransactions] = useState([]);


  const fetchTransactions = async (accountType) => {
    try {
      const expenseResponse = await fetch(
        `${API_BASE_URL}/expense/useracc/${logindata.ValidUserOne._id}/${accountType}`
      );
      const expenseData = await expenseResponse.json();
  
      const incomeResponse = await fetch(
        `${API_BASE_URL}/income/useracc/${logindata.ValidUserOne._id}/${accountType}`
      );
      const incomeData = await incomeResponse.json();
  
      // Combine expense and income data into a single array with a new "type" property
      const combinedTransactions = [
        ...expenseData
          .filter((expense) => {
            const d = new Date(expense.date);
            return d.getMonth() + 1 === selectedMonth && d.getFullYear() === selectedYear;
          })
          .map((expense) => ({
            ...expense,
            type: "Expense",
            formattedDate: new Date(expense.date).toLocaleDateString(),
          })),
        ...incomeData
          .filter((income) => {
            const d = new Date(income.date);
            return d.getMonth() + 1 === selectedMonth && d.getFullYear() === selectedYear;
          })
          .map((income) => ({
            ...income,
            type: "Income",
            formattedDate: new Date(income.date).toLocaleDateString(),
          })),
      ];
  
      setTransactions(combinedTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "accountName") {
      setSelectedAccountType(value);
    }
  };

  const handleAddAmount = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      await fetchTransactions(selectedAccountType || formData.accountName);
      setFormData({ accountName: "", amount: "" });
      showToast("Account view updated successfully", "success");
    } catch (error) {
      showToast(error.message || "Error updating account", "error");
    } finally {
      setLoading(false);
    }
  };



  const totalBalance = accountBalances.reduce((sum, acc) => sum + acc.difference, 0);
  const accountData = accountBalances.map((balance) => ({
    name: balance.accountType,
    value: balance.difference,
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
 

  return (
    <div className="main_c">
      {/* Top: Overview (read-only) */}
      <div className="accounts-top-row">
        <div className="balances-section">
          <div className="section-header">
            <h2 className="section-title">Account Overview</h2>
            <p className="section-subtitle">{monthLabel} {selectedYear}</p>
          </div>
          <div className="balance-grid">
            {accountBalances.map((balance, index) => {
              const percent = totalBalance ? Math.round((balance.difference / totalBalance) * 100) : 0;
              const delta = balance.prevDifference === 0 ? null : ((balance.difference - balance.prevDifference) / Math.abs(balance.prevDifference)) * 100;
              const trendLabel = delta === null ? "No prior data" : `${delta >= 0 ? "↑" : "↓"} ${Math.abs(delta).toFixed(0)}% MoM`;
              const trendClass = delta === null ? "neutral" : delta >= 0 ? "up" : "down";
              return (
                <div key={index} className="balance-item">
                  <span className="balance-label">{balance.accountType}</span>
                  <span className="balance-value">₹{balance.difference}</span>
                  <div className="balance-meta">
                    <span className="pill">{percent}% of total</span>
                    <span className={`trend ${trendClass}`}>{trendLabel}</span>
                  </div>
                </div>
              );
            })}
            <div className="balance-item total-balance">
              <span className="balance-label">Total Balance</span>
              <span className="balance-value">₹{totalBalance}</span>
            </div>
          </div>
        </div>
        <div className="overview-section">
          <h2 className="section-title">Balance Split</h2>
          <div className="piechart">
            {accountData.filter(acc => acc.value > 0).length > 0 ? (
              <PieChart width={280} height={250}>
                <Pie
                  data={accountData.filter(acc => acc.value > 0)}
                  cx={140}
                  cy={125}
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {accountData.filter(acc => acc.value > 0).map((entry, index) => (
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
            ) : (
              <div className="empty-state">
                <p style={{ fontSize: '32px', margin: '0 0 8px 0' }}>📊</p>
                <p style={{ margin: '4px 0' }}>No account distribution yet.</p>
                <p style={{ margin: '4px 0' }}>Add funds to see your breakdown.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="transactions-section">
        <h2 className="section-title">Recent Transactions</h2>
        <p className="section-subtitle">{monthLabel} {selectedYear}</p>
        <div className="table_box">
          {transactions.length > 0 ? (
            <table className="table_fill">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="row">
                    <td className="text-left">{transaction.description}</td>
                    <td className={`text-left amount ${transaction.type === 'expense' ? 'negative' : 'positive'}`}>
                      {transaction.type === 'expense' ? '-' : '+'}₹{transaction.amount}
                    </td>
                    <td className="text-left">{transaction.date}</td>
                    <td className="text-left">{transaction.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState
              title="No transactions yet"
              description="Start by adding your first expense or income to see account insights here."
              actionLabel="+ Add Transaction"
              onAction={() => {
                formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              illustration="*"
            />
          )}
        </div>
      </div>

      {/* Setup Section */}
      <div className="form-section" ref={formRef}>
        <div className="form_datas">
          <h2>Update Balances</h2>
          <p className="section-subtitle">Adjust which account to view and refresh numbers.</p>
          <form onSubmit={handleAddAmount}>
            <div className="form_inputs">
              <label htmlFor="accountName">Account Type</label>
              <div className="two">
                <select
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleInputChange}
                >
                  <option value="">Select Account Type</option>
                  <option value="Cash">Cash</option>
                  <option value="Savings">Savings</option>
                  <option value="Card">Card</option>
                  <option value="Miscellaneous">Miscellaneous</option>
                </select>
                 {errors.accountName && <p className="field-error">⚠ {errors.accountName}</p>}
              </div>
              <button className="btn" type="submit" disabled={loading}>
                {loading ? "Updating…" : "Update Balance"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Accounts;

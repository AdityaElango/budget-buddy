import React, { useState, useEffect,  useContext  } from "react";
import "./Budget.css"; // Import your custom CSS file
import { useNavigate } from "react-router-dom";
import { DateContext, LoginContext } from "../Context/Context";
import { API_BASE_URL } from "../../api/api";
import { ToastContext } from "../Toast/ToastProvider";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("usersdatatoken") || ""}`,
});

const getProgressBarVariant = (amount, max) => {
  const ratio = amount / max;
  if (ratio < 0.7) return "primary";
  if (ratio < 0.9) return "warning";
  if (ratio <= 1) return "danger";
  return "over";
};

const Budget = () => {

  const { logindata, setLoginData } = useContext(LoginContext);
  const { showToast } = useContext(ToastContext);
  const { selectedMonth, selectedYear } = useContext(DateContext);
  const history = useNavigate();

  const [formData, setFormData] = useState({
    category: "",
    gray: true,
    budget: "",
  });

  const [error, setError] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [enteredBudgets, setEnteredBudgets] = useState([]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.budget || formData.budget <= 0) newErrors.budget = "Budget must be greater than 0";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const BudgetValid = async () => {
    let token = localStorage.getItem("usersdatatoken");

    const res = await fetch(`${API_BASE_URL}/validuser`, {
      method: "GET",
      headers: authHeaders(),
    });

    const data = await res.json();
    console.log(data);

    if (data.status === 401 || !data.ValidUserOne) {
      history("/login");
    } else {
      setLoginData(data);
    }
  };

  const fetchBudgets = async () => {
    try {
      const userId = logindata?.ValidUserOne?._id;
      if (!userId) return;

      const budgetsResponse = await fetch(`${API_BASE_URL}/budget/user/${userId}`, { headers: authHeaders() });
      const budgets = await budgetsResponse.json();
      
      const expensesResponse = await fetch(`${API_BASE_URL}/expense/user/${userId}`, { headers: authHeaders() });
      const expenses = await expensesResponse.json();

      const updatedBudgets = budgets.map((budget) => {
        const totalExpense = expenses
          .filter((expense) => {
            const d = new Date(expense.date);
            return (
              expense.category === budget.category &&
              d.getMonth() + 1 === selectedMonth &&
              d.getFullYear() === selectedYear
            );
          })
          .reduce((sum, expense) => sum + expense.amount, 0);
        
        return {
          ...budget,
          expense: totalExpense,
        };
      });

      const uniqueCategories = new Set(updatedBudgets.map((budget) => budget.category));
      const filteredBudgets = updatedBudgets.filter((budget) => uniqueCategories.has(budget.category));

      setEnteredBudgets(filteredBudgets);
    } catch (error) {
      console.error("Error fetching budgets and expenses:", error);
      showToast("Failed to load budgets","error");
    }
  };

  useEffect(() => {
    BudgetValid();
    fetchBudgets();
  }, [selectedMonth, selectedYear]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const deleteBudget = async (budgetId, index) => {
    if (!budgetId) {
      showToast("Cannot delete budget without ID", "error");
      return;
    }

    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this budget?");
      if (!confirmDelete) return;

      const response = await fetch(`${API_BASE_URL}/budget/${budgetId}`, {
        method: "DELETE",
        headers: authHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to delete budget");
      }

      // Remove from local state
      setEnteredBudgets((prevBudgets) => 
        prevBudgets.filter((_, i) => i !== index)
      );
      showToast("Budget deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting budget:", error);
      showToast(error.message || "Error deleting budget", "error");
    }
  };

  const handleSetBudget = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    const { category, budget } = formData;
    let expense = 0;

    if (enteredBudgets.some((entry) => entry.category === category)) {
        setLoading(false);
        showToast("Budget for this category already exists", "error");
      return;
    }

    const existingBudgetIndex = enteredBudgets.findIndex(
      (entry) => entry.category === category
    );
  
    if (existingBudgetIndex !== -1) {
      // Update the existing budget entry
      const updatedBudgets = [...enteredBudgets];
      updatedBudgets[existingBudgetIndex] = {
        ...enteredBudgets[existingBudgetIndex],
        budget: parseFloat(budget),
      };
      setEnteredBudgets(updatedBudgets);
    } else {
      // Add a new budget entry
      try{
        const allexpense = await fetch(`${API_BASE_URL}/expense/user/${logindata.ValidUserOne._id}/${category}`, {
          method: "GET",
          headers: authHeaders(),
        });
        const all = await allexpense.json();
        const totalExpense = all
          .filter((expense) => {
            const d = new Date(expense.date);
            return (
              d.getMonth() + 1 === selectedMonth && d.getFullYear() === selectedYear
            );
          })
          .reduce((sum, expense) => sum + expense.amount, 0);
        expense = totalExpense
      }
      catch(error)
      {
        console.log(error)
      }
       
      const data = await fetch(`${API_BASE_URL}/budget`, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({
            category,
            budget,
            expense,
            user: logindata.ValidUserOne._id,
          }),
        });
        const result = await data.json();
        console.log(result)
      const newBudget = {
        category,
        budget: parseFloat(budget),
        gray: true, // Assuming you want to set this to true by default
        // You might want to initialize expense based on actual data
        expense,
      };

      
      setEnteredBudgets((prevBudgets) => [...prevBudgets, newBudget]);
    }

    fetchBudgets();
    showToast("Budget saved","success");
  
    // Clear the form after setting the budget
    setFormData({
      category: "",
      gray: true,
      budget: "",
    });
  };

  return (
    <div className="container">
      {/* LEFT COLUMN - Set Budget Form (30%) */}
      <div className="set_budget">
        <div className="heading">
          <h1>Monthly Budget</h1>
          <p>Set monthly budget limits for categories</p>
        </div>

        <div className="set-budget-card">
          <form onSubmit={handleSetBudget}>
            <div className="form_inputs">
              <label htmlFor="category">Category</label>
              <div className="two">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="">Select Category</option>
                  <option value="Baby">Baby</option>
                  <option value="Bills">Bills</option>
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

              <label htmlFor="budget">Monthly Budget</label>
              <div className="two">
                <input
                  name="budget"
                  type="number"
                  placeholder="₹ Amount"
                  value={formData.budget}
                  onChange={handleInputChange}
                />
                {errors.budget && <p className="field-error">⚠ {errors.budget}</p>}
              </div>
            </div>

            {error && <div className="error_msg">{error}</div>}

            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Saving…" : "Save Monthly Budget"}
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT COLUMN - Budget Overview (70%) */}
      <div className="budget">
        <div className="heading">
          <h1>Budget Overview</h1>
          <p>Track spending vs. budget limits</p>
        </div>

        {enteredBudgets.length > 0 ? (
          <div className="budget-list">
            {enteredBudgets.map((budgetEntry, index) => {
              const percentUsed = (budgetEntry.expense / budgetEntry.budget) * 100;
              const isOver = budgetEntry.expense > budgetEntry.budget;
              const overBy = isOver ? budgetEntry.expense - budgetEntry.budget : 0;
              
              let statusClass = "healthy";
              let statusText = "Safe";
              if (percentUsed >= 70 && percentUsed < 90) {
                statusClass = "warning";
                statusText = "⚠ Approaching budget limit";
              } else if (percentUsed >= 90 && percentUsed <= 100) {
                statusClass = "danger";
                statusText = "⚠ Nearing limit";
              } else if (percentUsed > 100) {
                statusClass = "exceeded";
                statusText = `🚨 Budget exceeded by ₹${overBy.toFixed(0)}`;
              }

              return (
                <div key={index} className={`card ${budgetEntry.gray ? "bg-light" : ""}`}>
                  <div className="card-body">
                    <div className="card-title">
                      <div className="name">{budgetEntry.category}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="amount">
                          <strong>₹{budgetEntry.expense.toFixed(0)}</strong>
                          <span className="text-muted">/ ₹{budgetEntry.budget}</span>
                        </div>
                        <span className={`status-badge ${statusClass}`}>{statusText}</span>
                        <button
                          onClick={() => deleteBudget(budgetEntry._id, index)}
                          className="delete-btn"
                          title="Delete budget"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#dc3545',
                            cursor: 'pointer',
                            fontSize: '18px',
                            padding: '0',
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="progress-bar">
                      <div
                        className={`progress ${getProgressBarVariant(
                          budgetEntry.expense,
                          budgetEntry.budget
                        )}`}
                        style={{
                          width: `${Math.min(percentUsed, 100)}%`,
                        }}
                      ></div>
                    </div>

                    {/* Percentage Used */}
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {percentUsed.toFixed(0)}% used
                    </div>
                    <div className="budget-hint">{statusText}</div>

                    {isOver && (
                      <div className="budget-alert">
                        <div className="alert-icon">⚠</div>
                        <div className="alert-copy">
                          <div className="alert-title">
                            You’ve exceeded your {budgetEntry.category} budget by ₹{overBy.toFixed(0)}
                          </div>
                          <div className="alert-sub">Review expenses or adjust this budget.</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <p>📊</p>
            <p>No budgets set yet.</p>
            <p>Start by setting a monthly budget for a category.</p>
            <button className="btn" type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              Add a budget
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Budget;

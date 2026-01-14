import React, { useState, useEffect, useContext, useMemo } from "react";
import "./Recurring.css";
import { LoginContext } from "../Context/Context";
import { ToastContext } from "../Toast/ToastProvider";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../api/api";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("usersdatatoken") || ""}`,
});

const Recurring = () => {
  const { logindata, setLoginData } = useContext(LoginContext);
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();

  const [recurringList, setRecurringList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    accountType: "",
    frequency: "monthly",
    dayOfMonth: 1,
    type: "expense",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    validateUser();
    fetchRecurring();
  }, []);

  const validateUser = async () => {
    let token = localStorage.getItem("usersdatatoken");
    const res = await fetch(`${API_BASE_URL}/validuser`, {
      method: "GET",
      headers: authHeaders(),
    });

    const data = await res.json();
    if (data.status === 401 || !data.ValidUserOne) {
      navigate("/login");
    } else {
      setLoginData(data);
    }
  };

  const fetchRecurring = async () => {
    try {
      const userId = logindata?.ValidUserOne?._id;
      if (!userId) return;

      const response = await fetch(
        `${API_BASE_URL}/recurring/user/${userId}`,
        {
          headers: authHeaders(),
        }
      );
      const data = await response.json();
      setRecurringList(data);
    } catch (error) {
      console.error("Error fetching recurring transactions:", error);
    }
  };

  const ordinal = (day) => {
    const j = day % 10;
    const k = day % 100;
    if (j === 1 && k !== 11) return `${day}st`;
    if (j === 2 && k !== 12) return `${day}nd`;
    if (j === 3 && k !== 13) return `${day}rd`;
    return `${day}th`;
  };

  const formatNextRunDate = (day) => {
    const today = new Date();
    const currentMonthTarget = new Date(today.getFullYear(), today.getMonth(), day);
    const nextDate = currentMonthTarget <= today
      ? new Date(today.getFullYear(), today.getMonth() + 1, day)
      : currentMonthTarget;
    return nextDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const previewCopy = useMemo(() => {
    if (!formData.amount || !formData.dayOfMonth) return "";
    const amount = Number(formData.amount).toLocaleString("en-IN");
    const dayLabel = ordinal(formData.dayOfMonth);
    return `This will add ₹${amount} every month on the ${dayLabel}. Next run: ${formatNextRunDate(
      formData.dayOfMonth
    )}`;
  }, [formData.amount, formData.dayOfMonth]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.amount || formData.amount <= 0)
      newErrors.amount = "Valid amount required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.accountType)
      newErrors.accountType = "Account type is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/recurring`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          ...formData,
          user: logindata.ValidUserOne._id,
        }),
      });

      if (!response.ok) throw new Error("Failed to add recurring transaction");

      showToast("Recurring transaction added", "success");
      setFormData({
        description: "",
        amount: "",
        category: "",
        accountType: "",
        frequency: "monthly",
        dayOfMonth: 1,
        type: "expense",
      });
      fetchRecurring();
    } catch (error) {
      showToast(error.message || "Error adding recurring transaction", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/recurring/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!response.ok) throw new Error("Failed to delete");
      showToast("Recurring transaction deleted", "success");
      fetchRecurring();
    } catch (error) {
      showToast(error.message || "Error deleting", "error");
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/recurring/${id}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to update");
      }
      
      showToast(
        currentStatus ? "Transaction paused" : "Transaction resumed",
        "success"
      );
      fetchRecurring();
    } catch (error) {
      console.error("Toggle error:", error);
      showToast(error.message || "Error updating status", "error");
    }
  };

  return (
    <div className="recurring-container">
      <div className="recurring-form-section">
        <div className="heading">
          <h1>Recurring Transactions</h1>
          <p>Automate monthly rent, subscriptions, and EMIs</p>
        </div>

        <form onSubmit={handleSubmit} className="recurring-form">
          <div className="form-row">
            <label>Type</label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div className="form-row">
            <label>Category</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="">Select Category</option>
              {formData.type === "expense" ? (
                <>
                  <option value="Rent">Rent</option>
                  <option value="EMI">EMI</option>
                  <option value="Subscription">Subscription</option>
                  <option value="Bills">Bills</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Education">Education</option>
                </>
              ) : (
                <>
                  <option value="Salary">Salary</option>
                  <option value="Rental">Rental Income</option>
                  <option value="Investment">Investment Returns</option>
                </>
              )}
            </select>
            {errors.category && (
              <p className="field-error">⚠ {errors.category}</p>
            )}
          </div>

          <div className="form-row">
            <label>Description</label>
            <input
              type="text"
              placeholder="e.g., Netflix Subscription"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            {errors.description && (
              <p className="field-error">⚠ {errors.description}</p>
            )}
          </div>

          <div className="form-row">
            <label>Amount</label>
            <input
              type="number"
              placeholder="₹ Amount"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
            />
            {errors.amount && <p className="field-error">⚠ {errors.amount}</p>}
          </div>

          <div className="form-row">
            <label>Account</label>
            <select
              value={formData.accountType}
              onChange={(e) =>
                setFormData({ ...formData, accountType: e.target.value })
              }
            >
              <option value="">Select Account</option>
              <option value="Savings">Savings</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </select>
            {errors.accountType && (
              <p className="field-error">⚠ {errors.accountType}</p>
            )}
          </div>

          <div className="form-row">
            <label>Day of Month</label>
            <input
              type="number"
              min="1"
              max="31"
              value={formData.dayOfMonth}
              onChange={(e) =>
                setFormData({ ...formData, dayOfMonth: Number(e.target.value) })
              }
            />
          </div>

          {previewCopy && <div className="preview-box">{previewCopy}</div>}

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Adding…" : "Add Recurring Transaction"}
          </button>
        </form>
      </div>

      <div className="recurring-list-section">
          <div className="heading">
          <h2>Active Recurring Transactions</h2>
          <p>{recurringList.filter((r) => r.isActive).length} active</p>
        </div>

        {recurringList.length > 0 ? (
          <div className="recurring-cards">
            {recurringList.map((item) => (
              <div
                key={item._id}
                className={`recurring-card ${!item.isActive ? "inactive" : ""}`}
              >
                <div className="card-header">
                  <div className="card-title">
                    <span className="category-badge">{item.category}</span>
                    <span className={`type-badge ${item.type}`}>
                      {item.type}
                    </span>
                  </div>
                  <div className="card-actions">
                    <button
                      className="toggle-btn"
                      onClick={() =>
                        handleToggleActive(item._id, item.isActive)
                      }
                      title={item.isActive ? "Pause" : "Resume"}
                    >
                      {item.isActive ? "⏸" : "▶"}
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(item._id)}
                      title="Delete"
                    >
                      🗑
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="description">{item.description}</div>
                  <div className="amount">₹{item.amount}</div>
                  <div className="meta">
                    <span>🏦 {item.accountType}</span>
                    <span>📅 Day {item.dayOfMonth}</span>
                    <span>⏭ Next: {formatNextRunDate(item.dayOfMonth)}</span>
                    <span>
                      {item.isActive ? "🟢 Active" : "⚫ Paused"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>📆</p>
            <p>No recurring transactions yet.</p>
            <p>Add monthly rent, subscriptions, or EMIs to automate tracking.</p>
            <button className="btn" type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Add recurring transaction</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recurring;

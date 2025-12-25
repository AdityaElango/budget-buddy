import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DateContext, LoginContext } from "../Context/Context";
import { ToastContext } from "../Toast/ToastProvider";
import { exportTransactions } from "../../utils/exportUtils";
import { API_BASE_URL } from "../../api/api";
import "./transaction.css";

const API_BASE = API_BASE_URL;

const mapExpense = (item) => ({
  id: item._id,
  description: item.description,
  amount: item.amount,
  date: item.date?.slice(0, 10) || "",
  account: item.account,
  category: item.category,
  tags: item.tags || [],
  type: "Expense",
});

const mapIncome = (item) => ({
  id: item._id,
  description: item.description,
  amount: item.amount,
  date: item.date?.slice(0, 10) || "",
  account: item.account,
  category: item.category,
  tags: item.tags || [],
  type: "Income",
});
const categoryIcons = {
  Food: "🍔",
  Entertainment: "🎬",
  Transportation: "🚌",
  Shopping: "🛍️",
  Health: "💊",
  Home: "🏠",
  Education: "📚",
  Salary: "💼",
  Awards: "🏆",
  Lottery: "🎰",
  Refunds: "↩️",
  Rental: "🏘️",
  Sale: "💳",
  Coupons: "🎟️",
  Grants: "📜",
  Insurance: "🛡️",
  Tax: "🧾",
  Bills: "📑",
  Car: "🚗",
  Telephone: "📱",
  Sport: "⚽",
  Baby: "🍼",
  Social: "🤝",
  Miscellaneous: "🧭",
};

const Transaction = () => {
  const { logindata, setLoginData } = useContext(LoginContext);
  const { showToast } = useContext(ToastContext);
  const { selectedMonth, selectedYear } = useContext(DateContext);
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [accountType, setAccountType] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [selectedForm, setSelectedForm] = useState("Expense");
  const [submitting, setSubmitting] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const [categoryFilter, setCategoryFilter] = useState("All");
  const [accountFilter, setAccountFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkCategory, setBulkCategory] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const parseTags = (value) =>
    value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

  useEffect(() => {
    const validateUser = async () => {
      try {
        const token = localStorage.getItem("usersdatatoken");
        const res = await fetch(`${API_BASE}/validuser`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          credentials: "include",
        });
        const data = await res.json();

        if (data.status === 401 || !data.ValidUserOne) {
          navigate("/login");
        } else {
          setLoginData(data);
        }
      } catch (err) {
        showToast("Unable to validate user", "error");
        navigate("/login");
      }
    };

    validateUser();
  }, [navigate, setLoginData, showToast]);

  useEffect(() => {
    if (!logindata?.ValidUserOne?._id) return;

    setInitialLoading(true);

    const fetchExpenseAndIncome = async () => {
      try {
        const userId = logindata.ValidUserOne._id;
        const [expenseRes, incomeRes] = await Promise.all([
          fetch(`${API_BASE}/expense/user/${userId}`),
          fetch(`${API_BASE}/income/user/${userId}`),
        ]);

        const [expenses, incomes] = await Promise.all([
          expenseRes.json(),
          incomeRes.json(),
        ]);

        const normalized = [...expenses.map(mapExpense), ...incomes.map(mapIncome)].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setTransactions(normalized);
      } catch (error) {
        console.error("Error fetching expenses and incomes", error);
        showToast("Failed to load transactions", "error");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchExpenseAndIncome();
  }, [logindata?.ValidUserOne?._id, showToast]);

  const validateForm = () => {
    const newErrors = {};

    if (!description.trim()) newErrors.description = "Description is required";
    if (!amount || Number(amount) <= 0) newErrors.amount = "Amount must be greater than 0";
    if (!date) newErrors.date = "Date is required";
    if (!accountType) newErrors.accountType = "Account type is required";
    if (!category) newErrors.category = "Category is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const monthLabel = useMemo(() => {
    const monthNames = [
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
    return monthNames[selectedMonth - 1] || "";
  }, [selectedMonth]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const d = t.date ? new Date(t.date) : null;
      if (!d) return false;
      const matchesMonth = d.getMonth() + 1 === selectedMonth;
      const matchesYear = d.getFullYear() === selectedYear;
      if (!matchesMonth || !matchesYear) return false;

      const matchesCategory =
        categoryFilter === "All" || t.category === categoryFilter;
      const matchesAccount =
        accountFilter === "All" || t.account === accountFilter;
      const matchesSearch = t.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType = 
        typeFilter === "All" || t.type === typeFilter;
      const matchesMinAmount = 
        !minAmount || t.amount >= Number(minAmount);
      const matchesMaxAmount = 
        !maxAmount || t.amount <= Number(maxAmount);
      const matchesTag = 
        !tagFilter || (t.tags && t.tags.some(tag => tag.toLowerCase().includes(tagFilter.toLowerCase())));

      return matchesCategory && matchesAccount && matchesSearch && matchesType && matchesMinAmount && matchesMaxAmount && matchesTag;
    });
  }, [transactions, selectedMonth, selectedYear, categoryFilter, accountFilter, searchTerm, typeFilter, minAmount, maxAmount, tagFilter]);

  const hasAnyTransactions = transactions.length > 0;
  const allFilteredIds = filteredTransactions.map((t) => t.id);
  const isAllSelected = allFilteredIds.length > 0 && allFilteredIds.every((id) => selectedIds.includes(id));

  const resetForm = () => {
    setDescription("");
    setAmount("");
    setDate("");
    setAccountType("");
    setCategory("");
    setTags("");
    setErrors({});
  };

  const addExpense = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/expense`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category,
          amount,
          description,
          date,
          account: accountType,
          user: logindata?.ValidUserOne?._id,
          tags: parseTags(tags),
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to add expense");

      setTransactions((prev) => [...prev, mapExpense(result)]);
      resetForm();
      showToast("Expense added successfully", "success");
    } catch (error) {
      showToast(error.message || "Error adding expense", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const addIncome = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/income`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category,
          amount,
          description,
          date,
          account: accountType,
          user: logindata?.ValidUserOne?._id,
          tags: parseTags(tags),
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to add income");

      setTransactions((prev) => [...prev, mapIncome(result)]);
      resetForm();
      showToast("Income added successfully", "success");
    } catch (error) {
      showToast(error.message || "Error adding income", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteExpense = async (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    try {
      const res = await fetch(`${API_BASE}/expense/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete expense");
      showToast("Expense deleted", "success");
    } catch (error) {
      showToast(error.message || "Error deleting expense", "error");
    }
  };

  const deleteIncome = async (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    try {
      const res = await fetch(`${API_BASE}/income/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete income");
      showToast("Income deleted", "success");
    } catch (error) {
      showToast(error.message || "Error deleting income", "error");
    }
  };

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds((prev) => prev.filter((id) => !allFilteredIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...allFilteredIds])));
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const bulkDelete = async () => {
    if (selectedIds.length === 0) return;
    const toDelete = transactions.filter((t) => selectedIds.includes(t.id));
    setTransactions((prev) => prev.filter((t) => !selectedIds.includes(t.id)));
    setSelectedIds([]);
    try {
      await Promise.all(
        toDelete.map((t) =>
          fetch(`${API_BASE}/${t.type.toLowerCase()}/${t.id}`, {
            method: "DELETE",
          })
        )
      );
      showToast("Selected transactions deleted", "success");
    } catch (err) {
      showToast("Some deletions may have failed", "error");
    }
  };

  const bulkRecategorize = async () => {
    if (!bulkCategory || selectedIds.length === 0) return;
    const toUpdate = transactions.filter((t) => selectedIds.includes(t.id));
    setTransactions((prev) =>
      prev.map((t) => (selectedIds.includes(t.id) ? { ...t, category: bulkCategory } : t))
    );
    try {
      await Promise.all(
        toUpdate.map((t) =>
          fetch(`${API_BASE}/${t.type.toLowerCase()}/${t.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ category: bulkCategory }),
          })
        )
      );
      showToast("Recategorized selected transactions", "success");
    } catch (err) {
      showToast("Some updates may have failed", "error");
    }
  };

  return (
    <div className="main">
      <div className="table_data">
        <div className="table-meta">
          {initialLoading ? (
            <span>Loading transactions…</span>
          ) : (
            <>
              Showing {filteredTransactions.length} of {transactions.length} for {monthLabel} {selectedYear}
              {filteredTransactions.length > 0 && (
                <button
                  className="btn export-btn-compact"
                  onClick={() => {
                    exportTransactions(filteredTransactions, `${monthLabel}_${selectedYear}`);
                    showToast("Transactions exported", "success");
                  }}
                  title="Export filtered transactions to CSV"
                >
                  📥 Export
                </button>
              )}
            </>
          )}
        </div>

        {!initialLoading && (
          <div className="filters-section">
            <div className="filters-header">
              <button 
                className="toggle-filters-btn" 
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? '🔼' : '🔽'} {showFilters ? 'Hide' : 'Show'} Advanced Filters
              </button>
              {(categoryFilter !== "All" || accountFilter !== "All" || searchTerm || typeFilter !== "All" || minAmount || maxAmount || tagFilter) && (
                <button 
                  className="clear-filters-btn" 
                  onClick={() => {
                    setCategoryFilter("All");
                    setAccountFilter("All");
                    setSearchTerm("");
                    setTypeFilter("All");
                    setMinAmount("");
                    setMaxAmount("");
                    setTagFilter("");
                  }}
                >
                  ✕ Clear All Filters
                </button>
              )}
            </div>

            <div className={`filters-bar ${showFilters ? 'expanded' : ''}`}>
              <div className="filter-group search">
                <label>Search</label>
                <input
                  type="text"
                  placeholder="Search description"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="filter-group">
                <label>Type</label>
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                  <option value="All">All types</option>
                  <option value="Expense">Expenses</option>
                  <option value="Income">Income</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Category</label>
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                  <option value="All">All categories</option>
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
                  <option value="Awards">Awards</option>
                  <option value="Coupons">Coupons</option>
                  <option value="Grants">Grants</option>
                  <option value="Lottery">Lottery</option>
                  <option value="Refunds">Refunds</option>
                  <option value="Rental">Rental</option>
                  <option value="Salary">Salary</option>
                  <option value="Sale">Sale</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Account</label>
                <select value={accountFilter} onChange={(e) => setAccountFilter(e.target.value)}>
                  <option value="All">All accounts</option>
                  <option value="Savings">Savings</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Miscellaneous">Miscellaneous</option>
                </select>
              </div>

              {showFilters && (
                <>
                  <div className="filter-group">
                    <label>Min Amount</label>
                    <input
                      type="number"
                      placeholder="Minimum ₹"
                      value={minAmount}
                      onChange={(e) => setMinAmount(e.target.value)}
                      min="0"
                    />
                  </div>

                  <div className="filter-group">
                    <label>Max Amount</label>
                    <input
                      type="number"
                      placeholder="Maximum ₹"
                      value={maxAmount}
                      onChange={(e) => setMaxAmount(e.target.value)}
                      min="0"
                    />
                  </div>

                  <div className="filter-group">
                    <label>Tag</label>
                    <input
                      type="text"
                      placeholder="Filter by tag"
                      value={tagFilter}
                      onChange={(e) => setTagFilter(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {selectedIds.length > 0 && (
          <div className="bulk-bar">
            <div>{selectedIds.length} selected</div>
            <div className="bulk-actions">
              <select value={bulkCategory} onChange={(e) => setBulkCategory(e.target.value)}>
                <option value="">Recategorize to…</option>
                <option value="Food">Food</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Transportation">Transportation</option>
                <option value="Shopping">Shopping</option>
                <option value="Health">Health</option>
                <option value="Home">Home</option>
                <option value="Education">Education</option>
                <option value="Salary">Salary</option>
                <option value="Awards">Awards</option>
                <option value="Refunds">Refunds</option>
                <option value="Rental">Rental</option>
                <option value="Sale">Sale</option>
                <option value="Miscellaneous">Miscellaneous</option>
              </select>
              <button className="btn ghost" type="button" onClick={bulkRecategorize} disabled={!bulkCategory}>Recategorize</button>
              <button className="btn danger" type="button" onClick={bulkDelete}>Delete</button>
            </div>
          </div>
        )}

        {initialLoading ? (
          <div className="table-skeleton" aria-hidden="true">
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className="skeleton skeleton-row" />
            ))}
          </div>
        ) : filteredTransactions.length > 0 ? (
          <table className="table-fill">
            <thead>
              <tr>
                <th><input type="checkbox" checked={isAllSelected} onChange={toggleSelectAll} aria-label="Select all" /></th>
                <th>Description</th>
                <th>Category</th>
                <th>Date</th>
                <th>Account</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((t) => (
                <tr key={t.id} className="row">
                  <td className="text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(t.id)}
                      onChange={() => toggleSelect(t.id)}
                      aria-label="Select row"
                    />
                  </td>
                  <td className="text-left txn-desc">
                    <span className="txn-icon">{categoryIcons[t.category] || "🧾"}</span>
                    <div className="txn-stack">
                      <span className="txn-title">{t.description}</span>
                      <span className="txn-sub">{t.account}</span>
                      {t.tags?.length ? (
                        <div className="tag-row">
                          {t.tags.map((tag) => (
                            <span key={tag} className="tag-chip">#{tag}</span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </td>
                  <td className="text-left">{t.category}</td>
                  <td className="text-left">{t.date}</td>
                  <td className="text-left"><span className={`pill subtle ${t.type === "Expense" ? "pill-expense" : "pill-income"}`}>{t.type}</span></td>
                  <td className={`text-right amount ${t.type === "Expense" ? "expense" : "income"}`}>
                    {t.type === "Expense" ? "-" : "+"}₹{t.amount}
                  </td>
                  <td className="text-left">
                    <button
                      className="deletebutton"
                      onClick={() => {
                        if (t.type === "Expense") deleteExpense(t.id);
                        else deleteIncome(t.id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <p>📄</p>
            {hasAnyTransactions ? (
              <>
                <p>No transactions match your filters.</p>
                <p>Try adjusting filters or search.</p>
              </>
            ) : (
              <>
                <p>No transactions yet.</p>
                <p>Add your first transaction to see it here.</p>
              </>
            )}
          </div>
        )}
      </div>

      <div className="form_sheet">
        <div className="form_header">
          <div>
            <h1>Add Transaction</h1>
            <p>Record expense or income without leaving the list.</p>
          </div>
                    <button className="btn ghost" onClick={() => setShowForm((v) => !v)}>
                      {showForm ? "Hide" : "Add Transaction"}
          </button>
        </div>

        {showForm && (
          <div className="form_datas inline">
            {initialLoading ? (
              <div className="add-transaction-card skeleton-stack" aria-hidden="true">
                <div className="skeleton skeleton-line skeleton-lg" style={{ width: "40%" }} />
                      <p>Try adjusting filters or search.</p>
                      <button className="btn" type="button" onClick={() => setShowForm(true)}>Add Transaction</button>
                <div className="skeleton skeleton-line skeleton-md" style={{ width: "100%", height: "120px" }} />
              </div>
            ) : (
              <>
                      <p>Add your first transaction to see it here.</p>
                      <button className="btn" type="button" onClick={() => setShowForm(true)}>Add Transaction</button>
                  <button
                    className={`Form-button ${selectedForm === "Expense" ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedForm("Expense");
                      resetForm();
                    }}
                  >
                    Expense
                  </button>
                  <button
                    className={`Form-button ${selectedForm === "Income" ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedForm("Income");
                      resetForm();
                    }}
                  >
                    Income
                  </button>

                <div className="add-transaction-card">
                  <h2>{selectedForm}</h2>
                  <form onSubmit={selectedForm === "Expense" ? addExpense : addIncome}>
                    <div className="form_inputs">
                      <div className="field-row">
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <label>Category</label>
                          <select value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="">Select Category</option>
                            {selectedForm === "Expense" && (
                              <>
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
                              </>
                            )}
                            {selectedForm === "Income" && (
                              <>
                                <option value="Awards">Awards</option>
                                <option value="Coupons">Coupons</option>
                                <option value="Grants">Grants</option>
                                <option value="Lottery">Lottery</option>
                                <option value="Refunds">Refunds</option>
                                <option value="Rental">Rental</option>
                                <option value="Salary">Salary</option>
                                <option value="Sale">Sale</option>
                              </>
                            )}
                          </select>
                          {errors.category && <p className="field-error">⚠ {errors.category}</p>}
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <label>Account Type</label>
                          <select value={accountType} onChange={(e) => setAccountType(e.target.value)}>
                            <option value="">Select Account</option>
                            <option value="Savings">Savings</option>
                            <option value="Cash">Cash</option>
                            <option value="Card">Card</option>
                                  <option value="Miscellaneous">Miscellaneous</option>
                          </select>
                          {errors.accountType && <p className="field-error">⚠ {errors.accountType}</p>}
                        </div>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <label>Description</label>
                        <input
                          type="text"
                          placeholder="What was this for?"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                        {errors.description && <p className="field-error">⚠ {errors.description}</p>}
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <label>Tags (comma separated)</label>
                        <input
                          type="text"
                          placeholder="#travel, #emergency"
                          value={tags}
                          onChange={(e) => setTags(e.target.value)}
                        />
                      </div>

                      <div className="field-row">
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <label>Amount</label>
                          <input
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                          />
                          {errors.amount && <p className="field-error">⚠ {errors.amount}</p>}
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <label>Date</label>
                          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                          {errors.date && <p className="field-error">⚠ {errors.date}</p>}
                        </div>
                      </div>

                      <button className="btn" type="submit" disabled={submitting}>
                        {submitting ? "Submitting…" : "Add Transaction"}
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Transaction;

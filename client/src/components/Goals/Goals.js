import React, { useEffect, useMemo, useState } from "react";
import "./Goals.css";
import { useNavigate } from "react-router-dom";
import { DateContext, LoginContext } from "../Context/Context";
import { API_BASE_URL } from "../../api/api";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("usersdatatoken") || ""}`,
});

const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const Goals = () => {
  const navigate = useNavigate();
  const { logindata } = React.useContext(LoginContext);
  const { selectedMonth, selectedYear } = React.useContext(DateContext);

  const [goals, setGoals] = useState([]);
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [saved, setSaved] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!logindata?.ValidUserOne) {
      navigate("/login");
    }
  }, [logindata, navigate]);

  const fetchGoals = async () => {
    if (!logindata?.ValidUserOne?._id) return;
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/goal/user/${logindata.ValidUserOne._id}`,
        {
          method: "GET",
          headers: authHeaders(),
        }
      );
      const data = await response.json();
      setGoals(data);
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [logindata?.ValidUserOne?._id]);

  const resetForm = () => {
    setName("");
    setTargetAmount("");
    setDeadline("");
    setSaved("");
    setErrors({});
  };

  const validate = () => {
    const next = {};
    if (!name.trim()) next.name = "Goal name is required";
    if (!targetAmount || Number(targetAmount) <= 0) next.targetAmount = "Target must be greater than 0";
    if (!deadline) next.deadline = "Pick a deadline";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const addGoal = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/goal`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          name: name.trim(),
          targetAmount: Number(targetAmount),
          savedAmount: saved ? Number(saved) : 0,
          deadline,
          user: logindata.ValidUserOne._id,
        }),
      });
      
      if (!response.ok) throw new Error("Failed to add goal");
      
      await fetchGoals();
      resetForm();
    } catch (error) {
      console.error("Error adding goal:", error);
      setErrors({ submit: "Failed to add goal" });
    } finally {
      setLoading(false);
    }
  };

  const updateSaved = async (goalId, currentSaved, delta) => {
    const newSaved = Math.max(0, currentSaved + delta);
    
    try {
      const goal = goals.find(g => g._id === goalId);
      const response = await fetch(`${API_BASE_URL}/goal/${goalId}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({
          ...goal,
          savedAmount: newSaved,
          completed: newSaved >= goal.targetAmount,
        }),
      });
      
      if (!response.ok) throw new Error("Failed to update goal");
      
      await fetchGoals();
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  const deleteGoal = async (goalId) => {
    if (!window.confirm("Are you sure you want to delete this goal?")) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/goal/${goalId}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      
      if (!response.ok) throw new Error("Failed to delete goal");
      
      await fetchGoals();
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  const sortedGoals = useMemo(
    () => [...goals].sort((a, b) => new Date(a.deadline) - new Date(b.deadline)),
    [goals]
  );

  return (
    <div className="goals-page">
      <header className="goals-header">
        <div>
          <p className="eyebrow">Savings goals</p>
          <h1>Stay on track for {new Date(selectedYear, selectedMonth - 1).toLocaleString("default", { month: "long", year: "numeric" })}</h1>
          <p className="muted">Set goals, track progress, and see deadlines at a glance.</p>
        </div>
      </header>

      <div className="goals-grid">
        <div className="card goals-form">
          <h2>Create a goal</h2>
          <form onSubmit={addGoal} className="form-stack">
            <label>
              Name
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Emergency fund" />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </label>
            <label>
              Target amount
              <input type="number" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} placeholder="50000" />
              {errors.targetAmount && <span className="error-text">{errors.targetAmount}</span>}
            </label>
            <label>
              Deadline
              <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
              {errors.deadline && <span className="error-text">{errors.deadline}</span>}
            </label>
            <label>
              Saved so far (optional)
              <input type="number" value={saved} onChange={(e) => setSaved(e.target.value)} placeholder="10000" />
            </label>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Adding..." : "Add goal"}
            </button>
          </form>
        </div>

        <div className="goals-list">
          {sortedGoals.length === 0 ? (
            <div className="empty-state card">
              <p>🎯</p>
              <p>No goals yet. Create your first one.</p>
            </div>
          ) : (
            sortedGoals.map((goal) => {
              const progress = Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100));
              const remaining = Math.max(0, goal.targetAmount - goal.savedAmount);
              return (
                <div key={goal._id} className="card goal-card">
                  <div className="goal-header">
                    <div>
                      <h3>{goal.name}</h3>
                      <p className="muted">Deadline: {formatDate(goal.deadline)}</p>
                    </div>
                    <button className="ghost" type="button" onClick={() => deleteGoal(goal._id)}>Delete</button>
                  </div>
                  <div className="progress-wrap">
                    <div className="progress-bar" aria-valuemin={0} aria-valuemax={goal.targetAmount} aria-valuenow={goal.savedAmount}>
                      <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="progress-meta">
                      <span>₹{goal.savedAmount.toLocaleString()} saved</span>
                      <span>{progress}% of ₹{goal.targetAmount.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="goal-actions">
                    <button type="button" className="ghost" onClick={() => updateSaved(goal._id, goal.savedAmount, 1000)}>+1k</button>
                    <button type="button" className="ghost" onClick={() => updateSaved(goal._id, goal.savedAmount, 5000)}>+5k</button>
                    <button type="button" className="ghost" onClick={() => updateSaved(goal._id, goal.savedAmount, -1000)}>-1k</button>
                    <span className="muted">Remaining: ₹{remaining.toLocaleString()}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Goals;

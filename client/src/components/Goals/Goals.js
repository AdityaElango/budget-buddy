import React, { useEffect, useMemo, useState } from "react";
import "./Goals.css";
import { useNavigate } from "react-router-dom";
import { DateContext, LoginContext } from "../Context/Context";

const STORAGE_KEY = "budgetbuddy_goals";

const loadGoals = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveGoals = (goals) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
};

const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const Goals = () => {
  const navigate = useNavigate();
  const { logindata } = React.useContext(LoginContext);
  const { selectedMonth, selectedYear } = React.useContext(DateContext);

  const [goals, setGoals] = useState(loadGoals);
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [saved, setSaved] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    saveGoals(goals);
  }, [goals]);

  useEffect(() => {
    if (!logindata?.ValidUserOne) {
      navigate("/login");
    }
  }, [logindata, navigate]);

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

  const addGoal = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const goal = {
      id: crypto.randomUUID(),
      name: name.trim(),
      target: Number(targetAmount),
      saved: saved ? Number(saved) : 0,
      deadline,
      createdAt: new Date().toISOString(),
    };
    setGoals((prev) => [...prev, goal]);
    resetForm();
  };

  const updateSaved = (id, delta) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, saved: Math.max(0, g.saved + delta) } : g))
    );
  };

  const deleteGoal = (id) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
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
            <button type="submit" className="btn">Add goal</button>
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
              const progress = Math.min(100, Math.round((goal.saved / goal.target) * 100));
              const remaining = Math.max(0, goal.target - goal.saved);
              return (
                <div key={goal.id} className="card goal-card">
                  <div className="goal-header">
                    <div>
                      <h3>{goal.name}</h3>
                      <p className="muted">Deadline: {formatDate(goal.deadline)}</p>
                    </div>
                    <button className="ghost" type="button" onClick={() => deleteGoal(goal.id)}>Delete</button>
                  </div>
                  <div className="progress-wrap">
                    <div className="progress-bar" aria-valuemin={0} aria-valuemax={goal.target} aria-valuenow={goal.saved}>
                      <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="progress-meta">
                      <span>₹{goal.saved.toLocaleString()} saved</span>
                      <span>{progress}% of ₹{goal.target.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="goal-actions">
                    <button type="button" className="ghost" onClick={() => updateSaved(goal.id, 1000)}>+1k</button>
                    <button type="button" className="ghost" onClick={() => updateSaved(goal.id, 5000)}>+5k</button>
                    <button type="button" className="ghost" onClick={() => updateSaved(goal.id, -1000)}>-1k</button>
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

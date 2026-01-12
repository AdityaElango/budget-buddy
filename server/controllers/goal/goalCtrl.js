const expressAsyncHandler = require("express-async-handler");
const Goal = require("../../models/goalSchema");

// Create goal
const createGoalCtrl = expressAsyncHandler(async (req, res) => {
  const { name, targetAmount, savedAmount, deadline, user } = req.body;
  
  if (!name || !targetAmount || !deadline || !user) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  
  if (typeof targetAmount !== 'number' || targetAmount <= 0) {
    return res.status(400).json({ error: "Invalid target amount" });
  }

  try {
    const goal = await Goal.create({
      name,
      targetAmount,
      savedAmount: savedAmount || 0,
      deadline,
      user,
      completed: false,
    });
    res.json(goal);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error creating goal' });
  }
});

// Fetch all goals for a user
const fetchUserGoalsCtrl = expressAsyncHandler(async (req, res) => {
  const { userid } = req.params;
  
  try {
    const goals = await Goal.find({ user: userid }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update goal
const updateGoalCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, targetAmount, savedAmount, deadline, completed } = req.body;

  try {
    const goal = await Goal.findByIdAndUpdate(
      id,
      {
        name,
        targetAmount,
        savedAmount,
        deadline,
        completed,
      },
      { new: true }
    );
    res.json(goal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete goal
const deleteGoalCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  
  try {
    const goal = await Goal.findByIdAndDelete(id);
    res.json(goal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = {
  createGoalCtrl,
  fetchUserGoalsCtrl,
  updateGoalCtrl,
  deleteGoalCtrl,
};

const recurringModel = require("../../models/recurringSchema");

// Get all recurring transactions for a user
exports.getAllRecurring = async (req, res) => {
  try {
    const { userId } = req.params;
    const recurring = await recurringModel.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(recurring);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new recurring transaction
exports.createRecurring = async (req, res) => {
  try {
    const { description, amount, category, accountType, type, frequency, dayOfMonth, user } = req.body;

    const newRecurring = new recurringModel({
      description,
      amount,
      category,
      accountType,
      type,
      frequency: frequency || "monthly",
      dayOfMonth: dayOfMonth || 1,
      user,
    });

    await newRecurring.save();
    res.status(201).json(newRecurring);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update recurring transaction status
exports.updateRecurring = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const updated = await recurringModel.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Recurring transaction not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete recurring transaction
exports.deleteRecurring = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await recurringModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Recurring transaction not found" });
    }

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

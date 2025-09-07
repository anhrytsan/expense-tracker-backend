import ExpenseType from "../models/expenseType.model.js";

export const getAllExpenseTypes = async (req, res) => {
  try {
    const expenseTypes = await ExpenseType.find();
    res.status(200).json(expenseTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createExpenseType = async (req, res) => {
  try {
    const { name, description, limit } = req.body;

    const newExpenseType = await ExpenseType.create({
      name,
      description,
      limit,
    });
    res.status(201).json(newExpenseType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateExpenseType = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedExpenseType = await ExpenseType.findByIdAndUpdate(
      id,
      req.body,
      { new: true } // Return the updated document
    );
    if (!updatedExpenseType) {
      return res.status(404).json({ message: "Тип витрат не знайдено" });
    }
    res.status(200).json(updatedExpenseType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteExpenseType = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedExpenseType = await ExpenseType.findByIdAndDelete(id);
    if (!deletedExpenseType) {
      return res.status(404).json({ message: "Тип витрат не знайдено" });
    }
    res.status(204).send(); // 204 No Content
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

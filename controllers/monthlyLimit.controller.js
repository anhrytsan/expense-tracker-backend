import mongoose from "mongoose";
import MonthlyLimit from "../models/monthlyLimit.model.js";
import Expense from "../models/expense.model.js"; // <-- 1. Імпортуємо модель Expense

export const setMonthlyLimit = async (req, res) => {
  try {
    const { department, year, month, limitAmount } = req.body;

    const existingLimit = await MonthlyLimit.findOne({
      department,
      year,
      month,
    });

    if (existingLimit) {
      existingLimit.limitAmount = limitAmount;
      await existingLimit.save();
      return res.status(200).json(existingLimit);
    } else {
      // --- НОВИЙ БЛОК: Розраховуємо вже витрачену суму ---
      // 2. Рахуємо суму витрат за цей період
      const expensesInMonth = await Expense.aggregate([
        {
          $match: {
            department: mongoose.Types.ObjectId.createFromHexString(
              String(department)
            ),
            $expr: {
              $and: [
                { $eq: [{ $year: "$date" }, year] },
                { $eq: [{ $month: "$date" }, month] },
              ],
            },
          },
        },
        {
          $group: {
            _id: null,
            totalSpent: { $sum: "$amount" },
          },
        },
      ]);

      const spentAmount =
        expensesInMonth.length > 0 ? expensesInMonth[0].totalSpent : 0;

      // 3. Створюємо новий ліміт з уже розрахованою сумою
      const newLimit = await MonthlyLimit.create({
        department,
        year,
        month,
        limitAmount,
        spentAmount, // <-- Передаємо розраховану суму
      });
      return res.status(201).json(newLimit);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ... решта коду без змін ...

export const getMonthlyLimits = async (req, res) => {
  try {
    let limits = await MonthlyLimit.find()
      .populate("department", "name")
      .sort({ year: -1, month: -1 });

    // Filter limits to exclude those with null department
    limits = limits.filter((limit) => limit.department !== null);

    res.status(200).json(limits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMonthlyLimit = async (req, res) => {
  try {
    const { id } = req.params;
    const { limitAmount } = req.body; // Update only limit amount

    const updatedLimit = await MonthlyLimit.findByIdAndUpdate(
      id,
      { limitAmount },
      { new: true } // Return the updated document
    );

    if (!updatedLimit) {
      return res.status(404).json({ message: "Ліміт не знайдено" });
    }
    res.status(200).json(updatedLimit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteMonthlyLimit = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLimit = await MonthlyLimit.findByIdAndDelete(id);

    if (!deletedLimit) {
      return res.status(404).json({ message: "Ліміт не знайдено" });
    }
    res.status(204).send(); // 204 No Content
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

import MonthlyLimit from "../models/monthlyLimit.model.js";
import Expense from "../models/expense.model.js";

export const getDashboardSummary = async (req, res) => {
  try {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // Місяці в JS від 0 до 11

    // 1. Отримуємо загальну суму лімітів та витрат за поточний місяць
    const currentMonthTotals = await MonthlyLimit.aggregate([
      { $match: { year, month } },
      {
        $group: {
          _id: null,
          totalLimit: { $sum: "$limitAmount" },
          totalSpent: { $sum: "$spentAmount" },
        },
      },
    ]);

    // 2. Розраховуємо загальний залишок з попередніх місяців (carryover)
    const previousLimitsData = await MonthlyLimit.aggregate([
      {
        $match: {
          $or: [{ year: { $lt: year } }, { year: year, month: { $lt: month } }],
        },
      },
      {
        $group: {
          _id: null,
          totalCarryover: {
            $sum: { $subtract: ["$limitAmount", "$spentAmount"] },
          },
        },
      },
    ]);

    const totalCarryover =
      previousLimitsData.length > 0 ? previousLimitsData[0].totalCarryover : 0;

    const summaryData = currentMonthTotals[0] || {
      totalLimit: 0,
      totalSpent: 0,
    };

    // 3. Додаємо залишок до ліміту поточного місяця, щоб отримати ефективний ліміт
    const totalEffectiveLimit = summaryData.totalLimit + totalCarryover;

    // 4. Отримуємо ліміти та витрати для кожного відділу окремо
    let departmentLimits = await MonthlyLimit.find({ year, month }).populate(
      "department",
      "name"
    );

    // Фільтруємо результати, щоб видалити записи з неіснуючими відділами
    departmentLimits = departmentLimits.filter(
      (limit) => limit.department !== null
    );

    // 5. Отримуємо останні 5 транзакцій
    const recentExpenses = await Expense.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("department", "name")
      .populate("employee", "name")
      .populate("expenseType", "name");

    res.status(200).json({
      summary: {
        totalLimit: totalEffectiveLimit, // <-- Повертаємо правильний ефективний ліміт
        totalSpent: summaryData.totalSpent,
      },
      byDepartment: departmentLimits,
      recentExpenses,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Помилка на сервері", error: error.message });
  }
};

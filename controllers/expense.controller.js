import mongoose from "mongoose";
import Expense from "../models/expense.model.js";
import MonthlyLimit from "../models/monthlyLimit.model.js";
import ExpenseType from "../models/expenseType.model.js";
import Employee from "../models/employee.model.js"; // <-- Додай цей імпорт

// Effective Limit = (Current Month's Limit) + (All Unspent Money from All Previous Months).
export const createExpense = async (req, res) => {
  try {
    const { amount, date, expenseType, employee, department } = req.body;

    const typeOfExpense = await ExpenseType.findById(expenseType);

    if (!typeOfExpense) {
      return res.status(404).json({ message: "Такий вид витрат не знайдено" });
    }

    if (amount > typeOfExpense.limit) {
      return res.status(400).json({
        message: `Перевищено ліміт для однієї транзакції цього типу!`,
        transactionLimit: typeOfExpense.limit,
        yourAmount: amount,
      });
    }

    // Define the month and year of the expense
    const expenseDate = date ? new Date(date) : new Date();
    const year = expenseDate.getFullYear();
    const month = expenseDate.getMonth() + 1;

    // CALCULATE CARRYOVER FROM PREVIOUS MONTHS
    const previousLimitsData = await MonthlyLimit.aggregate([
      // 1. Find  all previous limits for this department
      {
        $match: {
          department: mongoose.Types.ObjectId.createFromHexString(
            String(department)
          ), // Convert to ObjectId
          $or: [{ year: { $lt: year } }, { year: year, month: { $lt: month } }],
        },
      },
      // 2. Group and sum up the unspent amounts
      {
        $group: {
          _id: null, // Grouping key, null means we want a single result
          totalCarryover: {
            $sum: { $subtract: ["$limitAmount", "$spentAmount"] },
          },
        },
      },
    ]);

    // If there's no previous data, carryover is 0
    const carryover =
      previousLimitsData.length > 0 ? previousLimitsData[0].totalCarryover : 0;

    // 2. Find the current month's limit for this department
    const currentLimit = await MonthlyLimit.findOne({
      department,
      year,
      month,
    });

    if (!currentLimit) {
      return res.status(400).json({
        message: `Ліміт для відділу на ${month}/${year} не встановлено`,
      });
    }

    // Calculate the effective limit
    const effectiveLimit = currentLimit.limitAmount + carryover;

    const effectiveLimitExceeded =
      currentLimit.spentAmount + amount > effectiveLimit;

    // 3. Check if adding this expense would exceed the effective limit
    if (effectiveLimitExceeded) {
      const remaining = effectiveLimit - currentLimit.spentAmount;

      return res.status(400).json({
        message: "Перевищено місячний ліміт з урахуванням залишків!",
        effectiveLimit,
        spent: currentLimit.spentAmount,
        remaining,
        carryover,
      });
    }

    // 4. If all checks pass, create the expense
    const newExpense = await Expense.create({
      amount,
      date: expenseDate,
      expenseType,
      employee,
      department,
    });

    // 5. Update the spent amount in the MonthlyLimit
    currentLimit.spentAmount += amount;
    await currentLimit.save();

    res.status(201).json({
      message: "Витрату успішно додано!",
      expense: newExpense,
      limitInfo: {
        ...currentLimit.toObject(),
        effectiveLimit,
        carryover,
      },
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Помилка створення витрати", error: error.message });
  }
};

export const getAllExpenses = async (req, res) => {
  try {
    const { department, expenseType, employee, position, page = 1, limit = 10 } = req.query;

    const query = {};
    if (department) query.department = department;
    if (expenseType) query.expenseType = expenseType;
    if (employee) query.employee = employee;

    if (position) {
      const employeesWithPosition = await Employee.find({ position }).select('_id');
      const employeeIds = employeesWithPosition.map(e => e._id);
      query.employee = { $in: employeeIds };
    }

    const expenses = await Expense.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("expenseType")
      .populate("employee")
      .populate("department")
      .sort({ date: -1 });

    const count = await Expense.countDocuments(query);

    res.status(200).json({
      docs: expenses,
      totalDocs: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
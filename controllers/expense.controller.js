import mongoose from "mongoose";
import Expense from "../models/expense.model.js";
import MonthlyLimit from "../models/monthlyLimit.model.js";
import ExpenseType from "../models/expenseType.model.js";
import Employee from "../models/employee.model.js"; // <-- Додай цей імпорт


// Ефективний ліміт = (Ліміт поточного місяця) + (Усі невитрачені гроші з усіх попередніх місяців).
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

    // 1. Визначаємо рік та місяць для нової витрати
    const expenseDate = date ? new Date(date) : new Date();
    const year = expenseDate.getFullYear();
    const month = expenseDate.getMonth() + 1;

    // --- НОВИЙ БЛОК: РОЗРАХУНОК ЗАЛИШКІВ З МИНУЛИХ ПЕРІОДІВ ---
    const previousLimitsData = await MonthlyLimit.aggregate([
      // 1. Знайти всі ліміти для цього відділу, які були до поточної дати
      {
        $match: {
          department: mongoose.Types.ObjectId.createFromHexString(
            String(department)
          ), // Важливо: конвертуємо ID в ObjectId
          $or: [{ year: { $lt: year } }, { year: year, month: { $lt: month } }],
        },
      },
      // 2. Згрупувати їх і порахувати загальний залишок
      {
        $group: {
          _id: null, // Згрупувати всі документи в одну купу
          totalCarryover: {
            $sum: { $subtract: ["$limitAmount", "$spentAmount"] },
          },
        },
      },
    ]);

    // Якщо є дані з минулих періодів, беремо залишок, якщо ні - він 0
    const carryover =
      previousLimitsData.length > 0 ? previousLimitsData[0].totalCarryover : 0;

    // 2. Знаходимо ліміт для цього відділу на цей місяць
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

    // Рахуємо ефективний ліміт
    const effectiveLimit = currentLimit.limitAmount + carryover;

    const effectiveLimitExceeded =
      currentLimit.spentAmount + amount > effectiveLimit;

    // 3. Перевіряємо, чи не буде перевищено ефективний ліміт
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

    // 4. Якщо все гаразд, створюємо витрату
    const newExpense = await Expense.create({
      amount,
      date: expenseDate,
      expenseType,
      employee,
      department,
    });

    // 5. Оновлюємо поле spentAmount у нашому ліміті
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
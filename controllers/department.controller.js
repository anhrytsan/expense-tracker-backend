import mongoose from "mongoose";
import Department from "../models/department.model.js";
import Employee from "../models/employee.model.js";
import MonthlyLimit from "../models/monthlyLimit.model.js";

// --- HELPER FUNCTION FOR CALCULATIONS ---
const calculateLimitsForDepartment = async (departmentId) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  // 1. Get carryover from previous periods
  const previousLimitsData = await MonthlyLimit.aggregate([
    {
      $match: {
        department: mongoose.Types.ObjectId.createFromHexString(String(departmentId)),
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

  const carryover =
    previousLimitsData.length > 0 ? previousLimitsData[0].totalCarryover : 0;

  // 2. Find the current month's limit
  const currentLimit = await MonthlyLimit.findOne({
    department: departmentId,
    year,
    month,
  });

  const limitAmount = currentLimit ? currentLimit.limitAmount : 0;
  const spentAmount = currentLimit ? currentLimit.spentAmount : 0;
  const effectiveLimit = limitAmount + carryover;

  return {
    limitAmount,
    spentAmount,
    carryover,
    effectiveLimit,
    available: effectiveLimit - spentAmount,
  };
};


export const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find().lean();

    const departmentsWithLimits = await Promise.all(
      departments.map(async (dept) => {
        const limits = await calculateLimitsForDepartment(dept._id);
        return {
          ...dept,
          ...limits,
        };
      })
    );

    res.json(departmentsWithLimits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- NEW FUNCTION ---
export const getDepartmentAvailableFunds = async (req, res) => {
  try {
    const { id } = req.params;
    const limits = await calculateLimitsForDepartment(id);
    res.status(200).json(limits);
  } catch (error) {
     res.status(500).json({ message: "Помилка отримання даних по відділу", error: error.message });
  }
};


export const createDepartment = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Поле 'name' є обов'язковим" });
    }

    const newDepartment = await Department.create({ name });
    res.status(201).json(newDepartment);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: `Відділ з назвою "${req.body.name}" вже існує.` });
    }
    res.status(400).json({ message: error.message });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Назва не може бути порожньою" });
    }

    const updatedDepartment = await Department.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true } // new: true - to return the updated document
    );

    if (!updatedDepartment) {
      return res.status(404).json({ message: "Відділ не знайдено" });
    }
    res.status(200).json(updatedDepartment);
  } catch (error) {
     if (error.code === 11000) {
      return res.status(409).json({ message: `Відділ з назвою "${req.body.name}" вже існує.` });
    }
    res.status(400).json({ message: error.message });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if there are employees in the department
    const employeeCount = await Employee.countDocuments({ department: id });
    if (employeeCount > 0) {
      return res.status(409).json({
        message: `Неможливо видалити відділ, оскільки в ньому є ${employeeCount} співробітників.`,
      });
    }

    const deletedDepartment = await Department.findByIdAndDelete(id);

    if (!deletedDepartment) {
      return res.status(404).json({ message: "Відділ не знайдено" });
    }

    res.status(204).send(); // 204 No Content - successful deletion with no content
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
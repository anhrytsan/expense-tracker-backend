import mongoose from "mongoose";
import Employee from "../models/employee.model.js";
import Department from "../models/department.model.js";

export const createEmployee = async (req, res) => {
  try {
    const { name, position, department } = req.body;
    const newEmployee = await Employee.create({ name, position, department });

    await Department.findByIdAndUpdate(department, {
      $inc: { numberOfEmployees: 1 },
    });

    res.status(201).json(newEmployee);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Такий співробітник вже існує в цьому відділі на цій посаді.",
      });
    }
    res.status(400).json({ message: error.message });
  }
};

export const getAllEmployees = async (req, res) => {
  try {
    const { department, position, page = 1, limit = 10 } = req.query;

    const query = {};
    if (department) {
      query.department = department;
    }
    if (position) {
      query.position = position;
    }

    const limitValue = parseInt(limit, 10);
    const pageValue = parseInt(page, 10);

    let employeesQuery = Employee.find(query)
      .populate("department")
      .sort({ createdAt: -1 });

    if (limitValue > 0) {
      employeesQuery = employeesQuery
        .skip((pageValue - 1) * limitValue)
        .limit(limitValue);
    }

    const employees = await employeesQuery.exec();
    const count = await Employee.countDocuments(query);

    res.status(200).json({
      docs: employees,
      totalDocs: count,
      totalPages: limitValue > 0 ? Math.ceil(count / limitValue) : 1,
      currentPage: pageValue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position, department } = req.body;

    // Find if an employee with the same name, position, and department already exists (excluding the current employee)
    const existingEmployee = await Employee.findOne({
      name,
      position,
      department: mongoose.Types.ObjectId.createFromHexString(department), // Explicit conversion to ObjectId
    });

    if (existingEmployee) {
      return res.status(409).json({
        message: "Такий співробітник вже існує в цьому відділі на цій посаді.",
      });
    }

    const employeeBeforeUpdate = await Employee.findById(id);
    if (!employeeBeforeUpdate) {
      return res.status(404).json({ message: "Співробітника не знайдено" });
    }
    const oldDepartmentId = employeeBeforeUpdate.department;

    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { name, position, department },
      { new: true, runValidators: true }
    );

    if (String(oldDepartmentId) !== String(department)) {
      await Department.findByIdAndUpdate(oldDepartmentId, {
        $inc: { numberOfEmployees: -1 },
      });
      await Department.findByIdAndUpdate(department, {
        $inc: { numberOfEmployees: 1 },
      });
    }

    res.status(200).json(updatedEmployee);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Такий співробітник вже існує в цьому відділі на цій посаді.",
      });
    }
    res.status(400).json({ message: error.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEmployee = await Employee.findByIdAndDelete(id);

    if (!deletedEmployee) {
      return res.status(404).json({ message: "Співробітника не знайдено" });
    }

    await Department.findByIdAndUpdate(deletedEmployee.department, {
      $inc: { numberOfEmployees: -1 },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEmployeePositions = async (req, res) => {
  try {
    const positions = await Employee.distinct("position");
    res.status(200).json(positions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

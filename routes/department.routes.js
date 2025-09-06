// back/routes/department.routes.js

import { Router } from "express";
import {
  getAllDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentAvailableFunds,
} from "../controllers/department.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * components:
 *   schemas:
 *     Department:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique department ID, generated automatically
 *         name:
 *           type: string
 *           description: Department name
 *         numberOfEmployees:
 *           type: number
 *           description: Number of employees in the department
 *       example:
 *         _id: 60d0fe4f5311236168a109ca
 *         name: "Accounting"
 *         numberOfEmployees: 5
 *
 * tags:
 *   name: Departments
 *   description: API for managing departments
 */

/**
 * @swagger
 * /api/departments:
 *   get:
 *     summary: Get all departments
 *     tags: [Departments]
 *     responses:
 *       200:
 *         description: List of departments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Department'
 *   post:
 *     summary: Create a new department
 *     tags: [Departments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: New department name
 *             example:
 *               name: "Marketing"
 *     responses:
 *       201:
 *         description: Department created successfully
 *       409:
 *         description: Department with this name already exists
 */
router.route("/").get(getAllDepartments).post(createDepartment);

/**
 * @swagger
 * /api/departments/{id}/available-funds:
 *   get:
 *     summary: Get available funds for a department
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Department ID
 *     responses:
 *       200:
 *         description: Department funds information
 *       404:
 *         description: Department not found
 */
router.get("/:id/available-funds", getDepartmentAvailableFunds);

/**
 * @swagger
 * /api/departments/{id}:
 *   patch:
 *     summary: Update department name
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the department to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: New department name
 *             example:
 *               name: "Sales Department"
 *     responses:
 *       200:
 *         description: Department updated successfully
 *       404:
 *         description: Department not found
 *       409:
 *         description: Department with this name already exists
 *   delete:
 *     summary: Delete a department
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the department to delete
 *     responses:
 *       204:
 *         description: Department deleted successfully (no response body)
 *       404:
 *         description: Department not found
 *       409:
 *         description: Cannot delete because the department has employees
 */
router.route("/:id").patch(updateDepartment).delete(deleteDepartment);

export default router;

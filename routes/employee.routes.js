import { Router } from "express";
import {
  createEmployee,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
  getEmployeePositions,
} from "../controllers/employee.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * components:
 *   schemas:
 *     Employee:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Employee ID
 *         name:
 *           type: string
 *           description: Employee name
 *         position:
 *           type: string
 *           description: Employee position
 *         department:
 *           $ref: '#/components/schemas/Department'
 *       example:
 *         _id: "60d0fe4f5311236168a109cb"
 *         name: "John Doe"
 *         position: "Chief Accountant"
 *         department:
 *           _id: "60d0fe4f5311236168a109ca"
 *           name: "Accounting"
 *           numberOfEmployees: 5
 */

/**
 * @swagger
 * tags:
 *   name: Employees
 *   description: API for managing employees
 */

/**
 * @swagger
 * /api/employees:
 *   get:
 *     summary: Get a list of employees with filtering and pagination
 *     tags: [Employees]
 *     parameters:
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Department ID for filtering
 *       - in: query
 *         name: position
 *         schema:
 *           type: string
 *         description: Position for filtering
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of employees
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 docs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Employee'
 *                 totalDocs:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *   post:
 *     summary: Create a new employee
 *     tags: [Employees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - position
 *               - department
 *             properties:
 *               name:
 *                 type: string
 *               position:
 *                 type: string
 *               department:
 *                 type: string
 *                 description: Department ID
 *             example:
 *               name: "Jane Smith"
 *               position: "Analyst"
 *               department: "60d0fe4f5311236168a109ca"
 *     responses:
 *       201:
 *         description: Employee created successfully
 *       409:
 *         description: Employee with this data already exists
 */
router.route("/").get(getAllEmployees).post(createEmployee);

/**
 * @swagger
 * /api/employees/positions:
 *   get:
 *     summary: Get a list of unique positions
 *     tags: [Employees]
 *     responses:
 *       200:
 *         description: List of positions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["CEO", "Accountant", "Manager"]
 */
router.get("/positions", getEmployeePositions);

/**
 * @swagger
 * /api/employees/{id}:
 *   patch:
 *     summary: Update employee data
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               position:
 *                 type: string
 *               department:
 *                 type: string
 *                 description: Department ID
 *             example:
 *               name: "John A. Doe"
 *               position: "Senior Accountant"
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *       404:
 *         description: Employee not found
 *   delete:
 *     summary: Delete an employee
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     responses:
 *       204:
 *         description: Employee deleted successfully
 *       404:
 *         description: Employee not found
 */
router.route("/:id").patch(updateEmployee).delete(deleteEmployee);

export default router;

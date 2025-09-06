import { Router } from "express";
import {
  createExpense,
  getAllExpenses,
} from "../controllers/expense.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * components:
 *   schemas:
 *     Expense:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique ID of the expense
 *         amount:
 *           type: number
 *           description: Expense amount
 *         date:
 *           type: string
 *           format: date-time
 *           description: Expense date
 *         expenseType:
 *           $ref: '#/components/schemas/ExpenseType'
 *         employee:
 *           $ref: '#/components/schemas/Employee'
 *         department:
 *           $ref: '#/components/schemas/Department'
 */

/**
 * @swagger
 * tags:
 *   name: Expenses
 *   description: API for managing expenses
 */

/**
 * @swagger
 * /api/expenses:
 *   get:
 *     summary: Get list of expenses with filtering and pagination
 *     tags: [Expenses]
 *     parameters:
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Department ID to filter by
 *       - in: query
 *         name: expenseType
 *         schema:
 *           type: string
 *         description: Expense type ID to filter by
 *       - in: query
 *         name: employee
 *         schema:
 *           type: string
 *         description: Employee ID to filter by
 *       - in: query
 *         name: position
 *         schema:
 *           type: string
 *         description: Employee position to filter by
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
 *         description: List of expenses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 docs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Expense'
 *                 totalDocs:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *   post:
 *     summary: Create a new expense
 *     tags: [Expenses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - date
 *               - expenseType
 *               - employee
 *               - department
 *             properties:
 *               amount:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date-time
 *               expenseType:
 *                 type: string
 *                 description: Expense type ID
 *               employee:
 *                 type: string
 *                 description: Employee ID
 *               department:
 *                 type: string
 *                 description: Department ID
 *             example:
 *               amount: 150.50
 *               date: "2024-08-15T10:00:00.000Z"
 *               expenseType: "60d0fe4f5311236168a109df"
 *               employee: "60d0fe4f5311236168a109cb"
 *               department: "60d0fe4f5311236168a109ca"
 *     responses:
 *       201:
 *         description: Expense successfully created
 *       400:
 *         description: Validation error (e.g., limit exceeded)
 */
router.route("/").get(getAllExpenses).post(createExpense);

export default router;

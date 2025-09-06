import { Router } from "express";
import {
  getAllExpenseTypes,
  createExpenseType,
  updateExpenseType,
  deleteExpenseType,
} from "../controllers/expenseType.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * components:
 *   schemas:
 *     ExpenseType:
 *       type: object
 *       required:
 *         - name
 *         - limit
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique ID of the expense type, generated automatically
 *         name:
 *           type: string
 *           description: Name of the expense type
 *         description:
 *           type: string
 *           description: Description of the expense type
 *         limit:
 *           type: number
 *           description: Transaction limit for this expense type
 *       example:
 *         _id: "60d0fe4f5311236168a109df"
 *         name: "Stationery"
 *         description: "Paper, pens, staplers, etc."
 *         limit: 1000
 */

/**
 * @swagger
 * tags:
 *   name: ExpenseTypes
 *   description: API for managing expense types
 */

/**
 * @swagger
 * /api/expense-types:
 *   get:
 *     summary: Get all expense types
 *     tags: [ExpenseTypes]
 *     responses:
 *       200:
 *         description: List of expense types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ExpenseType'
 *   post:
 *     summary: Create a new expense type
 *     tags: [ExpenseTypes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExpenseType'
 *     responses:
 *       201:
 *         description: Expense type created
 */
router.route("/").get(getAllExpenseTypes).post(createExpenseType);

/**
 * @swagger
 * /api/expense-types/{id}:
 *   patch:
 *     summary: Update an expense type
 *     tags: [ExpenseTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Expense type ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExpenseType'
 *     responses:
 *       200:
 *         description: Expense type updated
 *       404:
 *         description: Expense type not found
 *   delete:
 *     summary: Delete an expense type
 *     tags: [ExpenseTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Expense type ID
 *     responses:
 *       204:
 *         description: Expense type deleted
 *       404:
 *         description: Expense type not found
 */
router.route("/:id").patch(updateExpenseType).delete(deleteExpenseType);

export default router;

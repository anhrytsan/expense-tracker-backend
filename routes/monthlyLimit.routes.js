import { Router } from "express";
import {
  setMonthlyLimit,
  getMonthlyLimits,
  updateMonthlyLimit,
  deleteMonthlyLimit,
} from "../controllers/monthlyLimit.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * components:
 *   schemas:
 *     MonthlyLimit:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique ID of the monthly limit
 *         department:
 *           type: string
 *           description: Department ID
 *         year:
 *           type: number
 *           description: Year
 *         month:
 *           type: number
 *           description: Month
 *         limitAmount:
 *           type: number
 *           description: Assigned limit amount
 *         spentAmount:
 *           type: number
 *           description: Spent amount
 *       example:
 *         _id: "60d0fe4f5311236168a109e2"
 *         department: "60d0fe4f5311236168a109ca"
 *         year: 2024
 *         month: 8
 *         limitAmount: 10000
 *         spentAmount: 4500
 */

/**
 * @swagger
 * tags:
 *   name: MonthlyLimits
 *   description: API for managing monthly limits
 */

/**
 * @swagger
 * /api/limits:
 *   get:
 *     summary: Get all monthly limits
 *     tags: [MonthlyLimits]
 *     responses:
 *       200:
 *         description: List of monthly limits
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MonthlyLimit'
 *   post:
 *     summary: Set or update a monthly limit for a department
 *     tags: [MonthlyLimits]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - department
 *               - year
 *               - month
 *               - limitAmount
 *             properties:
 *               department:
 *                 type: string
 *                 description: Department ID
 *               year:
 *                 type: number
 *               month:
 *                 type: number
 *               limitAmount:
 *                 type: number
 *             example:
 *               department: "60d0fe4f5311236168a109ca"
 *               year: 2024
 *               month: 9
 *               limitAmount: 15000
 *     responses:
 *       200:
 *         description: Limit updated
 *       201:
 *         description: Limit created
 */
router.route("/").get(getMonthlyLimits).post(setMonthlyLimit);

/**
 * @swagger
 * /api/limits/{id}:
 *   patch:
 *     summary: Update the limit amount
 *     tags: [MonthlyLimits]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Monthly limit ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               limitAmount:
 *                 type: number
 *             example:
 *               limitAmount: 12500
 *     responses:
 *       200:
 *         description: Limit updated
 *       404:
 *         description: Limit not found
 *   delete:
 *     summary: Delete a monthly limit
 *     tags: [MonthlyLimits]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Monthly limit ID
 *     responses:
 *       204:
 *         description: Limit deleted
 *       404:
 *         description: Limit not found
 */
router.route("/:id").patch(updateMonthlyLimit).delete(deleteMonthlyLimit);

export default router;

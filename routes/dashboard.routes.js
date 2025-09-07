import { Router } from 'express';
import { getDashboardSummary } from '../controllers/dashboard.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: API for retrieving dashboard summary data
 */

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Get dashboard summary data
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved dashboard summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalDepartments:
 *                   type: integer
 *                   description: Total number of departments.
 *                   example: 5
 *                 totalEmployees:
 *                   type: integer
 *                   description: Total number of employees.
 *                   example: 25
 *                 totalExpenses:
 *                   type: number
 *                   description: Total amount of all expenses.
 *                   example: 15780.50
 *                 recentExpenses:
 *                   type: array
 *                   description: List of the 5 most recent expenses.
 *                   items:
 *                     $ref: '#/components/schemas/Expense'
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
router.get('/summary', authMiddleware, getDashboardSummary);

export default router;

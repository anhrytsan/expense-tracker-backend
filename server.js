import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import departmentRouter from "./routes/department.routes.js";
import expenseTypeRouter from "./routes/expenseType.routes.js";
import employeeRouter from "./routes/employee.routes.js";
import expenseRouter from "./routes/expense.routes.js";
import monthlyLimitRouter from "./routes/monthlyLimit.routes.js";
import dashboardRouter from './routes/dashboard.routes.js';
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app = express();
const PORT = process.env.PORT || 3000;
const { DB_HOST } = process.env;

app.use(cors());
app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API для обліку внутрішніх витрат',
      version: '1.0.0',
      description: 'Документація REST API для фінального проєкту',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Локальний сервер для розробки',
      },
    ],
  },
  // Шлях до файлів, де знаходяться анотації Swagger
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware для Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.json({ message: "Сервер запущено!" });
});

// Всі запити, що починаються з /api/departments, будуть оброблятися в departmentRouter
app.use("/api/departments", departmentRouter);
app.use("/api/expense-types", expenseTypeRouter);
app.use("/api/employees", employeeRouter);
app.use("/api/expenses", expenseRouter);
app.use("/api/limits", monthlyLimitRouter);
app.use("/api/auth", authRouter);
app.use('/api/dashboard', dashboardRouter);

const startServer = async () => {
  try {
    await mongoose.connect(DB_HOST);
    console.log("Database connection successful");
    app.listen(PORT, () => {
      console.log(`Сервер працює на порті ${PORT}...`);
    });
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

startServer();

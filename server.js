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

const allowedOrigins = [
  'https://expense-tracker-frontend-rho-nine.vercel.app',
  'http://localhost:4200'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
};

app.use(cors(corsOptions));
app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API for internal cost accounting',
      version: '1.0.0',
      description: 'REST API documentation for the final project',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Локальний сервер для розробки',
      },
    ],
  },
  // Path to the API docs
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware for serving Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.json({ message: "Сервер запущено!" });
});

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
      console.log(`Server is listening on ${PORT}...`);
    });
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

startServer();

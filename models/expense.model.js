import { Schema, model } from "mongoose";

const expenseSchema = new Schema(
  {
    amount: {
      type: Number,
      required: [true, "Сума є обовʼязковою"],
      min: 0,
    },
    date: {
      type: Date,
      required: [true, "Дата є обовʼязковою"],
      default: Date.now,
    },
    // --- Зв'язки ---
    expenseType: {
      type: Schema.Types.ObjectId,
      ref: "expenseType", // Посилання на модель ExpenseType
      required: true,
    },
    employee: {
      type: Schema.Types.ObjectId,
      ref: "employee", // Посилання на модель Employee
      required: true,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: "department", // Посилання на модель Department
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Expense = model("expense", expenseSchema);

export default Expense;

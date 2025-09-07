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

    expenseType: {
      type: Schema.Types.ObjectId,
      ref: "expenseType",
      required: true,
    },
    employee: {
      type: Schema.Types.ObjectId,
      ref: "employee",
      required: true,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: "department",
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

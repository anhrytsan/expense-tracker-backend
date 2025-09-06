import { Schema, model } from "mongoose";

const expenseTypeSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Назва виду витрат є обовʼязковою"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    limit: {
      type: Number,
      required: [true, "Гранична сума є обовʼязковою"],
      min: 0,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const ExpenseType = model("expenseType", expenseTypeSchema);

export default ExpenseType;

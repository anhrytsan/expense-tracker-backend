import { Schema, model } from "mongoose";

const monthlyLimitSchema = new Schema(
  {
    department: {
      type: Schema.Types.ObjectId,
      ref: "department",
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    limitAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    spentAmount: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// Compound index to ensure uniqueness of department, year, and month
monthlyLimitSchema.index(
  { department: 1, year: 1, month: 1 },
  { unique: true }
);

const MonthlyLimit = model("monthlyLimit", monthlyLimitSchema);

export default MonthlyLimit;

import { Schema, model } from "mongoose";

const departmentSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Назва відділу є обовʼязковою"],
      unique: true,
      trim: true,
    },
    numberOfEmployees: {
      type: Number,
      default: 0,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Department = model("department", departmentSchema);

export default Department;

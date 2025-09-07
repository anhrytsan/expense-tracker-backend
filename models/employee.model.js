import { Schema, model } from "mongoose";

const employeeSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Імʼя співробітника є обовʼязковим"],
      trim: true,
    },
    position: {
      type: String,
      required: [true, "Посада є обовʼязковою"],
      trim: true,
    },
    // Link to the Department model
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

// Adding a compound index to ensure uniqueness of name, position, and department
employeeSchema.index({ name: 1, position: 1, department: 1 }, { unique: true });

const Employee = model("employee", employeeSchema);

export default Employee;

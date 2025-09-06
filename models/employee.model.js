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
    // Ось і наш зв'язок!
    department: {
      type: Schema.Types.ObjectId,
      ref: "department", // Вказуємо, що це посилання на модель 'department'
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// --- НОВИЙ БЛОК: Додаємо комбінований індекс ---
// Це гарантує, що не може існувати двох записів
// з однаковим ім'ям, посадою та відділом.
employeeSchema.index({ name: 1, position: 1, department: 1 }, { unique: true });

const Employee = model("employee", employeeSchema);

export default Employee;

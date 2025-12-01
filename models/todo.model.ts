import mongoose from "mongoose";
interface ITodo {
  _id?: mongoose.Types.ObjectId;
  title: string;
  completed: Boolean;
  userId: mongoose.Types.ObjectId;
}
const todoSchema = new mongoose.Schema<ITodo>(
  {
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Todo = mongoose.models.Todo || mongoose.model("Todo", todoSchema);

export default Todo;

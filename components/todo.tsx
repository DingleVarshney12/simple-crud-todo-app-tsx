"use client";
import { PenSquare, Trash } from "lucide-react";
import { useState } from "react";

interface FCTodo {
  id: string; // unique id for the todo
  initialTitle: string;
  initialCompleted: boolean;
  onDelete: () => void;
  date: string;
}

const Todo = ({
  id,
  initialTitle,
  initialCompleted,
  onDelete,
  date,
}: FCTodo) => {
  const [todo, setTodo] = useState({
    title: initialTitle,
    completed: initialCompleted,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Call API to update todo
  const updateTodo = async (updatedTodo: {
    title: string;
    completed: boolean;
  }) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/todos?todoId=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTodo),
      });
      if (!response.ok) throw new Error("Failed to update todo");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle completion
  const handleCheck = async () => {
    const updated = { ...todo, completed: !todo.completed };
    setTodo(updated);
    await updateTodo(updated);
  };

  // Update title while editing
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodo((prev) => ({ ...prev, title: e.target.value }));
  };

  // Save changes on blur or Enter
  const handleEdit = async () => {
    if (!isEditing) return; // only save if editing
    await updateTodo(todo);
    setIsEditing(false);
  };

  // Delete todo
  const handleDelete = async () => {
    if (!id) return console.error("Todo ID is missing");

    try {
      const response = await fetch(`/api/todos?todoId=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete todo");
      }

      // Update UI immediately
      onDelete();
    } catch (error: any) {
      console.error("Error deleting todo:", error.message);
    }
  };

  return (
    <div className={`border-b  py-1 w-full ${loading ? "opacity-50" : ""}`}>
      <p className="text-right mb-2">{date}</p>
      <div className="flex items-center justify-between flex-wrap space-x-1">
        {/* Checkbox and text */}
        <div className="flex items-center space-x-2 flex-1">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={handleCheck}
            className="w-6 h-6"
          />
          {isEditing ? (
            <input
              type="text"
              value={todo.title}
              onChange={handleChange}
              onBlur={handleEdit} // Save on blur
              onKeyDown={(e) => e.key === "Enter" && handleEdit()} // Save on Enter
              className="text-lg border-b border-gray-300 focus:outline-none w-full"
              autoFocus
            />
          ) : (
            <p
              className={`text-lg ${
                todo.completed ? "line-through text-gray-400" : ""
              }`}
            >
              {todo.title}
            </p>
          )}
        </div>

        {/* Edit & Delete Buttons */}
        <div className="flex items-center space-x-2 mt-2 md:mt-0">
          <div
            className="px-2 py-2 rounded-lg cursor-pointer hover:bg-gray-200"
            onClick={() => setIsEditing(true)}
          >
            <PenSquare />
          </div>
          <div
            className="px-2 py-2 rounded-lg bg-red-500 cursor-pointer hover:bg-red-600"
            onClick={handleDelete}
          >
            <Trash />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Todo;

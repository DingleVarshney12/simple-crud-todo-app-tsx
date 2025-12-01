"use client";

import Todo from "@/components/todo";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface TodoType {
  _id: string;
  title: string;
  userId: string;
  completed: boolean;
  createdAt: Date;
}

export default function Home() {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [todos, setTodos] = useState<TodoType[]>([]);

  // Handle input change
  const handleTodo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, userId: session?.user?.id }),
        credentials: "include",
      });

      if (!res.ok) {
        setError("Failed to create todo. Try again later.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setTodos((prev) => [...prev, data.todo]);
      setTitle("");
      setSuccess(true);
    } catch (err) {
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // Fetch todos on session load
  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchTodos = async () => {
      try {
        const res = await fetch(`/api/todos?userId=${session?.user?.id}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch todos");
        const data: TodoType[] = await res.json();
        setTodos(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchTodos();
  }, [session?.user?.id]);

  // Auto-hide success message
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Handle todo deletion
  const handleDelete = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo._id !== id));
  };

  return (
    <section className="min-h-screen pt-6 container mx-auto px-2 py-2 relative">
      <div className="create-todo mx-auto w-fit mt-8">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="What to do Today?"
            name="title"
            id="title"
            className="px-6 py-4 bg-slate-600 rounded-full rounded-r-none md:w-2xl"
            value={title}
            onChange={handleTodo}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-4 bg-blue-500 rounded-full rounded-l-none disabled:opacity-50"
          >
            {loading ? "Loading..." : "Create"}
          </button>
        </form>
      </div>

      {error && <p className="text-lg text-red-500 mt-2">{error}</p>}

      {success && (
        <div
          className="absolute bg-slate-800 text-green-500 px-4 py-2 rounded-lg
          top-2 left-2 transition-all"
        >
          Todo Created
        </div>
      )}

      <div className="todo-list flex flex-col space-y-4 items-center mt-4 bg-slate-900 max-w-5xl mx-auto border rounded-2xl py-4 px-1">
        {todos.length > 0 ? (
          todos.map((todo, idx) => (
            <>
              <Todo
                key={idx}
                id={todo._id}
                initialTitle={todo.title}
                initialCompleted={todo.completed}
                date={new Date(todo.createdAt).toLocaleDateString("en-GB")}
                onDelete={() => handleDelete(todo._id)}
              />
            </>
          ))
        ) : (
          <p className="text-gray-400">No todos yet.</p>
        )}
      </div>
    </section>
  );
}

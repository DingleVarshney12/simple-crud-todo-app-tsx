"use client";
import Todo from "@/components/todo";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Home() {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { data: session } = useSession();
  console.log(session);
  const handleTodo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, userId: session?.user?.id }),
      });
      if (!res.ok) {
        setError("Failed to Create Todo...Try again Later...");
      }
      setSuccess(true);
    } catch (error) {
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);
  return (
    <>
      <section className="min-h-screen pt-6 container mx-auto px-2 py-2 relative">
        <div className="create-todo mx-auto w-fit mt-8">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="What to do Today ?"
              name="title"
              id="title"
              className="px-6 py-4 bg-slate-600 rounded-full rounded-r-none md:w-2xl"
              value={title}
              onChange={handleTodo}
            />
            <button
              type="submit"
              className="px-6 py-4 bg-blue-500 rounded-full rounded-l-none"
            >
              {loading ? "Loading..." : "Create"}
            </button>
          </form>
        </div>
        {error && (
          <>
            <p className="text-lg text-red-500">{error}</p>
          </>
        )}
        {success && (
          <div
            className="absolute bg-slate-800 text-green-500 px-4 py-2 rounded-lg
           top-2 left-2 transition-all "
          >
            Todo Created
          </div>
        )}
        <div className="todo-list flex flex-col space-y-4 items-center mt-4 bg-slate-900 max-w-5xl mx-auto border rounded-2xl py-4 px-1">
          <Todo />
          <Todo />
          <Todo />
          <Todo />
          <Todo />
          <Todo />
          <Todo />
          <Todo />
        </div>
      </section>
    </>
  );
}
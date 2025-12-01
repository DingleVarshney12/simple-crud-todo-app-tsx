"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const Register = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setRegistered(false);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      // If registration is successful
      setRegistered(true);
      setFormData({ name: "", email: "", password: "" });

      // Optionally redirect to login after 2-3 seconds
      // setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (registered) {
      const timer = setTimeout(() => setRegistered(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [registered]);
  return (
    <>
      <div className="relative container mx-auto  min-h-screen flex items-center justify-center">
        <form
          onSubmit={handleForm}
          className="w-full max-w-2xl h-fit px-4 md:px-6 py-4 bg-slate-800 rounded-lg mx-4"
        >
          <h2 className="text-4xl font-bold text-white ">Register</h2>
          <p className="text-sm mt-2">Enter Details to create an account</p>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Enter name"
              className="w-full h-14 rounded-full border border-white bg-slate-900 px-8"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="mt-4">
            <input
              type="email"
              placeholder="Enter email"
              className="w-full h-14 rounded-full border border-white bg-slate-900 px-8"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Enter password"
              className="w-full h-14 rounded-full border border-white bg-slate-900 px-8"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="mt-2">
            {error && <p className="text-red-500 text-md ">{error}</p>}
          </div>
          <div className="mt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-full border border-white bg-blue-500 px-8 disabled:bg-blue-300"
              id="registerBtn"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
          <div className="mt-2 text-center">
            <p>
              Already Have an Account ?{" "}
              <Link
                href={"/login"}
                className="text-inherit underline underline-offset-4"
              >
                Login
              </Link>
            </p>
          </div>
          {registered &&
          <div className="mt-4 text-center text-green-400">
            You can now login !!
          </div>
          }
        </form>
        {registered && (
          <div className="absolute bg-slate-800 text-green-500 px-4 py-2 rounded-lg bottom-2 right-2 transition-all ">
            Registered Successfully
          </div>
        )}
      </div>
    </>
  );
};

export default Register;

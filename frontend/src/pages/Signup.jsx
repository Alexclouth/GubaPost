import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    signup(form.username, form.email, form.password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-r from-green-100 to-green-50 px-4">
      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-md p-8 md:p-10 animate-fade-in">
        <h2 className="text-3xl font-bold mb-8 text-center text-green-700 tracking-wide">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none transition duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none transition duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none transition duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none transition duration-200"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-2xl"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

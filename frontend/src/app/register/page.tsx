"use client";
import { useState } from "react";
import { register } from "../lib/api/auth";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await register(name, email, password);

      if (data?.token) {
        localStorage.setItem("token", data.token);
        alert("สมัครเสร็จแล้ว! ✅");
        // redirect ไป dashboard
        window.location.href = "/dashboard";
      } else {
        alert("สมัครไม่สำเร็จ ❌");
      }
    } catch (err) {
      console.error(err);
      alert("มี error เกิดขึ้น");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4">Register</h2>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
        >
          {loading ? "Loading..." : "Register"}
        </button>
      </form>
    </div>
  );
}

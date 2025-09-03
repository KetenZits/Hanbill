"use client";
import { useState, useEffect } from "react";
import { User } from "@/types";

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    if (token) {
      fetch("http://127.0.0.1:8000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(setUser);
    }
  }, [token]);

  return (
    <div>
      <h1>Profile</h1>
      {user && (
        <div>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
        </div>
      )}
    </div>
  );
}

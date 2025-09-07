"use client";
import { useEffect, useState } from "react";
import { getBills } from "../lib/api/bill";
import { Bill } from "../types/index";

export default function Dashboard() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [token, setToken] = useState<string>("");
  
  useEffect(() => {
    // localStorage ใช้ได้แค่บน client
    const storedToken = localStorage.getItem("token") || "";
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (token) {
      getBills(token).then(setBills);
    }
  }, [token]);

  return (
    <div>
      <h1>My Bills</h1>
      <ul>
        {bills.map(b => (
          <li key={b.id}>{b.title}</li>
        ))}
      </ul>
    </div>
  );
}

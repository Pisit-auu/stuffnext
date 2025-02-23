"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: number;
  name: string | null;
  username: string;
  surname : string;
  role: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({ name: "", username: "", password: "", role: "user" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/auth/signup");
      console.log("API Response:", res.data); 
      setUsers(res.data.users); 
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  
  const handleDelete = async (id: number) => {
    await axios.delete(`/api/auth/signup/${id}`);
    fetchUsers();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Admin Dashboard</h1>

      {/* ตารางแสดงผู้ใช้ */}
      <div className="overflow-x-auto">
        <table className="w-full border min-w-[600px]">
          <thead>
            <tr className="bg-gray-100 text-sm">

              <th className="p-2 border">ชื่อ</th>
              <th className="p-2 border">Username</th>
              <th className="p-2 border">บทบาท</th>
              <th className="p-2 border">การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(users) ? (
              users.map((user) => (
                <tr key={user.id} className="border text-sm">
     
                  <td className="p-2 border">{user.name || "-"} {user.surname || "-"}</td>
                  <td className="p-2 border">{user.username}</td>
                  <td className="p-2 border text-center">{user.role}</td>
                  <td className="p-2 border text-center">
                    <button onClick={() => handleDelete(user.id)} className="bg-red-500 text-white px-2 py-1 rounded-md">ลบ</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} className="p-2 text-center">ไม่มีข้อมูล</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

'use client'
import { useEffect, useState } from "react";
import axios from "axios";
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

interface User {
  id: number;
  name: string | null;
  username: string;
  surname: string;
  role: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUsername, setNewUsername] = useState<string>('');
  const [saveUsername, setSaveusername] = useState<string>('');
  const { data: session, status } = useSession();
  
  // เพิ่ม state สำหรับการแบ่งหน้า
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0); // จำนวนผู้ใช้ทั้งหมด

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const fetchUsers = async (page: number) => {
    try {
      const res = await axios.get("/api/auth/signup", {
        params: {
          page: page,  // ส่งพารามิเตอร์ page
          limit: 15,    // กำหนดให้ดึงข้อมูล 15 รายการ
        },
      });
      console.log("API Response:", res.data);
      setUsers(res.data.users); 
      setTotalCount(res.data.totalCount); // เก็บจำนวนผู้ใช้ทั้งหมด
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDelete = async (id: number, usernameselect: string) => {
    if (session?.user.username === usernameselect) {
      alert("ไม่สามารถลบรหัสของตนเองได้");
      return;
    }
    try {
      await axios.delete(`/api/auth/signup/${id}`);
      fetchUsers(currentPage); // รีเฟรชรายการผู้ใช้หลังจากลบ
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("เกิดข้อผิดพลาดในการลบผู้ใช้");
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setNewUsername(user.username);
    setSaveusername(user.username)
  };

  const handleSaveUsername = async () => {
    if (!editingUser) return;
    try {
      if (newUsername.trim() === "") {
        alert("กรุณากรอกชื่อผู้ใช้ใหม่");
        return;
      }

      if (session?.user.username === saveUsername) {
        await axios.put(`/api/auth/signup/${saveUsername}`, { username: newUsername });
        signOut({ callbackUrl: '/login' })
        alert('อัพเดตเสร็จสิ้น กรุณาเข้าสู่ระบบใหม่')
        return
      }else{
        await axios.put(`/api/auth/signup/${saveUsername}`, { username: newUsername });
      }
      setEditingUser(null); // หยุดการแก้ไขหลังจากบันทึก
      fetchUsers(currentPage); // รีเฟรชรายการผู้ใช้หลังจากอัพเดต
      alert('อัพเดตเสร็จสิ้น')
    } catch (error) {
      console.error("Error updating username:", error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
    `${user.name} ${user.surname}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // คำนวณจำนวนหน้าทั้งหมด
  const totalPages = totalCount > 0 ? Math.ceil(totalCount / 15) : 1; // ตรวจสอบ totalCount เพื่อหลีกเลี่ยง NaN

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="mt-4 text-xl mb-4 font-bold">ผู้ใช้งานทั้งหมด</h1>
      <div className="flex flex-wrap justify-between items-center mb-4 space-x-2">
        <input
          type="text"
          placeholder="ค้นหาหน้านี้จากชื่อผู้ใช้ หรือ ชื่อ-นามสกุล"
          className="px-4 py-2 border rounded-md w-full max-w-xs mb-2 sm:mb-0"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <Link href={"/admin/user/singupuser"}>
          <button className="bg-green-400 text-white px-4 py-2 rounded-md">
            เพิ่มผู้ใช้งาน
          </button>
        </Link>
      </div>

      {/* ตารางแสดงผู้ใช้ */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border px-4 py-4">
          <thead>
            <tr className="bg-gray-100 text-sm">
              <th className="p-2 border">ชื่อผู้ใช้ (username)</th>
              <th className="p-2 border">ชื่อ-นามสกุล</th>
              <th className="p-2 border">บทบาท</th>
              <th className="p-2 border">การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="border text-sm">
                  <td className="p-2 border">
                    {editingUser && editingUser.id === user.id ? (
                      <input
                        type="text"
                        className="px-2 py-1 border rounded-md"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                      />
                    ) : (
                      user.username
                    )}
                  </td>
                  <td className="p-2 border">{user.name || "-"} {user.surname || "-"}</td>
                  <td className="p-2 border text-center">{user.role}</td>
                  <td className="p-2 border text-center">
                    {editingUser && editingUser.id === user.id ? (
                      <button
                        onClick={handleSaveUsername}
                        className="bg-blue-500 text-white px-2 py-1 rounded-md"
                      >
                        บันทึก
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(user)}
                        className="bg-yellow-400 text-white px-2 py-1 rounded-md"
                      >
                        แก้ไข
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(user.id, user.username)}
                      className="bg-red-500 text-white px-2 py-1 rounded-md ml-2"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={4} className="p-2 text-center">ไม่มีข้อมูล</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ปุ่มเปลี่ยนหน้า */}
      <div className="flex justify-center space-x-4 mt-4">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          ก่อนหน้า
        </button>
        <span>{currentPage} / {totalPages}</span>
        <button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          ถัดไป
        </button>
      </div>
    </div>
  );
}

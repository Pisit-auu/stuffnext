'use client';
import axios from 'axios';
import { useSession, signOut, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import bcrypt from 'bcryptjs';
import Link from 'next/link';

export default function Profile() {
  const { data: session, status, update } = useSession();
  const [getuser, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [password, setPassword] = useState('');
  const [formData, setFormData] = useState<any>({
    username: '',
    name: '',
    surname: '',
    email: '',
    tel: '',
    password: ''
  });

  const router = useRouter();

  // ฟังก์ชันดึงข้อมูลผู้ใช้
  const fetchUser = async () => {
    if (!session?.user?.username) return;
    try {
      const resuser = await axios.get(`/api/auth/signup/${session.user.username}`);
      if (resuser.data) {
        setUser(resuser.data);
        setFormData(resuser.data);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  // ฟังก์ชันสำหรับการอัปเดตข้อมูล
  const handleUpdate = async () => {
    if (!session?.user?.username) return;
    if (!password) {
      alert("โปรดกรอกรหัสเพื่อยืนยันการแก้ไขข้อมูล");
      return;
    }
    try {
      // ตรวจสอบรหัสผ่านที่กรอก
      const isPasswordCorrect = await bcrypt.compare(password, getuser.password);
      if (!isPasswordCorrect) {
        alert('รหัสผ่านไม่ถูกต้อง');
        return;
      }

      // อัปเดตข้อมูลผู้ใช้บน server
      const res = await axios.put(`/api/auth/signup/${session.user.username}`, formData);
      if (res.status === 200) {
        setUser(formData);
        setIsEditing(false);

        // อัปเดต session บน client
        await update({
          user: {
            ...session.user,
            ...formData,
          },
        });

        // รีเฟรช session ด้วยรหัสผ่านใหม่
        const response = await signIn("credentials", {
          redirect: false,
          username: session.user.username,
          password,
        });

        // ตรวจสอบผลการเข้าสู่ระบบ
        if (response?.error) {
          alert('เกิดข้อผิดพลาด');
        } else {
          alert('เปลี่ยนข้อมูลเรียบร้อย');
          setPassword('');
        }
      }
    } catch (error) {
      console.error('มีปัญหาระหว่างอัพโหลด:', error);
      alert('มีปัญหาระหว่างอัพโหลด.');
    }
  };

  // เรียก fetchUser เมื่อ session มีการเปลี่ยนแปลง หรือเมื่อ status เป็น 'authenticated'
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.username) {
      fetchUser();  // ดึงข้อมูลผู้ใช้เมื่อ session พร้อมใช้งาน
    }
  }, [status, session?.user?.username]);

  // ตรวจสอบสถานะการโหลด session
  if (status === 'loading') {
    return <p className="text-center text-gray-500">กำลังโหลดข้อมูล...</p>;
  }

  if (status === 'unauthenticated') {
    router.push('/login');
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 py-8">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full space-y-6">
        {status === 'authenticated' && session?.user ? (
          <>
            <div className="text-3xl font-semibold text-center text-gray-800">
              ยินดีต้อนรับ  <span className="text-blue-600">{session.user.username}</span>
            </div>
            <div className="space-y-5">
              {getuser ? (
                <>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-lg text-gray-700">ชื่อผู้ใช้:</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.username || ""}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          className="p-2 border rounded-md shadow-sm w-full max-w-xs focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <span>{getuser.username}</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-lg text-gray-700">อีเมล:</label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={formData.email || ""}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="p-2 border rounded-md shadow-sm w-full max-w-xs focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <span>{getuser.email}</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-lg text-gray-700">ชื่อจริง:</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.name || ""}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="p-2 border rounded-md shadow-sm w-full max-w-xs focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <span>{getuser.name}</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-lg text-gray-700">นามสกุล:</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.surname || ""}
                          onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                          className="p-2 border rounded-md shadow-sm w-full max-w-xs focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <span>{getuser.surname}</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-lg text-gray-700">เบอร์โทรศัพท์:</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.tel || ""}
                          onChange={(e) => setFormData({ ...formData, tel: e.target.value })}
                          className="p-2 border rounded-md shadow-sm w-full max-w-xs focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <span>{getuser.tel}</span>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="mt-4">
                      <label className="text-lg text-gray-700">กรอกรหัสผ่านเพื่อยืนยันการแก้ไขข้อมูล:</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="p-2 border rounded-md shadow-sm w-full max-w-xs focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </>
              ) : (
                <div>กำลังโหลดข้อมูล...</div>
              )}
            </div>

            <div className="mt-6 flex gap-4">
              {isEditing ? (
                <button
                  onClick={handleUpdate}
                  className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-300"
                >
                  บันทึกการเปลี่ยนแปลง
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-700 transition duration-300"
                >
                  แก้ไขข้อมูลส่วนตัว
                </button>
              )}
            </div>

            <Link href={`/profile/changepassword`}>
              <button
                className="mt-4 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-300"
              >
                เปลี่ยนรหัสผ่าน
              </button>
            </Link>

            <div className="mt-4">
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
              >
                ออกจากระบบ
              </button>
            </div>
          </>
        ) : (
          <p>กำลังโหลด...</p>
        )}
      </div>
    </div>
  );
}

'use client';
import axios from 'axios';
import { useSession, signOut, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import bcrypt from 'bcryptjs';

export default function Profile() {
  const { data: session, status, update } = useSession();
  const [getuser, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [password, setPassword] = useState('');
  const [changepassword,setchangpassword]= useState('');
  const [formData, setFormData] = useState<any>({
    username: '',
    name: '',
    surname: '',
    email: '',
    tel: '',
    password:''
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
    if (!session?.user?.username || !password) return;

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
          setPassword('')
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
    return <p>Loading...</p>;
  }

  if (status === 'unauthenticated') {
    router.push('/login');
  }

  return (
    <div className="flex h-full items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        {status === 'authenticated' && session?.user ? (
          <>
            <div className="text-2xl font-semibold text-center mb-4">
              Welcome, <span className="text-blue-600">{session.user.username}</span>!
            </div>
            <div className="space-y-3">
              {getuser ? (
                <>
                  <div className="flex">
                    <div className="text-lg text-gray-700">
                      ชื่อผู้ใช้: {isEditing ? (
                        <input
                          type="text"
                          value={formData.username || ""}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          className="p-2 border rounded"
                        />
                      ) : (
                        getuser.username
                      )}
                    </div>
                  </div>
                  <div className="text-lg text-gray-700">
                    email: {isEditing ? (
                      <input
                        type="email"
                        value={formData.email || ""}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="p-2 border rounded"
                      />
                    ) : (
                      getuser.email
                    )}
                  </div>

                  <div className="text-lg text-gray-700">
                    <div>ชื่อจริง:</div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name || ""}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="p-2 border rounded"
                      />
                    ) : (
                      getuser.name
                    )}
                    &nbsp;
                    <div>นามสกุล:</div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.surname || ""}
                        onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                        className="p-2 border rounded"
                      />
                    ) : (
                      getuser.surname
                    )}
                  </div>

                  <div className="text-lg text-gray-700">
                    <strong>Role:</strong>
                    {getuser.role}
                  </div>

                  <div className="text-lg text-gray-700">
                    <strong>Tel:</strong> {isEditing ? (
                      <input
                        type="text"
                        value={formData.tel || ""}
                        onChange={(e) => setFormData({ ...formData, tel: e.target.value })}
                        className="p-2 border rounded"
                      />
                    ) : (
                      getuser.tel
                    )}
                  </div>

               
                  {/* ช่องกรอกรหัสผ่าน */}
                  {isEditing && (
                    <div className="text-lg text-gray-700">
                      <div>กรอกรหัสผ่านเพื่อแก้ไขข้อมูล:</div>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="p-2 border rounded"
                      />
                    </div>
                  )}
                </>
              ) : (
                <div>Loading user data...</div>
              )}
            </div>

            <div className="mt-6">
              {isEditing ? (
                <button
                  onClick={handleUpdate}
                  className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-300"
                >
                  Save Changes
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-yellow-600 text-white py-2 rounded-md hover:bg-yellow-700 transition duration-300"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <div className="mt-6">
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

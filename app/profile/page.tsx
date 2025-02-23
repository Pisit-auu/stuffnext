'use client';
import axios from 'axios';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Profile() {
  const { data: session, status } = useSession();
  const [getuser, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);  // เพิ่มสถานะการแก้ไข
  const [formData, setFormData] = useState<any>({
    username: "",
    name: "",
    surname: "",
    email: "",
    tel: "",
  });
  
  const router = useRouter();

  // ฟังก์ชันดึงข้อมูลผู้ใช้
  const fetchUser = async () => {
    if (!session?.user?.username) return;  // ตรวจสอบว่ามี username ใน session หรือไม่
    try {
      const resuser = await axios.get(`/api/auth/signup/${session.user.username}`);
      if (resuser.data) {
        setUser(resuser.data);  // อัปเดตข้อมูลผู้ใช้ที่ได้รับจาก API
        setFormData(resuser.data);  // เตรียมข้อมูลสำหรับการแก้ไข
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  // ฟังก์ชันสำหรับการอัปเดตข้อมูล
  const handleUpdate = async () => {
    if (!session?.user?.username) return;
    try {
      const res = await axios.put(`/api/auth/signup/${session.user.username}`, formData);
      if (res.status === 200) {
        setUser(formData);  // อัปเดตข้อมูลผู้ใช้ใน state
        setIsEditing(false);  // ปิดโหมดแก้ไข
        alert('User data updated successfully!');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user data.');
    }
  };

  // เรียก fetchUser เมื่อ session มีการเปลี่ยนแปลง หรือเมื่อ status เป็น 'authenticated'
  useEffect(() => {
    if (status === 'authenticated') {
      fetchUser();  // ดึงข้อมูลผู้ใช้เมื่อ session พร้อมใช้งาน
    }
  }, [status]);  // เปลี่ยนแปลงตาม status ของ session

  // ตรวจสอบสถานะการโหลด session
  if (status === 'loading') {
    return <p>Loading...</p>;  // กำลังโหลด session
  }

  if (status === 'unauthenticated') {
    router.push('/login');  // ถ้าไม่ได้ login, เปลี่ยนหน้าไปที่หน้า login

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
              {/* แสดงข้อมูลผู้ใช้เมื่อได้ข้อมูลจาก API */}
              {getuser ? (
                <>
                  {/*บน*/}
                  <div className="flex">
                    <div className="text-lg text-gray-700">
                      ชื่อผู้ใช้: {isEditing ? (
                        <input
                        type="text"
                        value={formData.username ?? ""}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="p-2 border rounded"
                      />
                      
                      ) : (
                        getuser.username
                      )}
                    </div>
                    <div className="text-lg text-gray-700">
                      email: {isEditing ? (
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="p-2 border rounded"
                        />
                      ) : (
                        getuser.email
                      )}
                    </div>
                  </div>
                  
                  <div className="text-lg text-gray-700">
                    <div>ชื่อจริง:</div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
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
                        value={formData.surname}
                        onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                        className="p-2 border rounded"
                      />
                    ) : (
                      getuser.surname
                    )}
                  </div>
                  
                  <div className="text-lg text-gray-700">
                      <strong>Role:</strong> {/*{isEditing && session?.user?.role === "admin" ? (
                        <input
                          type="text"
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          className="p-2 border rounded"
                        />
                      ) : (
                        getuser.role
                      )}*/}
                      {getuser.role}
                    </div>

                  <div className="text-lg text-gray-700">
                    <strong>Tel:</strong> {isEditing ? (
                      <input
                        type="text"
                        value={formData.tel}
                        onChange={(e) => setFormData({ ...formData, tel: e.target.value })}
                        className="p-2 border rounded"
                      />
                    ) : (
                      getuser.tel
                    )}
                  </div>
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

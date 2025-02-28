'use client'
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import axios from 'axios';

const ChangePasswordPage = () => {
  const { data: session } = useSession();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChangePassword = async () => {
    if (!session || !session.user) {
      setError('กรุณาล็อกอินเพื่อเปลี่ยนรหัสผ่าน');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('รหัสผ่านใหม่ไม่ตรงกัน');
      return;
    }

    try {
        console.log(session.user.username)
      const res = await axios.put(`/api/auth/changeps/${session.user.username}`, {
        oldPassword,
        newPassword,
      });

      if (res.status === 200) {
        setSuccess('เปลี่ยนรหัสผ่านสำเร็จ');
        
      } else {
        setError('เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
    }
  };

  return (
    <div className="flex h-full items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-semibold text-center mb-4">เปลี่ยนรหัสผ่าน</h2>

        {error && <div className="text-red-600 text-center mb-4">{error}</div>}
        {success && <div className="text-green-600 text-center mb-4">{success}</div>}

        <div className="space-y-4">
          <div>
            <label htmlFor="oldPassword" className="block text-gray-700">รหัสผ่านเก่า</label>
            <input
              id="oldPassword"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-gray-700">รหัสผ่านใหม่</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700">ยืนยันรหัสผ่านใหม่</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleChangePassword}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            เปลี่ยนรหัสผ่าน
          </button>
        </div>

        <div className="mt-6">
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700 transition duration-300"
          >
            ออกจากระบบ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;

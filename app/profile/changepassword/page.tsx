'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react'; // ใช้ useSession เพื่อดึง session

const ChangePassword = () => {
  const { data: session, status } = useSession(); // ดึง session และสถานะจาก next-auth
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // ตรวจสอบว่ารหัสผ่านใหม่และรหัสผ่านยืนยันตรงกัน
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    // ตรวจสอบความยาวของรหัสผ่านใหม่
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    try {
      const response = await axios.post('/api/auth/changepassword', { oldPassword, newPassword });
      setMessage('Password changed successfully');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error changing password');
    }
  };

  // เช็คว่า session ยังไม่มีหรือล็อกอินแล้วหรือยัง
  if (status === 'loading') {
    return <p>Loading...</p>; // ระหว่างที่กำลังโหลด session
  }

  if (!session) {
    return <p>You must be logged in to change your password</p>; // หากไม่พบ session
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-4">Change Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="oldPassword">
            Old Password
          </label>
          <input
            id="oldPassword"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="newPassword">
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="confirmPassword">
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Change Password
        </button>
        {message && <p className="mt-4 text-green-500">{message}</p>}
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default ChangePassword;

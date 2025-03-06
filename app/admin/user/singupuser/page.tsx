'use client'

import { useState, FormEvent } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function SignUp() {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [firstName, setFirstName] = useState<string>('')  // เพิ่ม state สำหรับชื่อจริง
  const [lastName, setLastName] = useState<string>('')    // เพิ่ม state สำหรับนามสกุล
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  const handleSignUpSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!username || !password || !firstName || !lastName) {
      setErrorMessage('กรุณากรอกข้อมูลให้ครบถ้วน')
      return
    }

    setLoading(true)
    try {
      await axios.post('/api/auth/signup', { username, password, name: firstName, surname: lastName })
      router.push('/admin/user')
    } catch (error) {
      setErrorMessage('การสมัครสมาชิกล้มเหลว หรือ ชื่อผู้ใช้ซ้ำ กรุณาลองใหม่อีกครั้ง')
    } finally {
      setLoading(false)
    }
    
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="mt-4 bg-white p-8 rounded-xl shadow-md w-full max-w-2xl">
        {errorMessage && <div className="text-red-600 text-center text-sm mb-4">{errorMessage}</div>}
        <form onSubmit={handleSignUpSubmit}>
          <h2 className="text-3xl font-bold text-center text-black mb-2">สมัครรหัสผ่าน</h2>
          <h1 className="text-xl text-center text-black mb-4">
            โปรดกรอกข้อมูลเพื่อสมัครรหัสผ่าน
          </h1>
  
          {/* Grid สำหรับจัดวาง input */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ชื่อผู้ใช้ */}
            <div>
              <label htmlFor="username" className="block text-xl font-medium text-black mb-1">ชื่อผู้ใช้</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full border border-gray-300 px-5 py-3 rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
  
            {/* รหัสผ่าน */}
            <div>
              <label htmlFor="password" className="block text-xl font-medium text-black mb-1">รหัสผ่าน</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 px-5 py-3 rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
  
            {/* ชื่อจริง */}
            <div>
              <label htmlFor="firstName" className="block text-xl font-medium text-black mb-1">ชื่อจริง</label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full border border-gray-300 px-5 py-3 rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
  
            {/* นามสกุล */}
            <div>
              <label htmlFor="lastName" className="block text-xl font-medium text-black mb-1">นามสกุล</label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full border border-gray-300 px-5 py-3 rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
  
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-6 bg-[#7EDBE9] text-white py-3 rounded-lg text-2xl font-semibold hover:bg-[#00CCFF] transition duration-300"
            disabled={loading}
          >
            {loading ? 'กำลังตรวจสอบ...' : 'สมัครสมาชิก'}
          </button>
        </form>
      </div>
    </div>
  );  
}

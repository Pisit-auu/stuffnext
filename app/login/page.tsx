'use client'

import { useState, FormEvent } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignIn() {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  const handleSignInSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!username || !password) {
      setErrorMessage('Both fields are required')
      return
    }

    setLoading(true)
    setErrorMessage('')

    try {
      const result = await signIn('credentials', {
        redirect: false,
        username,
        password,
      })

      if (result?.error) {
        setErrorMessage("ชื่อผู้ใช้ หรือ รหัสผ่านไม่ถูกต้อง")
      } else {
        router.push('/')
      }
    } catch (error) {
      setErrorMessage('เกิดข้อผิดพลาดที่ไม่คาดคิด โปรดลองอีกครั้ง.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-100">
      {/* Left - Logo & Text */}
      <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
        <Link href="/">
          <button className="mt-4 text-6xl font-bold text-[#113FB3] hover:text-[#3333FF] transition duration-100">▎Srinakarin</button>
        </Link>
        <p className="mt-6 text-1xl text-gray-600">
          เข้าถึงและจัดการสินค้าคงคลังอุปกรณ์ของโรงเรียน
        </p>
      </div>

      {/* Right - Form */}
      <div className="md:w-1/2 max-w-lg">
        <form onSubmit={handleSignInSubmit} className="bg-white p-10 rounded-xl shadow-md w-full">
          <h2 className="text-5xl font-bold text-center text-black mb-6">ยินดีต้อนรับ</h2>
          <h1 className="text-2xl text-center text-black mb-8">
            โปรดกรอกข้อมูลเพื่อเข้าสู่ระบบ
          </h1>

          {/* Error Message */}
          {errorMessage && (
            <div className="text-red-600 text-lg mb-6">{errorMessage}</div>
          )}

          {/* Username */}
          <div className="mb-6">
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

          {/* Password */}
          <div className="mb-8">
            <label htmlFor="password" className="block text-xl font-medium text-black">รหัสผ่าน</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 px-5 py-3 rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#7EDBE9] text-white py-3 rounded-lg text-2xl font-semibold hover:bg-[#00CCFF] transition duration-300"
            disabled={loading}
          >
            {loading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
      </div>
    </div>
  )
}
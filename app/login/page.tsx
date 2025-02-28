'use client'

import { useState, FormEvent, useEffect } from 'react'
import { signIn, SignInResponse } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link';

export default function SignIn() {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  // ฟังก์ชันเข้าสู่ระบบ
  const handleSignInSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMessage('Both fields are required');
      return;
    }
  
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        username,
        password,
      });
  
      if (!result) {
        setErrorMessage('Sign-in failed. Please try again.');
        return;
        }else {
          router.push('/')
        }
  
      if (result.error) {
        setErrorMessage(result.error);
      } 
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen  bg-gray-100">

      {/* Left - Logo & Text */}
      <div className=" md:w-1/2  text-center md:text-left mb-8 md:mb-0 ">
      <Link href={"/"}><h1 className="text-6xl font-bold text-human_C5A880 hover:text-black transition duration-100">Srinakarin</h1></Link>
        <p className="mt-4 text-lg text-gray-600">
          {'เข้าถึงและจัดการสินค้าคงคลังอุปกรณ์ของโรงเรียน'}
        </p>
      </div>

      {/* Right - Form */}
      <div className=" md:w-1/2  max-w-md  ">
        <form
          onSubmit={ handleSignInSubmit}
          className="bg-white p-8 rounded-xl shadow-md w-full"
        >
          <h2 className="text-4xl font-bold text-center text-black mb-6">
            {'Sign In'}
          </h2>

          {/* ข้อความข้อผิดพลาด */}
          {errorMessage && (
            <div className="text-red-600 text-sm mb-4">{errorMessage}</div>
          )}

          {/* Username */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-black">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-black">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-yellow-500 text-white py-2 rounded-lg text-lg font-semibold hover:bg-yellow-600 transition duration-300"
            disabled={loading}
          >
             {loading ? 'Processing...' : 'Sign In'}
          </button>

    
        </form>
      </div>
    </div>
  )
}

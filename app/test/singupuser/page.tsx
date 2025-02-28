// src/app/signup/page.tsx
'use client'

import { useState, FormEvent } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function SignUp() {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  const handleSignUpSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!username || !password) {
      setErrorMessage('Both fields are required')
      return
    }

    setLoading(true)
    try {
      await axios.post('/api/auth/signup', { username, password })
      router.push('/admin/user')
    } catch (error) {
      setErrorMessage('Sign Up failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-4xl font-bold text-center text-black mb-6">Sign Up</h2>
        {errorMessage && <div className="text-red-600 text-sm mb-4">{errorMessage}</div>}
        <form onSubmit={handleSignUpSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-black">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded-lg text-lg"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-black">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded-lg text-lg"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-500 text-white py-2 rounded-lg text-lg font-semibold"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Sign Up'}
          </button>
        </form>

      </div>
    </div>
  )
}

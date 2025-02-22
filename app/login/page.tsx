'use client'

import { useState, FormEvent } from 'react'
import { signIn, SignInResponse } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function SignIn() {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isSignUp, setIsSignUp] = useState<boolean>(false)
  const router = useRouter()

  const handleSignInSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const result: SignInResponse | { error: string } = await signIn('credentials', {
        redirect: false,
        username,
        password,
      })

      if (result.error) {
        console.error(result.error)
      } else {
        router.push('/')
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const handleSignUpSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await axios.post('/api/auth/signup', {
        username,
        password,
      })
      router.push('/login') // Redirect to login page after sign up
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex h-full items-center justify-center ">
      <form
        onSubmit={isSignUp ? handleSignUpSubmit : handleSignInSubmit}
        className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </h2>
        <div className="mb-6">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full border border-gray-300 px-4 py-3 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 px-4 py-3 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300"
        >
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-600 hover:underline text-sm"
          >
            {isSignUp ? 'Already have an account? Sign In' : 'Don\'t have an account? Sign Up'}
          </button>
        </div>
      </form>
    </div>
  )
}

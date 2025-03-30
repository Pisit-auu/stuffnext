'use client'

import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function CreateCategory() {
  const [name, setCategoryname] = useState('')
  const router = useRouter()
  //สร้างประเภทของห้อง
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await axios.post('/api/categoryroom', {  name })
      router.push('/admin')
    } catch (error) {
      console.log(error)
      alert('ชื่อของประเภทซ้ำ')
    }
  }

  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
      <h1 className="text-2xl font-bold text-gray-700 mb-6 text-center">
        สร้างประเภทของสถานที่
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-600">
            ชื่อประเภทของสถานที่
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="ใส่ชื่อประเภท..."
            value={name}
            onChange={(e) => setCategoryname(e.target.value)}
            className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm p-3 focus:border-indigo-500 focus:ring-indigo-500 text-gray-700"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          สร้างประเภท
        </button>
      </form>
    </div>
  )
}

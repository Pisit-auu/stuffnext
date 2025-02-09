'use client'

import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function create(){
  const [namelocation, setNamelocation] = useState('')
  const [nameteacher, setNameteacher] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await axios.post('/api/location', { namelocation, nameteacher })
      router.push('/admin')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">เพิ่มสถานที่ใหม่</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="namelocation"
            className="block text-sm font-medium text-slate"
          >
            ชื่อสถานที่
          </label>
          <input
            type="text"
            name="namelocation"
            id="namelocation"
            required
            value={namelocation}
            onChange={(e) => setNamelocation(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-slate"
          >
            ชื่อผู้ที่รับผิดชอบสถานที่
          </label>
          <textarea
            name="name"
            id="name"
            required
            rows={1}
            value={nameteacher}
            onChange={(e) => setNameteacher(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          ></textarea>
        </div>
        <div>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            ยืนยัน
          </button>
        </div>
      </form>
    </div>
  )
}

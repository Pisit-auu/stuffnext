'use client'

import axios from 'axios'
import { useRouter, useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function EditCategory() {
  const [name, setCategoryname] = useState('')
  const router = useRouter()
  const { id } = useParams() as { id: string }

  useEffect(() => {
    if (id) {
      fetchCategory(id)
    }
  }, [id])

  const fetchCategory = async (id: string) => {
    try {
      const res = await axios.get(`/api/categoryroom/${id}`)
      setCategoryname(res.data.name)
    } catch (error) {
      alert('เกิดข้อผิดพลาด')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.put(`/api/categoryroom/${id}`, { name })
      router.push('/admin')
    } catch (error) {
      alert('รหัสตัวแรกของประเภทครุภัณฑ์ซ้ำ ไม่สามารถแก้ไขได้')
    }
  }

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
      <h1 className="text-2xl font-bold text-gray-700 mb-6 text-center">
        แก้ไขประเภทของสถานที่
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-600">
            ชื่อประเภทของสถานที่
          </label>
          <textarea
            id="name"
            name="name"
            required
            rows={2}  // ลดจำนวนแถวลง
            value={name}
            onChange={(e) => setCategoryname(e.target.value)}
            className="mt-2 block w-full max-w-md mx-auto rounded-md border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500 text-gray-700"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          อัพเดตประเภท
        </button>
      </form>
    </div>
  )
}

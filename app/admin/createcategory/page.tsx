'use client'

import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function CreateCategory() {
  const [idname, setCategoryid] = useState('')
  const [name, setCategoryname] = useState('')
  const router = useRouter()
  //ประเภทของครุภัณฑ์
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await axios.post('/api/category', { idname, name })
      router.push('/admin')
    } catch (error) {
      console.log(error)
      alert('ชื่อรหัสตัวแรกของครุภัณฑ์ถูกใช้ไปแล้ว')
    }
  }

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
      <h1 className="text-2xl font-bold text-gray-700 mb-6 text-center">
        สร้างประเภทครุภัณฑ์
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="idname" className="block text-sm font-medium text-gray-600">
            รหัสตัวแรกของประเภทครุภัณฑ์
          </label>
          <input
            type="text"
            id="idname"
            name="idname"
            required
            placeholder="ใส่รหัสตัวแรก เช่น ก, ข, ค..."
            value={idname}
            onChange={(e) => setCategoryid(e.target.value)}
            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm p-3 focus:border-indigo-500 focus:ring-indigo-500 text-gray-700"
          />
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-600">
            ชื่อประเภทครุภัณฑ์
          </label>
          <textarea
            id="name"
            name="name"
            required
            placeholder="ใส่ชื่อประเภท เช่น การศึกษา,สำนักงาน..."
            rows={3}
            value={name}
            onChange={(e) => setCategoryname(e.target.value)}
            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm p-3 focus:border-indigo-500 focus:ring-indigo-500 text-gray-700"
          ></textarea>
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

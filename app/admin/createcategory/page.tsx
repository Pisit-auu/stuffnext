'use client'

import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function create(){
  const [idname, setCategoryid] = useState('')
  const [name, setCategoryname] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await axios.post('/api/category', { idname, name })
      router.push('/admin')
    } catch (error) {
      console.log(error)
      // แสดงข้อความแค่ใน console แต่ไม่ให้แสดง error แบบละเอียดแก่ผู้ใช้
      alert('ชื่อรหัสตัวแรกของครุภัณฑ์ถูกใช้ไปแล้ว')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">สร้างประเภทครุภัณฑ์</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="Category"
            className="block text-sm font-medium text-slate"
          >
            รหัสตัวแรกของประเภทครุภัณฑ์ 
          </label>
          <input
            type="text"
            name="Category"
            id="Category"
            required
            value={idname}
            onChange={(e) => setCategoryid(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-slate"
          >
            ชื่อประเภทครุภัณฑ์
          </label>
          <textarea
            name="name"
            id="name"
            required
            rows={4}
            value={name}
            onChange={(e) => setCategoryname(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          ></textarea>
        </div>
        <div>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            สร้าง
          </button>
        </div>
      </form>
    </div>
  )
}

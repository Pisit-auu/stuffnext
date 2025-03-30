'use client'
import axios from 'axios'
import { useRouter, useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function Edit() {
  const [idname, setCategoryid] = useState('')
  const [name, setCategoryname] = useState('')
  const router = useRouter()
  const { id } = useParams() as { id: string }

  useEffect(() => {
    if (id) {
      fetchPost(id)
    }
  }, [id])
//ดึงข้อมูลเก่าประเภทของครุภัณฑ์
  const fetchPost = async (id: string) => {
    try {
      const res = await axios.get(`/api/category/${id}`)
      setCategoryid(res.data.idname)
      setCategoryname(res.data.name)
    } catch (error) {
      console.error(error)
    }
  }
//อัพเดตประเภทของครุภัณฑ์
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.put(`/api/category/${id}`, { idname, name })
      router.push('/admin')
    } catch (error) {
      alert('รหัสตัวแรกของประเภทครุภัณฑ์ซ้ำ ไม่สามารถแก้ไขได้')
    }
  }

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
      <h1 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
        แก้ไขประเภทครุภัณฑ์
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="idname" className="block text-sm font-medium text-gray-700">
            รหัสตัวแรกของประเภทครุภัณฑ์
          </label>
          <input
            type="text"
            id="idname"
            required
            value={idname}
            onChange={(e) => setCategoryid(e.target.value)}
            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm p-3 text-sm font-medium focus:border-indigo-500 focus:ring-indigo-500 text-gray-700"
          />
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            ชื่อประเภทครุภัณฑ์
          </label>
          <textarea
            id="name"
            required
            rows={4}
            value={name}
            onChange={(e) => setCategoryname(e.target.value)}
            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm p-3 text-sm font-medium focus:border-indigo-500 focus:ring-indigo-500 text-gray-700"
          ></textarea>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="py-3 px-6 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            อัพเดต
          </button>
        </div>
      </form>
    </div>
  )
}

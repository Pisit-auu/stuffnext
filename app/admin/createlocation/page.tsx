'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function Create() {
  const [namelocation, setNamelocation] = useState('')
  const [nameteacher, setNameteacher] = useState('')
  const [listcategory, setlistCategory] = useState([]);
  const [categoryIdroom, setCategory] = useState('');

  const router = useRouter()

  useEffect(() => {
    fetchCategories();
  }, []);

  //ดึงข้อมูลประเภทของห้อง
  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/categoryroom');
      setlistCategory(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // สร้างสถานที่
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await axios.post('/api/location', { namelocation, nameteacher, categoryIdroom: Number(categoryIdroom) })
      router.push('/admin')
    } catch (error) {
      alert('ชื่อห้องถูกตั้งไปแล้ว')
    }
  }

  return (
    <div className="max-w-2xl mx-auto m-8 px-4 py-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold mb-6 text-center">เพิ่มสถานที่ใหม่</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Input for location name */}
        <div>
          <label htmlFor="namelocation" className="block text-sm font-medium text-gray-700">
            ชื่อสถานที่
          </label>
          <input
            type="text"
            name="namelocation"
            id="namelocation"
            required
            value={namelocation}
            onChange={(e) => setNamelocation(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
          />
        </div>

        {/* Textarea for teacher name */}
        <div>
          <label htmlFor="nameteacher" className="block text-sm font-medium text-gray-700">
            ชื่อผู้ที่รับผิดชอบสถานที่
          </label>
          <textarea
            name="nameteacher"
            id="nameteacher"
            required
            rows={1}
            value={nameteacher}
            onChange={(e) => setNameteacher(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
          ></textarea>
        </div>

        {/* Select category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">ประเภทของสถานที่</label>
          <select
            value={categoryIdroom}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 w-full"
          >
            <option value="">เลือกประเภทของสถานที่</option>
            {listcategory.map((category: any) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit button */}
        <div className="flex justify-center">
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

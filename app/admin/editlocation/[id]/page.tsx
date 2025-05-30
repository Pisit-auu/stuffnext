'use client'
import axios from 'axios'
import { useRouter,useParams  } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function Edit() {
    const [namelocation, setNamelocation] = useState('')
  const [nameteacher, setNameteacher] = useState('')
  const router = useRouter()
  const { id } = useParams() as { id: string }
  const [listcategory, setlistCategory] = useState([]);
  const [categoryroomid,setcategoryroomid]= useState('')
  //ดึงข้อมูลเก่า
  const fetchPost = async (id:string) => {
    try {
      const res = await axios.get(`/api/location/${id}`)
      setNamelocation(res.data.namelocation)
      setNameteacher(res.data.nameteacher)
      setcategoryroomid(res.data.categoryIdroom)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);
  //ดึงข้อมูลปรเภทของห้อง
  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/categoryroom');
      setlistCategory(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (id) {
      fetchPost(id)
    }
  }, [id])

  //อัพเดตข้อมูล
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await axios.put(`/api/location/${id}`, {
        namelocation,
        nameteacher,
        categoryIdroom:Number(categoryroomid)
      })
      router.push('/admin')
    } catch (error) {
      alert('ชื่อห้องถูกใช้ไปแล้ว ไม่สามารถอัพเดตซ้ำได้')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">แก้ไข สถานที่</h1>
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
            name="nameteacher"
            id="nameteacher"
            required
            rows={1}
            value={nameteacher}
            onChange={(e) => setNameteacher(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">ประเภทของสถานที่</label>
          <select
          value={categoryroomid || ''} 
          onChange={(e) => setcategoryroomid(e.target.value)}
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
        <div>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#113FB3] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            แก้ไข
          </button>
        </div>
      </form>
    </div>
  )
}

'use client'

import React, { useState,useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'


const Create = () => {
  const [assetid, setAssetid] = useState('')
  const [name, setAssetname] = useState('')
  const [img, setImg] = useState('')
  const [categoryId, setCategory] = useState('')
  const [listcategory, setlistCategory] = useState([])
  const [availableValue, setAvailableValue] = useState(0)
  const [unavailableValue, setunAvailableValue] = useState(0)
 

  const router = useRouter()
  useEffect(() => {
    fetchCategorys()
    
  }, [])

  const fetchCategorys = async () => {
    try {
      const rescategoty = await axios.get('/api/category')
      setlistCategory(rescategoty.data)
    } catch (error) {
      console.error(error)
    }
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if(!categoryId){
        alert("เลือกประเภทครุภัณฑ์")
    }
    console.log(categoryId)
    try {
      await axios.post('/api/asset', { name,img, assetid,categoryId,availableValue,unavailableValue})
      router.push('/admin')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">เพิ่มครุภัณฑ์</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="Asset"
            className="block text-sm font-medium text-slate"
          >
            ชื่อครุภัณฑ์
          </label>
          <input
            type="text"
            name="Asset"
            id="Asset"
            required
            value={name}
            onChange={(e) => setAssetname(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="Assetid"
            className="block text-sm font-medium text-slate"
          >
            รหัสครุภัณฑ์
          </label>
          <input
            type="text"
            name="Assetid"
            id="Assetid"
            required
            value={assetid}
            onChange={(e) => setAssetid(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
       
        <div>
          <label
            htmlFor="Category"
            className="block text-sm font-medium text-slate"
          >
            รูปภาพ
          </label>
          <input
            type="text"
            name="Category"
            id="Category"
            required
            value={img}
            onChange={(e) => setImg(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className='mr-8'>ประเภทครุภัณฑ์</label>

          <select
                value={categoryId}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
              >
                <option value="">เลือกประเภทครุภัณฑ์</option>
                {listcategory.map((categorys: any) => (
                  <option key={categorys.idname} value={categorys.idname}>
                    {categorys.name}
                  </option>
                ))}
              </select>
        </div>

        <div>
          <label
            htmlFor="Available"
            className="block text-sm font-medium text-slate"
          >
            จำนวนที่พร้อมใช้งาน
          </label>
          <input
            type="number"
            name="Available"
            id="Available"
            required
            value={availableValue}
            onChange={(e) => setAvailableValue(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="unavailable"
            className="block text-sm font-medium text-slate"
          >
            จำนวนที่เสีย
          </label>
          <input
            type="number"
            name="unavailable"
            id="unavailable"
            required
            value={unavailableValue}
            onChange={(e) => setunAvailableValue(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        
        <div>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            เพิ่ม
          </button>
        </div>
      </form>
    </div>
  )
}

export default Create
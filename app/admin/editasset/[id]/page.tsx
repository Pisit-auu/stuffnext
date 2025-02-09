'use client'
import axios from 'axios'
import { useRouter ,useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
export default function Edit() {
  const { id } = useParams() as { id: string }
  const [assetid, setAssetid] = useState('')
  const [name, setAssetname] = useState('')
  const [img, setImg] = useState('')
  const [categoryId, setCategory] = useState('')
  const [listcategory, setlistCategory] = useState([])
  const [availableValue, setAvailableValue] = useState('')
  const [unavailableValue, setunAvailableValue] = useState('')
  const router = useRouter()
  const fetchPost = async (id:string) => {
    try {
      const resasset = await axios.get(`/api/asset/${id}`)
      const rescategory = await axios.get('/api/category')
      setAssetname(resasset.data.name)
      setImg(resasset.data.img)
      setCategory(resasset.data.category)
      setAssetid(resasset.data.assetid)
      setAvailableValue(resasset.data.availableValue)
      setunAvailableValue(resasset.data.unavailableValue)
      setlistCategory(rescategory.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (id) {
      fetchPost(id)
    }
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log(categoryId.idname)

    try {
      await axios.put(`/api/asset/${id}`, {
        name,
        img,
        assetid,
        categoryId : categoryId.idname,
        availableValue,
        unavailableValue

      })
      router.push('/admin')
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Edit  Asset</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="Asset"
            className="block text-sm font-medium text-slate"
          >
            Asset Name
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
            Asset ID
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
            Image
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
          <label>Category</label>
          <select
            value={categoryId.name}
            onChange={(e) => setCategory(JSON.parse(e.target.value))}  >
            <option  key={categoryId.idname} value={categoryId}>{categoryId.name}</option>
             {  listcategory.filter((categorys) => categorys.name !== categoryId.name).map((categorys) => (
              <option  key={categorys.idname}   value={JSON.stringify({ id: categorys.id, idname: categorys.idname, name: categorys.name })}>{categorys.name}</option>
            ))}
          
          </select>
        </div>

        <div>
          <label
            htmlFor="Available"
            className="block text-sm font-medium text-slate"
          >
            Available Quantity
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
            Unvailable Quantity
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
            Submit
          </button>
        </div>
      </form>




    </div>
  )
}

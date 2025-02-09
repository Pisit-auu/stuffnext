'use client'
import axios from 'axios'
import { useRouter,useParams  } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function Edit() {
    const [idname, setCategoryid] = useState('')
  const [name, setCategoryname] = useState('')
  const router = useRouter()
  const { id } = useParams() as { id: string }

  const fetchPost = async (id:string) => {
    try {
      const res = await axios.get(`/api/category/${id}`)
      setCategoryid(res.data.idname)
      setCategoryname(res.data.name)
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

    try {
      await axios.put(`/api/category/${id}`, {
        idname,
        name,
      })
      router.push('/admin')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Edit Category</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-slate"
          >
            ID Name
          </label>
          <input
            type="text"
            name="title"
            id="title"
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
            Category Name
          </label>
          <textarea
            name="content"
            id="content"
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
            Update
          </button>
        </div>
      </form>
    </div>
  )
}

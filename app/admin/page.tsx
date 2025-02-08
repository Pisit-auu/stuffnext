'use client'
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

export default function Admin() {
    const [categorys, setCategory] = useState([])

  useEffect(() => {
    fetchCategorys()
  }, [])

  const fetchCategorys = async () => {
    try {
      const res = await axios.get('/api/category')
      setCategory(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  const deleteCategoty = async (id: Number) => {
    try {
      await axios.delete(`/api/category/${id}`)
      fetchCategorys()
    } catch (error) {
      console.error('Failed to delete the post', error)
    }
  }
    

  return (
    <div className="">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-semibold mb-6">Category</h1>
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categorys.map((categorys: any) => (
              <tr key={categorys.idname}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {categorys.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                    href={`/admin/editcategory/${categorys.idname}`}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteCategoty(categorys.idname)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link
        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        href="/admin/createcategory"
      >
        Create a Category
      </Link>
    </div>
    </div>
  );
}

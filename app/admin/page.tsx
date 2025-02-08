'use client'
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

export default function Admin() {
    const [categorys, setCategory] = useState([])
    const [asset, setAsset] = useState([])
    const [searchCategory, setSearchCategory] = useState('')
    const [searchAsset, setSearchAsset] = useState('')
    const [category, setSelectCategory] = useState('')
    const [sort, setSort] = useState('desc')

    useEffect(() => {
      fetchCategorys()
    }, [])

    const fetchCategorys = async () => {
      try {
        const rescategoty = await axios.get('/api/category')
        const resasset = await axios.get('/api/asset')
        setCategory(rescategoty.data)
        setAsset(resasset.data)
      } catch (error) {
        console.error(error)
      }
    }

    useEffect(() => {
      fetchAsset()
    }, [searchAsset, category, sort])

    const fetchAsset = async () => {
      try {
        const query = new URLSearchParams({ category, search: searchAsset, sort }).toString()
        const resasset = await axios.get(`/api/asset?${query}`)
        setAsset(resasset.data)
      } catch (error) {
        console.error(error)
      }
    }

    const handleApplyFilters = () => {
      fetchAsset()
    }

    useEffect(() => {
      fetchCategory()
    }, [searchCategory])

    const fetchCategory = async () => {
      try {
        const query = new URLSearchParams({ search: searchCategory }).toString()
        const res = await axios.get(`/api/category?${query}`)
        setCategory(res.data)
      } catch (error) {
        console.error(error)
      }
    }

    const deleteCategory = async (id: string) => {
      try {
        await axios.delete(`/api/category/${id}`)
        fetchCategorys()
      } catch (error) {
        console.error('Failed to delete the category', error)
      }
    }

    const deleteAsset = async (id: string) => {
      try {
        await axios.delete(`/api/asset/${id}`)
        fetchAsset() // เพิ่มการเรียก fetchAsset เมื่อมีการลบ Asset
      } catch (error) {
        console.error('Failed to delete the asset', error)
      }
    }

    return (
      <div className="">

        {/* Asset Section */}
        <div className="max-w-6xl mx-auto px-4 py-8">   
          
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search by title..."
                value={searchAsset}
                onChange={(e) => setSearchAsset(e.target.value)}
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select
                value={category}
                onChange={(e) => setSelectCategory(e.target.value)}
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Category</option>
                {categorys.map((cat: any) => (
                  <option key={cat.idname} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="desc">Latest</option>
                <option value="asc">Oldest</option>
              </select>
              <button
                onClick={handleApplyFilters}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>

          <h1 className="text-2xl font-semibold mb-6">Asset</h1>
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asset_ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {asset.map((Asset: any) => (
                  <tr key={Asset.assetid}>
                    <td className="px-6 py-4 whitespace-nowrap">{Asset.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{Asset.assetid}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{Asset.category.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link className="text-indigo-600 hover:text-indigo-900 mr-4" href={`/admin/editasset/${Asset.assetid}`}>
                        Edit
                      </Link>
                      <button onClick={() => deleteAsset(Asset.assetid)} className="text-red-600 hover:text-red-900">
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
            href="/admin/createasset"
          >
            Create an Asset
          </Link>
        </div>

        {/* Category Section */}
        
        <div className="max-w-6xl mx-auto px-4 py-8">
        <input
              type="text"
              placeholder="Search by title..."
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="my-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          <h1 className="text-2xl font-semibold mb-6">Category</h1>
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">

            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categorys.map((category: any) => (
                  <tr key={category.idname}>
                    <td className="px-6 py-4 whitespace-nowrap">{category.idname}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{category.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link className="text-indigo-600 hover:text-indigo-900 mr-4" href={`/admin/editcategory/${category.idname}`}>
                        Edit
                      </Link>
                      <button onClick={() => deleteCategory(category.idname)} className="text-red-600 hover:text-red-900">
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
    )
}

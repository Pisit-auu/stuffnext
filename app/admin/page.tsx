'use client'
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import '@ant-design/v5-patch-for-react-19';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Flex } from 'antd';
export default function Admin() {
    const [categorys, setCategory] = useState([])
    const [asset, setAsset] = useState([])
    const [searchCategory, setSearchCategory] = useState('')
    const [searchAsset, setSearchAsset] = useState('')
    const [category, setSelectCategory] = useState('')
    const [sort, setSort] = useState('desc')
    const [locations, setLocation] = useState([])
    const [searchLocation, setSearchLocation] = useState('')
    useEffect(() => {
      fetchCategory()
    }, [searchCategory])
    useEffect(() => {
      fetchLocation()
    }, [searchLocation])
    useEffect(() => {
      fetchAsset()
    }, [searchAsset, category, sort])

    const fetchLocation = async () => {
      try {
        const query = new URLSearchParams({ search: searchLocation }).toString()
        const res = await axios.get(`/api/location?${query}`)
        setLocation(res.data)
      } catch (error) {
        console.error(error)
      }
    }
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
        fetchCategory()
        fetchAsset()
        fetchLocation()
      } catch (error) {
        console.error('Failed to delete the category', error)
      }
    }
    const deletelocation = async (id: string) => {
      try {
        await axios.delete(`/api/location/${id}`)
        fetchCategory()
        fetchAsset()
        fetchLocation()
      } catch (error) {
        console.error('Failed to delete the category', error)
      }
    }

    const deleteAsset = async (id: string) => {

      try { 
       await axios.delete(`/api/asset/${id}`)
        fetchCategory()
        fetchAsset()
        fetchLocation()
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
                placeholder="ค้นหาครุภัณฑ์"
                value={searchAsset}
                onChange={(e) => setSearchAsset(e.target.value)}
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select
                value={category}
                onChange={(e) => setSelectCategory(e.target.value)}
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
              >
                <option value="">เลือกประเภทครุภัณฑ์</option>
                {categorys.map((cat: any) => (
                  <option key={cat.idname} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
              >
                <option value="desc">ล่าสุด</option>
                <option value="asc">เก่าสุด</option>
              </select>
              <button
                onClick={handleApplyFilters}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                ค้นหา
              </button>
            </div>
          </div>

          <h1 className="text-2xl font-semibold mb-6">ครุภัณฑ์</h1>
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ชื่อครุภัณฑ์
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    รหัสครุภัณฑ์
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ประเภท
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ดำเนินการ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-slate-800">
                {asset.map((Asset: any) => (
                  <tr key={Asset.assetid}>
                    <td className="px-6 py-4 whitespace-nowrap">{Asset.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{Asset.assetid}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{Asset.category.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link className="text-indigo-600 hover:text-indigo-900 mr-4" href={`/admin/editasset/${Asset.assetid}`}>
                      <Button type="primary" ghost>
                          แก้ไข
                       </Button>
                      </Link>
                      <Popconfirm
                        title="Delete the task"
                        description="ยืนยันที่จะลบหรือไม่?"
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        onConfirm={() => deleteAsset(Asset.assetid)} 
                      >
                        <Button danger >Delete</Button>
                      </Popconfirm>
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
            เพิ่มครุภัณฑ์
          </Link>
        </div>

        {/* Category Section */}
        
        <div className="max-w-6xl mx-auto px-4 py-8">
        <input
              type="text"
              placeholder="ค้นหาประเภทครุภัณฑ์"
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="my-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          <h1 className="text-2xl font-semibold mb-6">ประเภทครุภัณฑ์</h1>
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg text-slate-800">

            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    รหัสครุภัณฑ์
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ประเภท
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ดำเนินการ
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
                      <Button type="primary" ghost>
                          แก้ไข
                       </Button>
                      </Link>
                      <Popconfirm
                        title="Delete the task"
                        description="ยืนยันที่จะลบหรือไม่? หากยืนยัน ข้อมูลครุภัณฑ์ของประเภทนี้จะถูกลบด้วย"
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        onConfirm={() => deleteCategory(category.idname)}
                      >
                        <Button danger >Delete</Button>
                      </Popconfirm>
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
            เพิ่มประเภทของครุภัณฑ์
          </Link>
        </div>

           {/* location */}
        
           <div className="max-w-6xl mx-auto px-4 py-8">
        <input
              type="text"
              placeholder="ค้นหาชื่อสถานที่"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="my-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          <h1 className="text-2xl font-semibold mb-6">สถานที่</h1>
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg text-slate-800">

            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                   สถานที่
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ผู้รับผิดชอบ
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ดำเนินการ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {locations.map((location: any) => (
                  <tr key={location.namelocation}>
                    <td className="px-6 py-4 whitespace-nowrap">{location.namelocation}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{location.nameteacher}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link className="text-indigo-600 hover:text-indigo-900 mr-4" href={`/admin/editlocation/${location.namelocation}`}>
                      <Button type="primary" ghost>
                          แก้ไข
                       </Button>
                      </Link>
                      <Popconfirm
                        title="Delete the task"
                        description="ยืนยันที่จะลบหรือไม่?"
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        onConfirm={() => deletelocation(location.namelocation)}
                      >
                        <Button danger >Delete</Button>
                      </Popconfirm>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            href="/admin/createlocation"
          >
            เพิ่มสถานที่
          </Link>
        </div>
      </div>
    )
}

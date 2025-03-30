'use client'
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import '@ant-design/v5-patch-for-react-19';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Flex, Menu } from 'antd';

export default function Admin() {
  //ประเภทครุภัณฑ์
    const [categorys, setCategory] = useState([])
  //ประเภทของห้อง
    const [categoryrooms, setCategoryroom] = useState([])
  //ครุภัณฑ์
    const [asset, setAsset] = useState([])
     //เก็บการค้นหา
    const [searchCategory, setSearchCategory] = useState('')
    const [searchCategoryroom, setSearchCategoryroom] = useState('')
    const [searchAsset, setSearchAsset] = useState('')
    const [category, setSelectCategory] = useState('')
    const [sort, setSort] = useState('desc')
    
    const [searchLocation, setSearchLocation] = useState('')
    const [categoryroom, setSelectCategoryroom] = useState('')

    
    const [locations, setLocation] = useState([])
    const [selectedMenu, setSelectedMenu] = useState('asset') // State to control which section to display

    useEffect(() => {
      fetchCategory()
    }, [searchCategory])

    useEffect(() => {
      fetchAsset()
    }, [searchAsset, category, sort])
    useEffect(() => {
      fetchLocation()
    }, [searchLocation, categoryroom])
    useEffect(() => {
      fetchCategoryroom()
    }, [searchCategoryroom])

    const fetchLocation = async () => {
      try {
        const query = new URLSearchParams({ 
          search: searchLocation, 
          categoryroom: categoryroom || '', 
        }).toString();
    
        const res = await axios.get(`/api/location?${query}`);
        setLocation(res.data); 
      } catch (error) {
        console.error(error);
      }
    };
    

    const fetchAsset = async () => {
      try {
        const query = new URLSearchParams({ category, search: searchAsset, sort }).toString()
        const resasset = await axios.get(`/api/asset?${query}`)
        setAsset(resasset.data)
      } catch (error) {
        console.error(error)
      }
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
    const fetchCategoryroom = async () => {
      try {
        const query = new URLSearchParams({ search: searchCategoryroom }).toString()
        const res = await axios.get(`/api/categoryroom?${query}`)
        setCategoryroom(res.data)
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
        fetchCategoryroom()
      } catch (error) {
        console.error('Failed to delete the category', error)
      }
    }
    const deleteCategoryroom = async (id: string) => {
      try {
        await axios.delete(`/api/categoryroom/${id}`)
        fetchCategory()
        fetchAsset()
        fetchLocation()
        fetchCategoryroom()
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
        fetchCategoryroom()
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
      <div className="flex min-h-screen">
      {/* Side Menu */}
      <div className="w-64 bg-white shadow-md">
        <Menu
          mode="inline"
          selectedKeys={[selectedMenu]}
          onClick={({ key }) => setSelectedMenu(key)}
          items={[
            { key: 'asset', label: 'ครุภัณฑ์' },
            { key: 'category', label: 'ประเภทครุภัณฑ์' },
            { key: 'location', label: 'สถานที่' },
            { key: 'categoryroom', label: 'ประเภทของสถานที่' },
          ]}
          style={{ height: '100vh', borderRight: 0 }} // ทำให้เมนูสูงเต็มจอ
        />
      </div>
    
              {/* Main Content */}
              <div className="flex-1 p-8">
            {selectedMenu === 'asset' && (
                  <div className="max-w-6xl mx-auto px-4 py-8">
                      <h1 className="text-2xl font-semibold mb-6">ครุภัณฑ์</h1>
                      <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-4">
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
          <Link
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#113FB3] hover:bg-[#3300CC] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            href="/admin/createasset"
          >
            เพิ่มครุภัณฑ์
          </Link>
        </div>

              </div>

              <div className="shadow overflow-x-auto border-b border-gray-200 sm:rounded-l">
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
            </div>
          )}
    
        {selectedMenu === 'category' && (
          <div className="max-w-6xl mx-auto px-4 py-8">
             <h1 className="text-2xl font-semibold mb-6">ประเภทครุภัณฑ์</h1>
                  <input
                    type="text"
                    placeholder="ค้นหาประเภทครุภัณฑ์"
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    className="my-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                                  <Link
                  className="ml-4 mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#113FB3] hover:bg-[#3300CC] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  href="/admin/createcategory"
                >
                  เพิ่มประเภทของครุภัณฑ์
                </Link>
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
            </div>
          )}
    
        {selectedMenu === 'location' && (
          <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">สถานที่</h1>
                  <input
                          type="text"
                          placeholder="ค้นหาชื่อสถานที่"
                          value={searchLocation}
                          onChange={(e) => setSearchLocation(e.target.value)}
                          className="my-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      <select
                      value={categoryroom}
                      onChange={(e) => setSelectCategoryroom(e.target.value)}
                      className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                    >
                      <option value="">เลือกประเภทของสถานที่</option>
                      {categoryrooms && categoryrooms.length > 0 ? (
                        categoryrooms.map((cat: any) => (
                          <option key={cat.id} value={cat.name}> {/* ใช้ cat.id แทน cat.name */}
                            {cat.name}
                          </option>
                        ))
                      ) : (
                        <option disabled>ไม่มีข้อมูลประเภทสถานที่</option>
                      )}
                    </select>
                   <Link
                      className="ml-4 mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#113FB3] hover:bg-[#3300CC] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      href="/admin/createlocation"
                    >
                      เพิ่มสถานที่
                    </Link>
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
                              ประเภท
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
                              <td className="px-6 py-4 whitespace-nowrap">{location.categoryroom ? location.categoryroom.name : 'ไม่มีหมวดหมู่'}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <Link className="text-indigo-600 hover:text-indigo-900 mr-4" href={`/admin/editlocation/${location.namelocation}`}>
                                <Button type="primary" ghost>
                                    แก้ไข
                                </Button>
                                </Link>
                                <Link className="text-indigo-600 hover:text-indigo-900 mr-4" href={`/admin/manageroom/${location.namelocation}`}>
                                <Button type="primary" ghost>
                                    จัดการของในห้อง
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
                  </div>
                
        
       
        )}

{selectedMenu === 'categoryroom' && (
          <div className="max-w-6xl mx-auto px-4 py-8">
             <h1 className="text-2xl font-semibold mb-6">ประเภทของสถานที่</h1>
                  <input
                    type="text"
                    placeholder="ค้นหาประเภทของสถานที่"
                    value={searchCategory}
                    onChange={(e) => setSearchCategoryroom(e.target.value)}
                    className="my-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                                  <Link
                  className="ml-4 mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#113FB3] hover:bg-[#3300CC] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  href="/admin/createcategoryroom"
                >
                  เพิ่มประเภทของสถานที่
                </Link>
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg text-slate-800">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        id
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ชื่อประเภท
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ดำเนินการ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categoryrooms.map((categoryroom: any) => (
                      <tr key={categoryroom.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{categoryroom.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{categoryroom.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link className="text-indigo-600 hover:text-indigo-900 mr-4" href={`/admin/editcategoryroom/${categoryroom.id}`}>
                          <Button type="primary" ghost>
                              แก้ไข
                           </Button>
                          </Link>
                          <Popconfirm
                            title="Delete the task"
                            description="ยืนยันที่จะลบหรือไม่? หากยืนยัน ข้อมูลครุภัณฑ์ของประเภทนี้จะถูกลบด้วย"
                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                            onConfirm={() => deleteCategoryroom(categoryroom.id)}
                          >
                            <Button danger >Delete</Button>
                          </Popconfirm>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
      </div>
    </div>
    )
}
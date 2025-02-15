'use client'
import Image from "next/image";
import Link from 'next/link'
import { Card } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button } from 'antd';

export default function Allasset() {
  const [category, setSelectCategory] = useState('')  // ตั้งค่า category
  const [searchAsset, setSearchAsset] = useState('')  // ตั้งค่าการค้นหาสินทรัพย์
  const [sort, setSort] = useState('desc')  // ตั้งค่าเรียงลำดับ
  const [asset, setAsset] = useState<any[]>([])  // ประกาศ state สำหรับเก็บข้อมูลสินทรัพย์

  // ฟังก์ชันดึงข้อมูลสินทรัพย์
  const fetchAsset = async () => {
    try {
      const query = new URLSearchParams({ category, search: searchAsset, sort }).toString()
      const resasset = await axios.get(`/api/asset?${query}`)
      setAsset(resasset.data)
    } catch (error) {
      console.error(error)
    }
  }

  // ใช้ useEffect เพื่อดึงข้อมูลเมื่อ component ถูก render
  useEffect(() => {
    fetchAsset()
  }, [category, searchAsset, sort])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 ">
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="🔍 ค้นหาชื่อสถานที่..."
          value={searchAsset}  // แก้เป็น searchAsset
          onChange={(e) => setSearchAsset(e.target.value)}  // แก้เป็น setSearchAsset
          className="w-full sm:w-96 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
      </div>

      {/* Grid Layout for Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {asset.map((assetItem) => (  // แก้เป็น asset แทน locations
          <Card
            key={assetItem.id} 
            title={assetItem.name}  // แสดงชื่อของสินทรัพย์
            bordered={false}
            className="shadow-sm hover:shadow-xl transition-all duration-300 rounded-lg"
          >
            <p className="text-gray-700 px-6 py-4">จำนวนทั้งหมด: {assetItem.availableValue+assetItem.unavailableValue}</p>
            <p className="text-gray-700 px-6 py-4">จำนวนที่พร้อมใช้งาน: {assetItem.availableValue}</p>
            <p className="text-gray-700 px-6 py-4">จำนวนที่เสีย: {assetItem.unavailableValue}</p>
            <Link
              className="mt-4 w-full inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              href={`asset/${assetItem.id}`}  // เพิ่มการเชื่อมไปยังรายละเอียดสินทรัพย์
            >
              ดู
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}

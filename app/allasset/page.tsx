'use client'

import Image from "next/image";
import Link from 'next/link'
import { Card } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button } from 'antd';

export default function Allasset() {
  const [category, setSelectCategory] = useState('')  
  const [searchAsset, setSearchAsset] = useState('')  
  const [sort, setSort] = useState('desc')  
  const [asset, setAsset] = useState<any[]>([])  
  const [assetlocation, setAssetlocation] = useState<any[]>([])  
  const [assetCount, setAssetCount] = useState<any[]>([])  
  const [categorys, setCategory] = useState([])
  const [searchCategory, setSearchCategory] = useState('')



  
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

  const fetchAsset = async () => {
    try {
      const query = new URLSearchParams({ category, search: searchAsset, sort }).toString()
      const resasset = await axios.get(`/api/asset?${query}`)
      setAsset(resasset.data)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchAssetlocation = async () => {
    try {
      const resasset = await axios.get(`/api/assetlocation`)
      setAssetlocation(resasset.data)
    } catch (error) {
      console.error(error)
    }
  }

  const count = () => {
    const countData = asset.map((assetItem) => {
      const matchingLocations = assetlocation.filter((loc) => loc.assetId === assetItem.assetid)
      let totalAvailable = 0
      let totalUnavailable = 0

      matchingLocations.forEach((loc) => {
        totalAvailable += loc.inRoomavailableValue
        totalUnavailable += loc.inRoomaunavailableValue
      })

      return {
        assetId: assetItem.assetid,
        totalAvailable,
        totalUnavailable,
        totalCount: totalAvailable + totalUnavailable,
      }
    })
    setAssetCount(countData)
  }

  useEffect(() => {
    fetchAsset()
    fetchAssetlocation()
  }, [category, searchAsset, sort])

  useEffect(() => {
    if (asset.length > 0 && assetlocation.length > 0) {
      count()  
    }
  }, [asset, assetlocation])

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 bg-gray-50">
      {/* ค้นหาครุภัณฑ์ */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="🔍 ค้นหาครุภัณฑ์..."
          value={searchAsset}
          onChange={(e) => setSearchAsset(e.target.value)}
          className="w-full sm:w-96 px-4 py-3 border border-gray-300 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
        <select
          value={category}
          onChange={(e) => setSelectCategory(e.target.value)}
          className="px-4 py-2 ml-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
        >
          <option value="">เลือกประเภทครุภัณฑ์</option>
          {categorys.map((cat: any) => (
            <option key={cat.idname} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {asset.length === 0 ? (
        <div className="text-center text-gray-500 text-lg font-semibold py-6">
          ❌ ไม่มีข้อมูลสินทรัพย์
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {asset.map((assetItem) => {
            const countData = assetCount.find((item) => item.assetId === assetItem.assetid)
            return (
              <Card
                key={assetItem.id}
                title={
                  <div className="text-lg font-bold text-gray-800 text-center">
                    {assetItem.name}
                  </div>
                }
                variant={"outlined"}
                className="shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl p-6 bg-white"
              >
                <div className="px-2 py-4 text-center">
                  <p className="text-gray-700 text-md">📦 จำนวนทั้งหมด: <span className="font-semibold">{assetItem.availableValue + assetItem.unavailableValue + (countData?.totalCount || 0)}</span></p>
                  <p className="text-green-600 text-md">✅ พร้อมใช้งาน: <span className="font-semibold">{assetItem.availableValue + (countData?.totalAvailable || 0)}</span></p>
                </div>
                <div className="flex justify-center mt-6">
                  <Link
                    className="w-full text-center px-4 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-md"
                    href={`allasset/${assetItem.assetid}`}
                  >
                    ดูรายละเอียด
                  </Link>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  );
}
'use client'
import Link from 'next/link'
import { Card } from 'antd';
import axios from 'axios'
import React, { useEffect, useState } from 'react';

export default function Allasset() {
  const [category, setSelectCategory] = useState('')  
  const [searchAsset, setSearchAsset] = useState('')  
  const [asset, setAsset] = useState<any[]>([])  
  const [assetlocation, setAssetlocation] = useState<any[]>([])  
  const [assetCount, setAssetCount] = useState<any[]>([])  
  const [categorys, setCategory] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryRes, assetRes, assetlocationRes] = await Promise.all([
          axios.get(`/api/category`),
          axios.get(`/api/asset`),
          axios.get(`/api/assetlocation`)
        ]);
        setCategory(categoryRes.data);
        setAsset(assetRes.data);
        setAssetlocation(assetlocationRes.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

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
    if (asset.length > 0 && assetlocation.length > 0) {
      count()  
    }
  }, [asset, assetlocation])

  const filteredAssets = asset.filter((assetItem) => {
    const matchesCategory = category ? assetItem.category.name === category : true;
    const matchesSearch = assetItem.name.toLowerCase().includes(searchAsset.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* ค้นหาครุภัณฑ์ */}
      <div className="flex justify-center items-center gap-4 mb-8">
        {/* Input Search */}
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="ค้นหาครุภัณฑ์..."
            value={searchAsset}
            onChange={(e) => setSearchAsset(e.target.value)}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          <button className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <img 
              src="search.png" 
              alt="ค้นหา"
              className="w-6 h-6"
            />
          </button>
        </div>

        {/* Category Dropdown */}
        <div className="relative w-48">
          <select
            value={category}
            onChange={(e) => setSelectCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            <option value="">เลือกประเภทครุภัณฑ์</option>
            {categorys.map((cat: any) => (
              <option key={cat.idname} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredAssets.length === 0 ? (
        <div className="text-center text-gray-500 text-lg font-semibold py-6">
          ❌ ไม่มีข้อมูลครุภัณฑ์
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">ชื่อครุภัณฑ์</th>
                <th className="py-2 px-4 border-b text-left">จำนวนทั้งหมด</th>
                <th className="py-2 px-4 border-b text-left">จำนวนพร้อมใช้งาน</th>
                <th className="py-2 px-4 border-b text-left">ดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((assetItem) => {
                const countData = assetCount.find((item) => item.assetId === assetItem.assetid)
                return (
                  <tr key={assetItem.id} className="odd:bg-gray-50 even:bg-white">
                    <td className="py-2 px-4 border-b">{assetItem.name}</td>
                    <td className="py-2 px-4 border-b">
                      {assetItem.availableValue + assetItem.unavailableValue + (countData?.totalCount || 0)}
                    </td>
                    <td className="py-2 px-4 border-b text-green-600">
                      {assetItem.availableValue + (countData?.totalAvailable || 0)}
                    </td>
                    <td className="py-2 px-4 border-b text-left">
                      <Link
                        className="block sm:inline-block w-full sm:w-auto px-4 py-2 rounded-lg bg-[#113FB3] text-center text-white hover:bg-indigo-600 transition-all"
                        href={`allasset/${assetItem.assetid}`}
                      >
                        ดูรายละเอียด
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}